const API_KEY = '44a956178dd73105f015fb8978c09a47';

const endpoints = [
  {
    type: 'Trending',
    url: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
  },
  {
    type: 'Top Rated',
    url: `/movie/top_rated/?api_key=${API_KEY}&language=en-US`,
  },
  {
    type: 'Action',
    url: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
  },
  {
    type: 'Animation',
    url: `/discover/movie?api_key=${API_KEY}&with_genres=16`,
  },
  {
    type: 'Comedy',
    url: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
  },
  {
    type: 'Horror',
    url: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
  },
  {
    type: 'Romance',
    url: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  },
  {
    type: 'Western',
    url: `/discover/movie?api_key=${API_KEY}&with_genres=37`,
  },
];

export default endpoints;
