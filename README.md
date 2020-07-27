# biothings_explorer_filters.js
[![Build Status](https://travis-ci.com/ericz1803/biothings_explorer_filters.js.svg?branch=master)](https://travis-ci.com/ericz1803/biothings_explorer_filters.js) [![Coverage Status](https://coveralls.io/repos/github/ericz1803/biothings_explorer_filters.js/badge.svg?branch=master)](https://coveralls.io/github/ericz1803/biothings_explorer_filters.js?branch=master)  
NodeJS library delivering Filter features for BioThings Explorer

## Install
`npm install biothings-explorer-filters`

## Usage
```js
const filterResults = require("biothings-explorer-filters");

//other code for setting up and using call-apis package
let results = queryExecutor.result; //get results from call-apis package

let options = {
    sort_by: "ngd_overall",
    max_results: 10
};
results = await filterResults(results, options);
```

### Options
| Param         | Type     | Description                                                    |
| ------------- | -------- | -------------------------------------------------------------- |
| `sort_by`     | `String` | Field to sort by, can be either "ngd_overall" or "ngd_starred" |
| `max_results` | `Number` | Maximum results to return                                      | 

## Run Tests
`npm run test`