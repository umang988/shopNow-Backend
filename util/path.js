const path = require('path');
const mainModule = require.main;

module.exports = path.dirname(mainModule.filename);