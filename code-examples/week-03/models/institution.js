export const Institution = {
  create: (id, name, region, country) => ({
    id,
    name,
    region,
    country,
  }),

  findByCountry: (institutions, country) =>
    institutions.filter(
      (institution) =>
        institution.country.toLowerCase() === country.toLowerCase()
    ),

  findByRegion: (institutions, region) =>
    institutions.filter(
      (institution) => institution.region.toLowerCase() === region.toLowerCase()
    ),
};
