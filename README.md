# queue-promised

[![npm](https://img.shields.io/npm/dt/queue-promised)](https://www.npmjs.com/package/queue-promised)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Library for rate limiting function executions. 

You get promise to function that can be executed later, if there are no free workers right now. 

## Table of contents

<!-- vim-markdown-toc GFM -->

* [Installation](#installation)
* [FAQ](#faq)
	* [What are workers?](#what-are-workers)
* [Usage](#usage)
	* [Wrapper example](#wrapper-example)
	* [Advanced example](#advanced-example)
	* [Structured advanced example](#structured-advanced-example)
* [Design decision](#design-decision)
	* [Workers initialization](#workers-initialization)
	* [Task execution](#task-execution)
	* [API docs](#api-docs)
* [Authors](#authors)

<!-- vim-markdown-toc -->

## Installation

```bash
yarn add queue-promised
```

## FAQ

### What are workers?

Worker is just a `function` that is being called as one of the "threads". 

This library does not provide any additional multithreading for javascript. 

## Usage

### Wrapper example

This is the main way this library is intended to be used, just for wrapping function you want to rate limit. 

```javascript
const _ = require("lodash");

const queuePromise = require("queue-promised");

const wrapper = queuePromise.wrapper;

const limitedFunction = wrapper((time) => {
	// This is worker functions. It can either return data or Promise
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(time);
		}, time);
	});
}, 100);

// Generate params for 1000 tasks
const times = _.times(1000, () => Math.random() * 2000);

// Run tasks
times.forEach(time => {
	// Run function limitedFunction with time as param
	limitedFunction(time).then(data => {
		console.log(data);
	}).catch((e) => {
		console.error(e.toString());
	});
});

```

For more info on wrapper function, feel free to read [API docs](https://github.com/nemanjan00/queue-promised/blob/master/docs/wrapper.md).

### Advanced example

If you wish to go a little deeper and to create your own rate limiting logic, this is the way to do it. 

For even more details, feel free to read `./src/wrapper/index.js`. 

```javascript
const _ = require("lodash");

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
```

### Structured advanced example

```javascript
const queuePromise = require("queue-promised");

const queue = queuePromise.queue;
const worker = queuePromise.worker;

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
```

## Design decision

### Workers initialization

Idea behind task initialization is to register functions to specific queue. 

In example, for each worker, I created new function, this is to demonstrate you can for example have multiple different handling functions that send tasks to different external task handler. 

### Task execution

Task execution is done in first come - first serve manner. When function returns result, it is added to queue of workers. 

### API docs

You can read [API docs](https://github.com/nemanjan00/queue-promised/tree/master/docs). 

## Authors

* [nemanjan00](https://github.com/nemanjan00)

