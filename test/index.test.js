const filterResults = require("../src/index");

describe("Test filterResults function", function() {
  test("basic test", async function() {
    let input = [
      {
        "$association": {
          "input_id": "MESH",
          "input_type": "Disease",
          "output_id": "MESH",
          "output_type": "ChemicalSubstance",

        },
        "$input": "MESH:D002292",
        "$output": "MESH:C088450",
        "$output_id_mapping": {
          "resolved": {
            "db_ids": {
              "MESH": ["C088450"],
              "UMLS": ["C0257278"],
            },
          },
        },
      },
      {
        "$association": {
          "input_id": "MESH",
          "input_type": "Disease",
          "output_id": "MESH",
          "output_type": "ChemicalSubstance",
        },
        "$input": "MESH:D002292",
        "$output": "MESH:C097270",
        "$output_id_mapping": {
          "resolved": {
            "db_ids": {
              "MESH": ["C097270"],
              "UMLS": ["C0384965"],
              "name": ["ZM 241385", "ZM-241385"]
            },
          },
        },
      },
      {
        "$association": {
          "input_id": "MESH",
          "input_type": "Disease",
          "output_id": "MESH",
          "output_type": "ChemicalSubstance",
        },
        "$input": "MESH:D002292",
        "$output": "MESH:D000077211",
        "$output_id_mapping": {
          "resolved": {
            "db_ids": {
              "MESH": ["D000077211"],
              "UMLS": ["C0528130"],
              "name": ["CGP 42446A"]
            },
          },
        },
      },
      {
        "$association": {
          "input_id": "MESH",
          "input_type": "Disease",
          "output_id": "MESH",
          "output_type": "ChemicalSubstance",
        },
        "$input": "MESH:D002292",
        "$output": "MESH:C027368",
        "$output_id_mapping": {
          "resolved": {
            "db_ids": {
              "MESH": ["C027368"],
              "UMLS": ["C0078841"],
              "name": ["zomepirac glucuronide"]
            },
          },

        },
      },
      {
        "$association": {
          "input_id": "MESH",
          "input_type": "Disease",
          "output_id": "MESH",
          "output_type": "ChemicalSubstance",
        },
        "$input": "MESH:D002292",
        "$output": "CHEMBL.COMPOUND:CHEMBL10372",
        "$output_id_mapping": {
          "resolved": {
            "db_ids": {
              "CHEMBL.COMPOUND": ["CHEMBL10372"],
              "DRUGBANK": ["DB08772"],
              "PUBCHEM": [1613, "1613"],
              "MESH": ["C067172"],
              "INCHI": [
                "InChI=1S/C19H12F3N3O3S/c20-19(21,22)10-5-6-15-14(7-10)23-16(29-15)9-25-18(28)12-4-2-1-3-11(12)13(24-25)8-17(26)27/h1-7H,8-9H2,(H,26,27)"
              ],
              "INCHIKEY": ["BCSVCWVQNOXFGL-UHFFFAOYSA-N"],
              "UNII": ["1PV3S9WP3D"],
              "KEGG": ["C01865"],
              "UMLS": ["C0085066"],
              "name": ["ZOPOLRESTAT", "Zopolrestat", "zopolrestat"]
            },
          },
        },
      },
      {
        "$association": {
          "input_id": "MESH",
          "input_type": "Disease",
          "output_id": "MESH",
          "output_type": "ChemicalSubstance",
        },
        "$input": "MESH:D002292",
        "$output": "MESH:C510150",
        "$output_id_mapping": {
          "resolved": {
            "db_ids": {
              "MESH": ["C510150"],
              "UMLS": ["C1721602"],
              "name": ["ZSTK474"]
            },
          },
        },
      },
      {
        "$association": {
          "input_id": "MESH",
          "input_type": "Disease",
          "output_id": "MESH",
          "output_type": "ChemicalSubstance",
        },
        "$input": "MESH:D002292",
        "$output": "MESH:C519312",
        "$output_id_mapping": {
          "resolved": {
            "db_ids": {
              "MESH": ["C519312"],
              "UMLS": ["C1956582"],
              "name": ["Zyflamend"]
            },
          },
        },
      },
      {
        "MESH": "D015054",
        "pubmed": ["30258081"],
        "$association": {
          "input_id": "MESH",
          "input_type": "Disease",
          "output_id": "MESH",
          "output_type": "ChemicalSubstance",
        },
        "$input": "MESH:D002292",
        "$output": "MESH:D015054",
        "$output_id_mapping": {
          "resolved": {
            "db_ids": {
              "MESH": ["D015054"],
              "UMLS": ["C0043553"],
              "name": ["Zymosan A"]
            },
          },
        },
      },
    ];
    let output = await filterResults(input, {sort_by: "ngd_overall", max_results: 5});
    expect(output).toMatchSnapshot();
    expect(output.length).toEqual(5);
  });
});
