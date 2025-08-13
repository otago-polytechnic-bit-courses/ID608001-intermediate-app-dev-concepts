import { Institution } from "../models/institution.js";

export const institutions = [
  Institution.create(1, "Otago Polytechnic", "Otago", "New Zealand"),
  Institution.create(
    2,
    "Southern Institute of Technology",
    "Southland",
    "New Zealand"
  ),
];
