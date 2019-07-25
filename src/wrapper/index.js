const queue = require("../queue");
const worker = require("../worker");

const uuid = require("uuid/v4");

module.exports = (func, count) => {
	const id = uuid();

	Array(count).fill(1).map(() => worker(id, func));

	return (...args) => {
		return queue.push(id, ...args);
	};
};

