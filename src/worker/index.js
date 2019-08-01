const queue = require("../queue");
const promisify = require("../promisify");

module.exports = (name, work) => {
	const worker = {
		start: () => {
			queue.pop(name, (...args) => {
				return new Promise((resolve, reject) => {
					try {
						promisify(work(...args)).then((data) => {
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
	};

	worker.start();

	return worker;
};


