const queue = require("../queue");

const toPromise = val => {
	if(!(val instanceof Promise)) {
		return Promise.resolve(val);
	}
	
	return val;
};

module.exports = (name, work) => {
	const worker = {
		start: () => {
			queue.pop(name, (...args) => {
				return new Promise((resolve, reject) => {
					try {
						toPromise(work(...args)).then((data) => {
							resolve(data);

							worker.start();
						}).catch(data => {
							reject(data);

							worker.start();
						});
					} catch (e) {
						reject(e);

						worker.start();
					}
				});
			});
		}
	}

	worker.start();

	return worker;
};


