const promisify = require("../../src/promisify");

describe("Promisify", function() {
	describe("Test sync to async conversion", function() {
		it("Returns promise that resolves to sync value", function(done) {
			promisify(true).then(value => {
				if(value === true) {
					done();
				} else {
					done("Invalid value");
				}
			}).catch((error) => {
				done(error);
			});
		});
	});

	describe("Test async to async conversion", function() {
		it("Returns promise that resolves to async value", function(done) {
			Promise.resolve(true).then(value => {
				if(value === true) {
					done();
				} else {
					done("Invalid value");
				}
			}).catch((error) => {
				done(error);
			});
		});
	});
});

