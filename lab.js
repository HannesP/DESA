const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

const defPath = path.join(__dirname, 'definition.yaml');
const definition = yaml.load(fs.readFileSync(defPath));

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


function dealWithMessage(message, definition) {
	debugger;
	const handler = definition.handlers.find(handler => handler.initiator === message.name);
	if (handler === undefined) {
		throw `No handler for message ${command.name}!`;
	}

	for (const preconditionName of handler.preconditions) {
		const preconditonDef = definition.preconditions[preconditionName];
		if (preconditonDef === undefined) {
			throw `No precondition named ${precondition}!`;
		}

		const selectorDef = definition.selectors[preconditonDef.selector];
		const selectorParams = selectorParamsFromCommand(command, definition.commands, selectorDef);
	}
}

const command = {type: 'command', name: 'LikePost', params: {user: 'user1', post: 'post2'}};

dealWithMessage(command, definition);
