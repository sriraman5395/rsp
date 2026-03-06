// src/data/mapData.ts

export interface TechnicalDetails {
  "Type of girder": string;
  "Effective span": string;
  "Clear span": string;
}

export interface CostDetails {
  "Cost of Rly Portion": number;
  "Cost of State Portion": number;
  "Total Cost": number;
  "Year of sanction": string;
}

export interface PresentStatus {
  "Status of GAD": string;
  "Status of Sanctioned": string;
  "Status of work": string;
  "Status of contract": string;
  "Status of tender": string;
}

export interface Marker {
  id: string;
  "LC No": string;
  "Division": string;
  "Section": string;
  "District": string;
  "Chainage": string;
  "Location": string;
  x: number; // Parsed from Latitude/Longitude percentage
  y: number; // Parsed from Latitude/Longitude percentage
  "ROB/RUB/BOTH": string;
  "State government agency": string;
  "Technical Details": TechnicalDetails;
  "Details of Cost": CostDetails;
  "Present Status": PresentStatus;
  // NEW: filenames relative to /uploads folder (optional)
  images?: string[];         // e.g. ["mas-1.jpg", "mas-1-side.jpg"]
  // optional captions mapping (if you want to store captions with filenames)
  imageCaptions?: { [filename: string]: string };
}

export const INITIAL_MARKERS: Marker[] = [
  {
    id: "MAS2MAS-GDR",
    "LC No": "2",
    "Division": "MAS",
    "Section": "MAS-GDR",
    "District": "Tiruvallur",
    "Chainage": "2A/40-42",
    "Location": "Korukkupet",
    x: 60.67,
    y: 31.23,
    "ROB/RUB/BOTH": "ROB",
    "State government agency": "TN / GCC",
    "Technical Details": {
      "Type of girder": "Bowstring",
      "Effective span": "",
      "Clear span": "1 x 60000"
    },
    "Details of Cost": {
      "Cost of Rly Portion": 219170821,
      "Cost of State Portion": 251120875,
      "Total Cost": 0,
      "Year of sanction": "2023-2024"
    },
    "Present Status": {
      "Status of GAD": "Pending for Countersign by CE/HW",
      "Status of Sanctioned": "Estimate pending in S&T, Elec. OHE",
      "Status of work": "",
      "Status of contract": "",
      "Status of tender": ""
    },
    // <-- add the filenames that live in uploads/
    images: ["flower.jpg"]
  },
  {
    id: "MAS2MAS-GDR-2",
    "LC No": "2",
    "Division": "MAS",
    "Section": "MAS-GDR",
    "District": "Tiruvallur",
    "Chainage": "2A/40-42",
    "Location": "Korukku",
    x: 60.70,
    y: 31.23,
    "ROB/RUB/BOTH": "ROB",
    "State government agency": "TN / GCC",
    "Technical Details": {
      "Type of girder": "Bowstring",
      "Effective span": "",
      "Clear span": "1 x 60000"
    },
    "Details of Cost": {
      "Cost of Rly Portion": 219170821,
      "Cost of State Portion": 251120875,
      "Total Cost": 0,
      "Year of sanction": "2023-2024"
    },
    "Present Status": {
      "Status of GAD": "Pending for Countersign by CE/HW",
      "Status of Sanctioned": "Estimate pending in S&T, Elec. OHE",
      "Status of work": "",
      "Status of contract": "",
      "Status of tender": ""
    },
 images: ["ship.jpg","flower.jpg","women.jpg"]
  }
];