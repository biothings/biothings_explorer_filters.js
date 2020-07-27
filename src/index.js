const { getCorrelation, sortBy } = require("./helpers");

/**
 * Filter results from call apis
 * @param {Array.<Object>} results Results from call_apis, in the shape of an array of objects
 * @param {Object} options
 * @param {?String} options.sort_by Field to sort by, can be either "ngd_overall" or "ngd_starred"
 * @param {?number} options.max_results Maximum results to return
*/ 
async function filterResults(results, options) {
  //query mrcoc api for cooccurences
  results = await getCorrelation(results);

  //sort results
  if (options.sort_by) {
    results = sortBy(results, options.sort_by);
  }

  //filter by amount
  if (options.max_results) {
    results = results.slice(0, options.max_results);
  }
  
  return results;
}

module.exports = filterResults;