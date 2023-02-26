// Sort a list of objects based on a specific property, defaults to 'name' property
export default (field = 'name') =>
  (a, b) =>
    a[field].localeCompare(b[field])
