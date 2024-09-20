class APIFeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	filter() {
		// Create new query object from the dto
		const queryObject = { ...this.queryString };

		// Exclude th fields
		const excludedFields = ['offset', 'sort', 'fields', 'limit'];

		// Remove all the excluded fields
		excludedFields.forEach((element) => delete queryObject[element]);

		// Advanced filtering
		let queryString = JSON.stringify(queryObject);
		queryString = queryString.replace(
			/\b(gte|gt|lte|lt)\b/g,
			(match) => `$${match}`,
		);
		this.query = this.query.find(JSON.parse(queryString));
		return this;
	}

	sort() {
		// Sorting
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort('-createdAt');
		}
		return this;
	}

	limit() {
		// Field limiting
		if (this.queryString.fields) {
			const fields = this.queryString.fields.split(',').join(' ');
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select('-__v');
		}
		return this;
	}

	paginate() {
		// Pagination
		const offset = Number(this.queryString.offset) || 1;
		const limit = Number(this.queryString.limit) || 10;
		const skip = (offset - 1) * limit;
		this.query = this.query.skip(skip).limit(limit);
		return this;
	}
}

export default APIFeatures;
