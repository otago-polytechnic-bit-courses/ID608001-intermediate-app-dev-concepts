import { Institution } from "../models/institution.js";
import { institutions } from "../data/institution.js";

export const institutionResolvers = {
  institutions: () => institutions,

  institution: ({ id }) => {
    return institutions.find((institution) => institution.id === parseInt(id));
  },

  institutionsByCountry: ({ country }) => {
    return Institution.findByCountry(institutions, country);
  },

  institutionsByRegion: ({ region }) => {
    return Institution.findByRegion(institutions, region);
  },
};
