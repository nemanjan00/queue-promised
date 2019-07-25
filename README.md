# queue-promise

Library for rate limiting function executions. 

You get promise to function that can be executed later, if there are no free workers right now. 

## Usage

```javascript
const queuePromise = require("queue-promise");

const queue = queuePromise.queue;
const worker = queuePromise.worker;

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
```

