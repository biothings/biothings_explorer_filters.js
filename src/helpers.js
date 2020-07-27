const axios = require("axios");
const biomedicalIdResolve = require("biomedical_id_resolver");
const _ = require("lodash");

/**
 * Function that batch queries MRCOC API and returns an array of the results
 * @param {Array.<String>} inputs Array of combo inputs (eg. ["D002518-D014463", "D002638-D016503"])
 * @param {Array.<String>} fields Array of fields to query for (eg. ["ngd_overall", "ngd_starred"])
 * @param {Number} [batchSize=100] Batch size of queries to MRCOC API
 * @returns {Array.<Object>} Array of return objects (same size as inputs)
 */
async function batchQuery(inputs, fields, batchSize=100) {
  let results = [];
  const config = { headers: {"content-type": "application/x-www-form-urlencoded"} };

  let batches = _.chunk(inputs, batchSize);  
  for (let batch of batches) {
    let searchParams = new URLSearchParams();
    searchParams.append("q", batch.join(","));
    searchParams.append("scopes", "combo");
    searchParams.append("fields", fields.join(","));

    let res = await axios.post("https://biothings.ncats.io/mrcoc/query", searchParams, config);
    results = results.concat(res.data);
  }

  return results;
}

/**
 * Gets ids that need to be resolved (not UMLS or MESH) in a format that can be passed straight into biomedical_id_resolver
 * @param {Array.<Object>} results Results from call_apis, in the shape of an array of objects
 * @returns {Object} object containing ids that need to be resolved in a shape that can easily be passed into biomedical_id_resolver
 */
function getIdsToResolve(results) {
  let idResolveInput = {}; 
  for (let result of results) {
    //add to input if input is not UMLS or MESH (output already has mappings in results)
    if (result["$association"].input_id != "UMLS" && result["$association"].input_id != "MESH") {
      if (!idResolveInput.hasOwnProperty(result["$association"].input_type)) {
        idResolveInput[result["$association"].input_type] = new Set();
      }
      
      idResolveInput[result["$association"].input_type].add(result["$input"]);
    }
  }
  
  Object.keys(idResolveInput).forEach((key) => {
    idResolveInput[key] = Array.from(idResolveInput[key]);
  })
  return idResolveInput;
}

/**
 * Gets an array of combo strings
 * @param {Array.<Object>} results Results from call_apis, in the shape of an array of objects
 * @returns {Array.<String>} Array of combos (eg. ['C1332823-D008180', 'C1332823-C1527249', 'C1332823-undefined']) 
 */
async function getCombos(results) {
  //Get resolved ids for ids in input that are not UMLS or MESH (outputs already have id mappings)
  let idResolveInput = getIdsToResolve(results);
  let resolved = await biomedicalIdResolve(idResolveInput);

  let combos = [];

  //attempt to resolve mesh/umls ids and make a combo string
  for (let result of results) {
    let inputId1;
    let inputId2;

    if (result["$input"].includes("UMLS") || result["$input"].includes("MESH")) {
      inputId1 = result["$input"].split(":")[1];
    } else {
      inputId1 = resolved[result["$input"]].bte_ids["MESH"] || resolved[result["$input"]].bte_ids["UMLS"];
    }

    if (result["$output"].includes("UMLS") || result["$output"].includes("MESH")) {
      inputId2 = result["$output"].split(":")[1];
    } else {
      inputId2 = result["$output_id_mapping"].resolved.bte_ids["MESH"] || result["$output_id_mapping"].resolved.bte_ids["UMLS"];
    }

    combos.push(`${inputId1}-${inputId2}`);
  }

  return combos;
}

/** 
 * Gets correlation between query inputs and outputs using https://biothings.ncats.io/mrcoc and appends the fields "ngd_overall" and "ngd_starred" to each result
 * @param {Array.<Object>} results Results from call_apis, in the shape of an array of objects
 * @returns {Array.<Object>} results with "ngd_overall" and "ngd_starred" fields appended
*/
async function getCorrelation(results) {
  let combos = await getCombos(results);
  const fields = ["ngd_overall", "ngd_starred"];

  const correlations = await batchQuery(combos, fields);

  //combine results with correlation
  results.forEach((result, i) => {
    if (correlations[i].notfound) {
      result.correlation = {
        ngd_overall: -1,
        ngd_starred: -1
      }
    } else {
      result.correlation = _.pick(correlations[i], fields);
    }
  });

  return results;
}

/**
 * 
 * @param {Array.<Object>} results Results from call_apis, in the shape of an array of objects (must contain correlation object)
 * @param {String} field field to sort by (either "ngd_overall" or "ngd_starred")
 */
function sortBy(results, field) {
  return results.sort(function(x, y) {
    let x_val = x.correlation[field];
    let y_val = y.correlation[field];

    //sort -1s to the back, else sort low to high
    if (x_val == -1 && y_val == -1) {
      return 0;
    } else if (x_val == -1) {
      return 1;
    } else if (y_val == -1) {
      return -1;
    } else {
      return x_val - y_val;
    }
  })
}

module.exports = {
  getCorrelation: getCorrelation,
  sortBy: sortBy
}
