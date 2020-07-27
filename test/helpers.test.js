const rewire = require("rewire");
const helpers = rewire("../src/helpers");

const batchQuery = helpers.__get__("batchQuery");
describe("Test batchQuery function", function() {
  test("Correct shape for batch size < input size", async function() {
    const inputs = ['C1332823-D008180', 'C1332823-C1527249', 'C1332823-undefined'];
    const fields = ["ngd_overall", "ngd_starred"];

    let result = await batchQuery(inputs, fields, batchSize=2);
    expect(result.length).toEqual(3);
  });

  test("Correct shape for batch size > input size", async function() {
    const inputs = ['C1332823-D008180', 'C1332823-C1527249', 'C1332823-undefined'];
    const fields = ["ngd_overall", "ngd_starred"];

    let result = await batchQuery(inputs, fields);
    expect(result.length).toEqual(3);
  });
});

const getIdsToResolve = helpers.__get__("getIdsToResolve");
describe("Test getIdsToResolve function", function() {
  test("test", async function() {
    let input = [
      {
        "$association": {
          api_name: "CORD Gene API",
          input_id: "HGNC",
          input_type: "Gene",
          output_id: "DOID",
          output_type: "Disease"
        },
        "$input": "HGNC:2561",
        "$output": "MONDO:0007915"
      },
      {
        "$association": {
          api_name: "CORD Gene API",
          input_id: "HGNC",
          input_type: "Gene",
          output_id: "DOID",
          output_type: "Disease"
        },
        "$input": "HGNC:2561",
        "$output": "MONDO:0005575"
      },
      {
        "$association": {
          api_name: "SEMMED Gene API",
          input_id: "UMLS",
          input_type: "Gene",
          output_id: "UMLS",
          output_type: "Disease"
        },
        "$input": "UMLS:C1332823",
        "$output": "MONDO:0005233"
      }
    ];
    let result = await getIdsToResolve(input);
    let expected = {
      Gene: ["HGNC:2561"]
    }
    expect(result).toEqual(expected);
  })
});

const getCombos = helpers.__get__("getCombos");
describe("Test getCombos function", function() {
  test("test", async function() {
    let input = [
      {
        "$association": {
          api_name: "CORD Gene API",
          input_id: "HGNC",
          input_type: "Gene",
          output_id: "DOID",
          output_type: "Disease"
        },
        "$input": "HGNC:2561",
        "$output": "MONDO:0007915",
        "$output_id_mapping": {
          resolved: {
            "bte_ids": {
              MESH: ["D008180"],
              UMLS: ["C0024141"]
            }
          }
        }
      },
      {
        "$association": {
          api_name: "CORD Gene API",
          input_id: "HGNC",
          input_type: "Gene",
          output_id: "DOID",
          output_type: "Disease"
        },
        "$input": "HGNC:2561",
        "$output": "MONDO:0005575",
        "$output_id_mapping": {
          resolved: {
            "bte_ids": {
              MONDO: ["MONDO:0005575"],
              UMLS: ["C1527249"]
            }
          }
        }
      },
      {
        "$association": {
          api_name: "SEMMED Gene API",
          input_id: "UMLS",
          input_type: "Gene",
          output_id: "UMLS",
          output_type: "Disease"
        },
        "$input": "UMLS:C1332823",
        "$output": "MONDO:0005233",
        "$output_id_mapping": {
          resolved: {
            "bte_ids": {
            }
          }
        }
      },
      {
        "$association": {
          api_name: "Fake API",
          input_id: "MESH",
          output_id: "MESH",
        },
        "$input": "MESH:D002562",
        "$output": "MESH:D004328",
      },
    ];
    let result = await getCombos(input);
    let expected = [
      'C1332823-D008180',
      'C1332823-C1527249',
      'C1332823-undefined',
      'D002562-D004328'
    ];
    expect(result).toEqual(expected);

  })
});

