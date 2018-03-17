const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

function isSane(definition) {
	return true;
}

const defPath = path.join(__dirname, 'definition.yaml');
const definition = yaml.load(fs.readFileSync(defPath));

if (!isSane(definition)) {
	throw 'Insane definition!';
}

definition.messages = {...definition.events, ...definition.commands};

module.exports = definition;