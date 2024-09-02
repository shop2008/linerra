import { Carrier } from "../models/veryk/general.entity";

export const verykCarriers: Carrier[] = [
  {
    "id": "2",
    "code": "canada-post",
    "groupCode": "canadapost",
    "name": "Canada Post",
    "regionId": "CA",
    "currency": {
      "code": "CAD",
      "symbol": "$",
      "value": "0.00"
    },
    "services": [
      {
        "id": "180",
        "code": "DOM.EP",
        "name": "Expedited Parcel"
      },
      {
        "id": "181",
        "code": "DOM.PC",
        "name": "Priority"
      },
      {
        "id": "183",
        "code": "DOM.XP",
        "name": "Xpresspost"
      },
      {
        "id": "167",
        "code": "INT.IP.SURF",
        "name": "International Parcel Surface"
      },
      {
        "id": "173",
        "code": "INT.TP",
        "name": "Tracked Packet - International"
      },
      {
        "id": "172",
        "code": "INT.XP",
        "name": "Xpresspost International"
      },
      {
        "id": "147",
        "code": "USA.EP",
        "name": "Expedited Parcel USA"
      },
      {
        "id": "151",
        "code": "USA.TP",
        "name": "Tracked Packet - USA"
      },
      {
        "id": "152",
        "code": "USA.XP",
        "name": "Xpresspost USA"
      }
    ]
  },
  {
    "id": "3",
    "code": "dhl",
    "groupCode": "dhl",
    "name": "DHL Canada",
    "regionId": "CA",
    "currency": {
      "code": "CAD",
      "symbol": "$",
      "value": "0.00"
    },
    "services": [
      {
        "id": "166",
        "code": "D.D",
        "name": "EXPRESS WORLDWIDE DOC"
      },
      {
        "id": "157",
        "code": "H.H",
        "name": "ECONOMY SELECT"
      },
      {
        "id": "220",
        "code": "K.K",
        "name": "EXPRESS 9:00 DOC"
      },
      {
        "id": "154",
        "code": "M.M",
        "name": "EXPRESS 10:30 NONDOC"
      },
      {
        "id": "156",
        "code": "P.P",
        "name": "EXPRESS WORLDWIDE NONDOC"
      },
      {
        "id": "165",
        "code": "T.T",
        "name": "EXPRESS 12:00 DOC"
      },
      {
        "id": "155",
        "code": "Y.Y",
        "name": "EXPRESS 12:00 NONDOC"
      }
    ]
  },
  {
    "id": "4",
    "code": "ups-import",
    "groupCode": "ups",
    "name": "UPS International",
    "regionId": "CA",
    "currency": {
      "code": "CAD",
      "symbol": "$",
      "value": "0.00"
    },
    "services": [
      {
        "id": "159",
        "code": "08",
        "name": "UPS Worldwide Expedited"
      },
      {
        "id": "162",
        "code": "11",
        "name": "UPS Standard"
      },
      {
        "id": "161",
        "code": "65",
        "name": "UPS Express Saver"
      }
    ]
  },
  {
    "id": "5",
    "code": "ups",
    "groupCode": "ups",
    "name": "UPS Canada",
    "regionId": "CA",
    "currency": {
      "code": "CAD",
      "symbol": "$",
      "value": "0.00"
    },
    "services": [
      {
        "id": "186",
        "code": "01",
        "name": "UPS Express"
      },
      {
        "id": "241",
        "code": "02",
        "name": "UPS Expedited"
      },
      {
        "id": "195",
        "code": "07",
        "name": "UPS Worldwide Express"
      },
      {
        "id": "187",
        "code": "08",
        "name": "UPS Worldwide Expedited"
      },
      {
        "id": "190",
        "code": "11",
        "name": "UPS Standard"
      },
      {
        "id": "191",
        "code": "12",
        "name": "UPS 3 Day Select"
      },
      {
        "id": "242",
        "code": "13",
        "name": "UPS Express Saver"
      },
      {
        "id": "188",
        "code": "54",
        "name": "UPS Worldwide Express Plus"
      },
      {
        "id": "189",
        "code": "65",
        "name": "UPS Express Saver"
      }
    ]
  },
  {
    "id": "9",
    "code": "fedex",
    "groupCode": "fedex",
    "name": "Fedex",
    "regionId": "CA",
    "currency": {
      "code": "CAD",
      "symbol": "$",
      "value": "0.00"
    },
    "services": [
      {
        "id": "475",
        "code": "FEDEX_INTERNATIONAL_PRIORITY",
        "name": "FedEx International Priority®"
      },
      {
        "id": "265",
        "code": "INTERNATIONAL_ECONOMY",
        "name": "FedEx International Economy®"
      },
      {
        "id": "318",
        "code": "INTERNATIONAL_PRIORITY",
        "name": "INTERNATIONAL_PRIORITY"
      }
    ]
  },
  {
    "id": "11",
    "code": "purolator",
    "groupCode": "purolator",
    "name": "Purolator",
    "regionId": "CA",
    "currency": {
      "code": "CAD",
      "symbol": "$",
      "value": "0.00"
    },
    "services": [
      {
        "id": "483",
        "code": "Ground",
        "name": "Ground"
      },
      {
        "id": "283",
        "code": "PurolatorExpress",
        "name": "PurolatorExpress"
      },
      {
        "id": "335",
        "code": "PurolatorExpressEnvelope",
        "name": "PurolatorExpressEnvelope"
      },
      {
        "id": "280",
        "code": "PurolatorGround",
        "name": "PurolatorGround"
      }
    ]
  },
  {
    "id": "14",
    "code": "dayross",
    "groupCode": "dayross",
    "name": "DayRoss",
    "regionId": "CA",
    "currency": {
      "code": "CAD",
      "symbol": "$",
      "value": "0.00"
    },
    "services": [
      {
        "id": "331",
        "code": "GL",
        "name": "GENERAL LTL"
      }
    ]
  },
  {
    "id": "21",
    "code": "dayross-sameday",
    "groupCode": "dayross",
    "name": "Dayross Sameday",
    "regionId": "CA",
    "currency": {
      "code": "CAD",
      "symbol": "$",
      "value": "0.00"
    },
    "services": [
      {
        "id": "383",
        "code": "EG@0101",
        "name": "Commerce Solutions"
      }
    ]
  },
  {
    "id": "23",
    "code": "truckingltl",
    "groupCode": "other",
    "name": "Trucking LTL",
    "regionId": "CA",
    "currency": {
      "code": "CAD",
      "symbol": "$",
      "value": "0.00"
    },
    "services": [
      {
        "id": "392",
        "code": "Trucking_LTL",
        "name": "Trucking LTL"
      }
    ]
  },
  {
    "id": "24",
    "code": "truckingftl",
    "groupCode": "other",
    "name": "Trucking FTL",
    "regionId": "CA",
    "currency": {
      "code": "CAD",
      "symbol": "$",
      "value": "0.00"
    },
    "services": [
      {
        "id": "391",
        "code": "Trucking_FTL",
        "name": "Trucking FTL"
      }
    ]
  },
  {
    "id": "25",
    "code": "oceanfreight",
    "groupCode": "other",
    "name": "Ocean Freight",
    "regionId": "CA",
    "currency": {
      "code": "CAD",
      "symbol": "$",
      "value": "0.00"
    },
    "services": [
      {
        "id": "390",
        "code": "Ocean_Freight",
        "name": "Ocean Freight"
      }
    ]
  },
  {
    "id": "26",
    "code": "shipvehicles",
    "groupCode": "other",
    "name": "Ship Vehicles",
    "regionId": "CA",
    "currency": {
      "code": "CAD",
      "symbol": "$",
      "value": "0.00"
    },
    "services": [
      {
        "id": "389",
        "code": "Ship_Vehicles",
        "name": "Ship Vehicles"
      }
    ]
  },
  {
    "id": "27",
    "code": "airfreight",
    "groupCode": "other",
    "name": "Air Freight",
    "regionId": "CA",
    "currency": {
      "code": "CAD",
      "symbol": "$",
      "value": "0.00"
    },
    "services": [
      {
        "id": "388",
        "code": "Air_Freight",
        "name": "Air_Freight"
      }
    ]
  }
];
