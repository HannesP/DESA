const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

const defPath = path.join(__dirname, 'definition.yaml');
const definition = yaml.load(fs.readFileSync(defPath));

module.exports = definition;