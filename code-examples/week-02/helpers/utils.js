const findById = (array, id) => array.find((item) => item.id === parseInt(id));
const filterBy = (array, field, value) =>
  array.filter((item) => item[field] === value);

export { findById, filterBy };
