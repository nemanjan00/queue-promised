const queue = require("./src/queue");
const worker = require("./src/worker");

const tester = {
	start: () => {
		tester.startWorkers();
		const times = Array(1000).fill(1).map(() => Math.random() * 2000);

		times.map(time => queue.push("sleeper", time));
	},
	startWorkers: () => {
		return new Array(100).fill(worker).map((worker, id) => worker("sleeper", (time) => {
			return new Promise(resolve => {
				setTimeout(() => {
					console.log("worker" + id + " - " + time);
					resolve();
				}, time);
			});
		}));
	}
}

tester.start();

