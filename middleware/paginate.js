module.exports = model => {
	return async (req, res, next) => {
		const len = model.length;
		const page = parseInt(req.query.page);
		const pageLen = 8;
		const pageNo = Math.ceil(len / pageLen);
		let products = {};
		products.length = pageNo;
		products.current = page;
		if (page > 1) {
			products.prev = page - 1;
		}
		if (page < pageNo) {
			products.next = page + 1;
		}
		const startIndex = (page - 1) * pageLen;
		const endIndex = page * pageLen;
		const results = model.slice(startIndex, endIndex);
		products.results = results;
		req.paginatedResults = products;
		next();
	};
};
