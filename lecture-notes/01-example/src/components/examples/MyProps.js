import PropTypes from "prop-types";

const MyProps = (props) => {
  return <h1>Hello, {props.name}!</h1>;
};

MyProps.propTypes = {
  name: PropTypes.string,
};

export default MyProps;
