const _ = require("lodash");

const queue = require("../queue");
const worker = require("../worker");

const uuid = require("uuid/v4");

const timeout = (time) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => reject("timeout"), time);
	});
};

module.exports = (func, options) => {
	const id = uuid();

	// Configuration
	if(options === undefined) {
		options = {
			count: 1
		};
	}

	if(typeof options == "number") {
		options = {
			count: options
		};
	}

	// Configure workers
	if(options.maxTime !== undefined) {
		const oldFunc = func;

		func = (...args) => {
			return Promise.race([
				oldFunc(...args),
				timeout(options.maxTime)
			]);
		};
	}

	if(options.rateLimit !== undefined) {
		options.minTime = (1000 * options.count) / options.count;
	}

	if(options.minTime !== undefined) {
		const oldFunc = func;

		func = (...args) => {
			return new Promise((resolve, reject) => {
				const promise = oldFunc(...args);

				timeout(options.minTime).catch(() => {
					promise.then(resolve).catch(reject);
				});
			});
		};
	}

	// Init workers
	_.times(options.count, () => worker(id, func));

	// Logic for adding tasks
	const resp = (...args) => {
		return queue.push(id, ...args);
	};

	// Exposed logic
	resp.addWorkers = (count) => {
		_.times(count, () => worker(id, func));
	};

	return resp;
};

