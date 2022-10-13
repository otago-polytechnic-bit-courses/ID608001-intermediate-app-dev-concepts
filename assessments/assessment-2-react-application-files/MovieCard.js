import { forwardRef } from "react";
import { createUseStyles } from "react-jss";

const MovieCard = forwardRef(({ movie }, ref) => {
  const classes = useStyles();

  const BASE_URL = "https://image.tmdb.org/t/p/original";

  return (
    <div ref={ref} className={classes.card}>
      <img
        src={`${BASE_URL}/${movie.backdrop_path || movie.poster_path}`}
        alt={movie.title}
      />

      {/* 
        Declare the TextTruncate component from the react-text-truncate dependency. This components has four props that you need to use:
          - line: The number of lines to truncate the text to
          - element: The element to wrap the text in
          - truncateText: The text to append to the end of the truncated text
          - text: The text to truncate
      */}

      <h2>{movie.title || movie.original_name}</h2>

      {/* 
        Declare a span element with the className value - classes.stats. This element will contain the movie's media type,
        release date or first air date and vote count.
      */}
    </div>
  );
});

const useStyles = createUseStyles({
  card: {
    color: "#ffffff",
    width: 500,
    height: 400,
    padding: 20,
    transition: "transform 100ms",
    "&:hover": {
      transform: "scale(1.05)",
    },
    "&:hover > span": {
      display: "inline",
    },
    "& > img": {
      height: 300,
      objectFit: "contain",
      width: 500,
    },
    "& > h2": {
      paddingTop: 10,
    },
  },
  stats: {
    display: "none",
  },
});

export default MovieCard;
