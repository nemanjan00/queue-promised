const toPromise = val => {
	if(!(val instanceof Promise)) {
		return Promise.resolve(val);
	}
	
	return val;
};

module.exports = toPromise;

