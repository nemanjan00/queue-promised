const queue = require("./src/queue");
const worker = require("./src/worker");

const tester = {
	start: () => {
		// Allocate workers
		tester.startWorkers();

		// Generate params for tasks
		const times = Array(1000).fill(1).map(() => Math.random() * 2000);

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
		Array(100).fill(worker).map((worker, id) => worker("sleeper", (time) => {
			// This is worker functions. It can either return data or Promise
			return new Promise(resolve => {
				setTimeout(() => {
					resolve("worker" + id + " - " + time);
				}, time);
			});
		}));
	}
};

tester.start();
