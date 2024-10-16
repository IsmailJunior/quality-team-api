const filterObject = (object, ...allowedFields) => {
	const newObject = {};
	Object.keys(object).forEach((element) => {
		if (allowedFields.includes(element)) {
			newObject[element] = object[element];
		}
	});
	return newObject;
};

export default filterObject;
