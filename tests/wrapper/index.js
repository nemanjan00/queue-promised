const wrapper = require("../../src/wrapper");

describe("Wrapper", function() {
	describe("Test count", function() {
		it("Runs n functions at the same time", function(done) {
			const func = wrapper(() => {
				return new Promise(resolve => {
					setTimeout(() => {
						resolve();
					}, 10);
				});
			}, 2);

			const promises = Array.from({ length: 100 }, () => func());

			const start = new Date() * 1;

			Promise.all(promises).then(() => {
				const time = (new Date() * 1) - start;

				if(time >=500 && time <=1000) {
					done();
				} else {
					done("Wrong sleep time");
				}
			});
		});
	});

	describe("Test rateLimit", function() {
		it("Limits calls per second across all workers", function(done) {
			// 2 workers, 20 calls/s -> each call held 100ms -> 10 calls take ~500ms
			const func = wrapper(() => {
				return Promise.resolve();
			}, { count: 2, rateLimit: 20 });

			const start = new Date() * 1;

			Promise.all(Array.from({ length: 10 }, () => func())).then(() => {
				const time = (new Date() * 1) - start;

				if(time >= 400 && time <= 800) {
					done();
				} else {
					done("Wrong rate limited time: " + time);
				}
			});
		});
	});

	describe("Test options", function() {
		it("Defaults to one worker when options object has no count", function() {
			const func = wrapper((value) => {
				return value;
			}, { maxTime: 1000 });

			return func(42).then((value) => {
				if(value !== 42) {
					throw new Error("Wrong value " + value);
				}
			});
		});

		it("Does not modify the caller's options object", function() {
			const options = { count: 2, rateLimit: 20 };

			wrapper(() => {}, options);

			if(Object.keys(options).join() !== "count,rateLimit") {
				throw new Error("Options modified: " + JSON.stringify(options));
			}
		});
	});
});
