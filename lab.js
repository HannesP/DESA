const definition = require('./load-definition');

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


function eventsForSelector(selectorDef, selectorParams, history) {
	return history;
}

function dealWithCommand(command, definition) {
	const handler = definition.handlers.find(handler => handler.initiator === command.name);
	if (handler === undefined) {
		throw `No handler for command ${command.name}!`;
	}

	const passing = {};

	for (const preconditionName of handler.preconditions) {
		const preconditonDef = definition.preconditions[preconditionName];
		if (preconditonDef === undefined) {
			throw `No precondition named ${precondition}!`;
		}

		const selectorName = preconditonDef.selector;
		const selectorDef = definition.selectors[selectorName];
		const selectorParams = selectorParamsFromCommand(command, definition.commands, selectorDef);

		const reducer = selectorReducers[selectorName](selectorParams);
		const relevantHistory = eventsForSelector(selectorDef, selectorParams, history);
		const outcome = relevantHistory.reduce(reducer, undefined);

		const didPass = preconditonDef.negate ? !outcome : outcome;
		passing[preconditionName] = didPass;
	}

	const outcomes = Object.keys(passing).map(key => passing[key]);
	const allPassed = outcomes.reduce((prev, curr) => prev && curr);

	if (allPassed) {
		const resultName = handler.result;
		const resultHandler = definition.messages[resultName];

		// Auto-fill message
	}
}


const selectorReducers = {};

selectorReducers.UserLikesPost = ({user, post}) => (isLiked = false, event) => {
    if (user === event.params.user &&
		post === event.params.post) {

    	if (event.name === 'PostLiked') {
    	    return true;
    	} else if (event.name === 'PostUnliked') {
    	    return false;
    	}
    }
    return isLiked;
};

selectorReducers.PostIsLiked = ({post}) => (isLiked = false, event) => {
	if (post === event.params.post) {
		if (event.name === 'PostLiked') {
			return true;
		} else if (event.name === 'PostUnliked') {
			return false;
		}
	}
	return isLiked;
};

selectorReducers.PostExists = ({post}) => (exists = false, event) => {
    if (post === event.params.post) {
    	if (event.name === 'PostCreated') {
            return true;
        }
    }
    return exists;
};

const history = require('./sample-history').slice();


const command = {type: 'command', name: 'LikePost', params: {user: 'user1', post: 'post2'}};

dealWithCommand(command, definition);
