const { getCorrelation, sortBy } = require("./helpers");

/**
 * Filter results from call apis
 * @param {Array.<Object>} results Results from call_apis, in the shape of an array of objects
 * @param {?String} sort_by Field to sort by, can be either "ngd_overall" or "ngd_starred"
 * @param {?number} max_results Maximum results to return
*/ 
async function filterResults(results, sort_by, max_results) {
  //query mrcoc api for cooccurences
  results = await getCorrelation(results);

  //sort results
  if (sort_by) {
    results = sortBy(results, sort_by);
  }

  //filter by amount
  if (max_results) {
    results = results.slice(0, max_results);
  }
  return results;

}

module.exports = filterResults;