const _ = require("lodash");

const queue = require("../src/queue");
const worker = require("../src/worker");

const tester = {
	start: () => {
		// Generate params for tasks
		const times = _.times(1000, () => Math.random() * 2000);

		// Run tasks
		times.forEach(time => {
			queue.push("sleeper", time).then(data => {
				console.log(data);
			}).catch((e) => {
				console.error(e.toString());
			});
		});
	},
	startWorkers: () => {
		// Generate workers
		_.times(100, (id) => worker("sleeper", (time) => {
			// This is worker functions. It can either return data or Promise
			return new Promise(resolve => {
				setTimeout(() => {
					resolve("worker" + id + " - " + time);
				}, time);
			});
		}));
	}
};

// Allocate workers
tester.startWorkers();

// Run tasks
tester.start();

