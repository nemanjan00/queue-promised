// Async node queue

const queue = {
	_queues: {},
	_waiters: {},

	getQueue: (name) => {
		if(queue._queues[name] === undefined) {
			queue._queues[name] = [];
		}

		return queue._queues[name];
	},

	getWaiter: (name) => {
		if(queue._waiters[name] === undefined) {
			queue._waiters[name] = [];
		}

		return queue._waiters[name];
	},

	runWaiter: (name) => {
		setTimeout(() => {
			const waiter = queue.getWaiter(name);

			if(waiter.length > 0) {
				queue.pop(name, waiter.pop());
			}

			if(waiter.length > 0) {
				queue.runWaiter(name);
			}
		}, 0);
	},

	push: (name, ...value) => {
		return new Promise((resolve, reject) => {
			queue.getQueue(name).push({value, promise: {resolve, reject}});

			queue.runWaiter(name);
		});
	},

	pop: (name, callback) => {
		const taskQueue = queue.getQueue(name);

		if(taskQueue.length > 0) {
			const instance = taskQueue.pop();

			if(instance.promise !== undefined) {
				callback(...instance.value).then(instance.promise.resolve).catch(instance.promise.reject);
			} else {
				callback(...instance.value);
			}
		} else {
			queue.getWaiter(name).push(callback);
		}
	}
};

module.exports = queue;

