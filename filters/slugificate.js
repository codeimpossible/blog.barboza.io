const slugify = require('slugify');

module.exports = (title) =>
  slugify(title, { remove: /[*+~.()'"!:\?@]/g }).toLowerCase();
