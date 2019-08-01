const _ = require("lodash");

const queue = require("../src/queue");
const worker = require("../src/worker");

const limitedFunction = (time) => {
	// This is worker functions. It can either return data or Promise
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(time);
		}, time);
	});
};

// Add that function to worker queue 100 times
_.times(100, () => worker("sleeper", limitedFunction));

// Generate params for 1000 tasks
const times = _.times(1000, () => Math.random() * 2000);

// Run tasks
times.forEach(time => {
	// Run function limitedFunction with time as param
	queue.push("sleeper", time).then(data => {
		console.log(data);
	}).catch((e) => {
		console.error(e.toString());
	});
});

