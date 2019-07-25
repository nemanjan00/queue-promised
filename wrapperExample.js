const wrapper = require("./src/wrapper");

const limitedFunction = wrapper((time) => {
	// This is worker functions. It can either return data or Promise
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(time);
		}, time);
	});
}, 100);

// Generate params for 1000 tasks
const times = Array(1000).fill(1).map(() => Math.random() * 2000);

// Run tasks
times.forEach(time => {
	// Run function limitedFunction with time as param
	limitedFunction(time).then(data => {
		console.log(data);
	}).catch((e) => {
		console.error(e.toString());
	});
});

