const _ = require("lodash");
 
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

			const promises = _.times(100, func);

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
});

