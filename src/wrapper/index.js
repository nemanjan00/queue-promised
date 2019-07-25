const queue = require("../queue");
const worker = require("../worker");

const uuid = require("uuid/v4");

module.exports = (func, count) => {
	if(count === undefined) {
		count = 1;
	}

	const id = uuid();

	Array(count).fill(1).map(() => worker(id, func));

	const resp = (...args) => {
		return queue.push(id, ...args);
	};

	resp.addWorkers = (count) => {
		Array(count).fill(1).map(() => worker(id, func));
	};

	return resp;
};

