/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PartnerContacts_Test_QueryVariables = {};
export type PartnerContacts_Test_QueryResponse = {
    readonly partner: {
        readonly locations: {
            readonly edges: ReadonlyArray<{
                readonly " $fragmentRefs": FragmentRefs<"PartnerContacts_edges">;
            } | null> | null;
        } | null;
    } | null;
};
export type PartnerContacts_Test_QueryRawResponse = {
    readonly partner: ({
        readonly locations: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly id: string;
                    readonly city: string | null;
                    readonly phone: string | null;
                    readonly state: string | null;
                    readonly country: string | null;
                    readonly address: string | null;
                    readonly address2: string | null;
                    readonly postalCode: string | null;
                    readonly coordinates: ({
                        readonly lat: number | null;
                        readonly lng: number | null;
                    }) | null;
                }) | null;
            }) | null> | null;
        }) | null;
        readonly id: string | null;
    }) | null;
};
export type PartnerContacts_Test_Query = {
    readonly response: PartnerContacts_Test_QueryResponse;
    readonly variables: PartnerContacts_Test_QueryVariables;
    readonly rawResponse: PartnerContacts_Test_QueryRawResponse;
};



/*
query PartnerContacts_Test_Query {
  partner(id: "white-cube") {
    locations: locationsConnection(first: 50) {
      edges {
        ...PartnerContacts_edges
      }
    }
    id
  }
}

fragment PartnerContactCard_location on Location {
  city
  phone
  state
  country
  address
  address2
  postalCode
  coordinates {
    lat
    lng
  }
}

fragment PartnerContacts_edges on LocationEdge {
  node {
    id
    ...PartnerContactCard_location
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "white-cube"
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 50
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "PartnerContacts_Test_Query",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Partner",
        "kind": "LinkedField",
        "name": "partner",
        "plural": false,
        "selections": [
          {
            "alias": "locations",
            "args": (v1/*: any*/),
            "concreteType": "LocationConnection",
            "kind": "LinkedField",
            "name": "locationsConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "LocationEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "PartnerContacts_edges"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "locationsConnection(first:50)"
          }
        ],
        "storageKey": "partner(id:\"white-cube\")"
      }
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "PartnerContacts_Test_Query",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Partner",
        "kind": "LinkedField",
        "name": "partner",
        "plural": false,
        "selections": [
          {
            "alias": "locations",
            "args": (v1/*: any*/),
            "concreteType": "LocationConnection",
            "kind": "LinkedField",
            "name": "locationsConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "LocationEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Location",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "city",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "phone",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "state",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "country",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "address",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "address2",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "postalCode",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "LatLng",
                        "kind": "LinkedField",
                        "name": "coordinates",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "lat",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "lng",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "locationsConnection(first:50)"
          },
          (v2/*: any*/)
        ],
        "storageKey": "partner(id:\"white-cube\")"
      }
    ]
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "PartnerContacts_Test_Query",
    "operationKind": "query",
    "text": "query PartnerContacts_Test_Query {\n  partner(id: \"white-cube\") {\n    locations: locationsConnection(first: 50) {\n      edges {\n        ...PartnerContacts_edges\n      }\n    }\n    id\n  }\n}\n\nfragment PartnerContactCard_location on Location {\n  city\n  phone\n  state\n  country\n  address\n  address2\n  postalCode\n  coordinates {\n    lat\n    lng\n  }\n}\n\nfragment PartnerContacts_edges on LocationEdge {\n  node {\n    id\n    ...PartnerContactCard_location\n  }\n}\n"
  }
};
})();
(node as any).hash = '2525811f24797327eff17511e3d11c9b';
export default node;
