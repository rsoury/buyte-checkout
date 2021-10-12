const path = require("path");

module.exports.alias = {
	"@": path.resolve(__dirname, "./src"),
	"@tests": path.resolve(__dirname, "./tests"),
	"@components": path.resolve(__dirname, "./src/widget/components"),
	"@go": path.resolve(__dirname, "./src/go")
};
