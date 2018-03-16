function hasSameKeys(obj1, obj2) {
	const keys1 = Object.keys(obj1).sort();
	const keys2 = Object.keys(obj2).sort();

	if (keys1.length !== keys2.length) {
		return false;
	}

	for (let i = 0; i < keys1.length; i++) {
		if (keys1[i] !== keys2[i]) {
			return false;
		}
	}

	return true;
}

function selectorParamsFromCommand(command, commandDefs, selDef) {
	const cmdDef = commandDefs[command.name];
 
	const cmdDefParams = cmdDef.params;
	const selDefParams = selDef.params;
	
	const selectorParams = {};
	
	for (const selParamKey of Object.keys(selDefParams)) {
		const selDefParam = selDefParams[selParamKey];
		for (const cmdDefKey of Object.keys(cmdDefParams)) {
			const cmdDefParam = cmdDefParams[cmdDefKey];
	
			if (cmdDefParam.type === 'entity' &&
				cmdDefParam.type === selDefParam.type &&
				cmdDefParam.name === selDefParam.name) {
	
				selectorParams[selParamKey] = command.params[cmdDefKey];
			}
		}
	}
	
	return selectorParams;
}

function yadaYada(command, preconditions, commandDefs, preconditionDefs, selectorDefs) {
	const res = [];

	for (const precondition of preconditions) {
		const selectorDef = selectorDefs[precondition];
		if (selectorDef === undefined) {
			throw `No selector named ${precondition}!`;
		}

		const selectorParams = selectorParamsFromCommand(command, commandDefs, selectorDef);
		res.push(selectorParams);
	}

	return res;
}

const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

const defPath = path.join(__dirname, 'definition.yaml');
const definition = yaml.load(fs.readFileSync(defPath));

const commandDefinitions = definition.commands;
const selectorDefinitions = definition.selectors;
const preconditionDefs = definition.preconditions;

const command = {type: 'command', name: 'LikePost', params: {user: 'user1', post: 'post2'}};

const handler = definition.handlers.find(handler => handler.initiator === command.name);

if (handler === undefined) {
	throw `No handler for message ${command.name}!`;
}

const preconditions = handler.preconditions;

console.log(yadaYada(command, preconditions, commandDefinitions, preconditionDefs, selectorDefinitions));

module.exports = definition