describe("Test getCorrelation function", function() {
  test("test", async function() {
    let input = [
      {
        "$association": {
          api_name: "CORD Gene API",
          input_id: "HGNC",
          input_type: "Gene",
          output_id: "DOID",
          output_type: "Disease"
        },
        "$input": "HGNC:2561",
        "$output": "MONDO:0007915",
        "$output_id_mapping": {
          resolved: {
            "bte_ids": {
              MESH: ["D008180"],
              UMLS: ["C0024141"]
            }
          }
        }
      },
      {
        "$association": {
          api_name: "CORD Gene API",
          input_id: "HGNC",
          input_type: "Gene",
          output_id: "DOID",
          output_type: "Disease"
        },
        "$input": "HGNC:2561",
        "$output": "MONDO:0005575",
        "$output_id_mapping": {
          resolved: {
            "bte_ids": {
              MONDO: ["MONDO:0005575"],
              UMLS: ["C1527249"]
            }
          }
        }
      },
      {
        "$association": {
          api_name: "SEMMED Gene API",
          input_id: "UMLS",
          input_type: "Gene",
          output_id: "UMLS",
          output_type: "Disease"
        },
        "$input": "UMLS:C1332823",
        "$output": "MONDO:0005233",
        "$output_id_mapping": {
          resolved: {
            "bte_ids": {
            }
          }
        }
      },
      {
        "$association": {
          api_name: "Fake API",
          input_id: "MESH",
          output_id: "MESH",
        },
        "$input": "MESH:D002562",
        "$output": "MESH:D004328",
      },
    ];
    let result = await helpers.getCorrelation(input);
    for (let r of result) {
      expect(r).toHaveProperty('correlation');
    }
  })
});

describe("Test sortBy function", function() {
  test("Correct sorting with ngd_overall", function() {
    const inputs = [
      {
        correlation: {
          ngd_overall: -1,
          ngd_starred: -1
        }
      },
      {
        correlation: {
          ngd_overall: 0.25,
          ngd_starred: 0.75
        }
      },
      {
        correlation: {
          ngd_overall: 0.75,
          ngd_starred: 0.25
        }
      }
    ];

    const expected = [
      {
        correlation: {
          ngd_overall: 0.25,
          ngd_starred: 0.75
        }
      },
      {
        correlation: {
          ngd_overall: 0.75,
          ngd_starred: 0.25
        }
      },
      {
        correlation: {
          ngd_overall: -1,
          ngd_starred: -1
        }
      },
    ];

    let results = helpers.sortBy(inputs, "ngd_overall");
    expect(results).toEqual(expected);
  });

  test("Correct sorting with ngd_starred", function() {
    const inputs = [
      {
        correlation: {
          ngd_overall: -1,
          ngd_starred: -1
        }
      },
      {
        correlation: {
          ngd_overall: 0.25,
          ngd_starred: 0.75
        }
      },
      {
        correlation: {
          ngd_overall: 0.75,
          ngd_starred: 0.25
        }
      }
    ];

    const expected = [
      {
        correlation: {
          ngd_overall: 0.75,
          ngd_starred: 0.25
        }
      },
      {
        correlation: {
          ngd_overall: 0.25,
          ngd_starred: 0.75
        }
      },
      {
        correlation: {
          ngd_overall: -1,
          ngd_starred: -1
        }
      },
    ];

    let results = helpers.sortBy(inputs, "ngd_starred");
    expect(results).toEqual(expected);
  });

  test("Doesn't sort with nonexistent field", function() {
    const inputs = [
      {
        correlation: {
          ngd_overall: -1,
          ngd_starred: -1
        }
      },
      {
        correlation: {
          ngd_overall: 0.25,
          ngd_starred: 0.75
        }
      },
      {
        correlation: {
          ngd_overall: 0.75,
          ngd_starred: 0.25
        }
      }
    ];

    const expected = [
      {
        correlation: {
          ngd_overall: -1,
          ngd_starred: -1
        }
      },
      {
        correlation: {
          ngd_overall: 0.25,
          ngd_starred: 0.75
        }
      },
      {
        correlation: {
          ngd_overall: 0.75,
          ngd_starred: 0.25
        }
      }
    ];

    let results = helpers.sortBy(inputs);
    expect(results).toEqual(expected);

    results = helpers.sortBy(inputs, "random");
    expect(results).toEqual(expected);
    
  });
})
