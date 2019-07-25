# queue-promised

Library for rate limiting function executions. 

You get promise to function that can be executed later, if there are no free workers right now. 

## Table of contents


<!-- vim-markdown-toc GFM -->

* [Installation](#installation)
* [Usage](#usage)
	* [Simple example](#simple-example)
	* [Structured example](#structured-example)
* [Design decision](#design-decision)
	* [Workers initialization](#workers-initialization)
	* [Task execution](#task-execution)
* [Authors](#authors)

<!-- vim-markdown-toc -->

## Installation

```bash
yarn add queue-promised
```

## Usage

### Simple example

```javascript
const queuePromise = require("queue-promised");

const queue = queuePromise.queue;
const worker = queuePromise.worker;

const limitedFunction = (time) => {
	// This is worker functions. It can either return data or Promise
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(time);
		}, time);
	});
};

// Add that function to worker queue 100 times
Array(100).fill(1).map(() => worker("sleeper", limitedFunction));

// Generate params for 1000 tasks
const times = Array(1000).fill(1).map(() => Math.random() * 2000);

// Run tasks
times.forEach(time => {
	// Run function limitedFunction with time as param
	queue.push("sleeper", time).then(data => {
		console.log(data);
	}).catch((e) => {
		console.error(e.toString());
	});
});
```

### Structured example

```javascript
const queuePromise = require("queue-promised");

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

## Design decision

### Workers initialization

Idea behind task initialization is to register functions to specific queue. 

In example, for each worker, I created new function, this is to demonstrate you can for example have multiple different handling functions that send tasks to different external task handler. 

### Task execution

Task execution is done in first come - first serve manner. When function returns result, it is added to queue of workers. 

## Authors

* [nemanjan00](https://github.com/nemanjan00)

