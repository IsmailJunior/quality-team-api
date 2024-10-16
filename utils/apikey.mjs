class API {
	static genAPIKey() {
		return (
			[...Array(30)]
				// eslint-disable-next-line no-bitwise
				.map((e) => ((Math.random() * 36) | 0).toString(36))
				.join('')
		);
	}
}

export default API;
