const parseCookies = (cookieHeader = "") =>
	cookieHeader.split(";").reduce((acc, cookiePair) => {
		const [rawName, ...rawValue] = cookiePair.trim().split("=");

		if (!rawName) {
			return acc;
		}

		acc[rawName] = decodeURIComponent(rawValue.join("="));
		return acc;
	}, {});

module.exports = { parseCookies };
