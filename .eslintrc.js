const { alias } = require("./shared-config");

module.exports = {
	extends: ["airbnb", "plugin:prettier/recommended", "prettier/react"],
	parser: "babel-eslint",
	plugins: ["babel", "react"],
	env: {
		browser: true,
		jest: true
	},
	settings: {
		"import/resolver": {
			alias: {
				map: Object.entries(alias),
				extensions: [".js", ".jsx", ".json"]
			}
		},
		react: {
			pragma: "React",
			version: "detect"
		}
	},
	rules: {
		// See: https://github.com/benmosher/eslint-plugin-import/issues/496
		"import/no-extraneous-dependencies": false
	}
};
