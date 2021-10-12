const fs = require("fs");
const path = require("path");
const _get = require("lodash.get");
const _set = require("lodash.set");
const {
	editWebpackPlugin,
	getWebpackPlugin,
	appendWebpackPlugin,
	getPaths
} = require("@rescripts/utilities");
const webpack = require("webpack");
const RemovePlugin = require("remove-files-webpack-plugin");
const HtmlWebpackDeployPlugin = require("html-webpack-deploy-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { default: InjectPlugin, ENTRY_ORDER } = require("webpack-inject-plugin");

const { alias } = require("./shared-config");

const mw = fn => Object.assign(fn, { isMiddleware: true });
const isGo = process.env.GO === "true" || process.env.GO === true;
const isPublic = process.env.PUBLIC === "true" || process.env.PUBLIC === true;

const addAlias = mw(config => {
	const existingAlias = _get(config, "resolve.alias", {});
	config = _set(
		config,
		"resolve.alias",
		Object.assign({}, existingAlias, alias)
	);
	// console.log(require("util").inspect(config, false, null, true));
	return config;
});

/**
	Middleware that adds a console for logged messages to the screen.
	An option for debugging across multiple devices
 */
const addScreenlog = mw(config => {
	const showScreenlog = process.env.SCREENLOG === "true" ? true : false;
	if (showScreenlog) {
		config = appendWebpackPlugin(
			new InjectPlugin(
				() => `
						import("screenlog")
							.then(() => {
								screenLog.init({
									fontSize: "11px",
									css: "left: 0; right: 0; top: 0; width: 100%; -webkit-overflow-scrolling: touch;"
								});
							});
					`,
				{
					entryOrder: ENTRY_ORDER.First
				}
			),
			config
		);
	}
	return config;
});

const configGo = mw(config => {
	const { mode = "development" } = config;
	const env = process.env.REACT_APP_FORCE_ENV || mode;
	const isProd = env === "production";
	const goEntry = path.resolve(__dirname, "./src/go.js");
	config.entry = [
		...(Array.isArray(config.entry) ? config.entry : []).filter(
			entryPath => entryPath.indexOf("/src/index.js") < 0
		),
		...(config.entry.includes(goEntry) ? [] : [goEntry])
	];

	let wellKnownPath = "src/go/.well-known";
	try {
		const envWellKnownPath = `${wellKnownPath}/${env}`;
		fs.accessSync(path.resolve(__dirname, envWellKnownPath));
		wellKnownPath = envWellKnownPath;
	} catch (e) {}

	config = appendWebpackPlugin(
		new CopyWebpackPlugin([{ from: wellKnownPath, to: "./.well-known" }]),
		config
	);

	if (!isProd) {
		return config;
	}

	if (isPublic) {
		let publicUrl =
			process.env.REACT_APP_GO_URL;
		publicUrl =
			publicUrl.charAt(publicUrl.length - 1) === "/"
				? publicUrl.slice(0, -1)
				: publicUrl;
		config = editWebpackPlugin(
			p => {
				p.definitions["process.env"].PUBLIC_URL = JSON.stringify(publicUrl);
				return p;
			},
			"DefinePlugin",
			config
		);
		config = editWebpackPlugin(
			p => {
				p.replacements.PUBLIC_URL = publicUrl;
				return p;
			},
			"InterpolateHtmlPlugin",
			config
		);
	}

	return config;
});

const configWidget = mw(config => {
	const isProd = config.mode === "production";
	if (!isProd) {
		config = editWebpackPlugin(
			p => {
				p.options.template = path.resolve(
					__dirname,
					`./tools/dev-site/index.html`
				);
				return p;
			},
			"HtmlWebpackPlugin",
			config
		);
		config = appendWebpackPlugin(
			new HtmlWebpackDeployPlugin({
				assets: {
					copy: [{ from: "tools/dev-site", to: "." }]
				}
			}),
			config
		);
		return config;
	}

	const definePlugin = getWebpackPlugin("DefinePlugin", config);
	config.plugins = [
		definePlugin,
		new RemovePlugin({
			after: {
				include: ["build/manifest.json", "build/favicon.ico"]
			}
		}),
		new webpack.HashedModuleIdsPlugin()
	];
	config.output = Object.assign({}, config.output, {
		filename: "[name].[contenthash:8].js",
		chunkFilename: `[name].[contenthash:8].js`
	});
	config.optimization = Object.assign({}, config.optimization, {
		runtimeChunk: false,
		splitChunks: {
			chunks: "all",
			maxInitialRequests: 1,
			minSize: 0,
			automaticNameDelimiter: ".",
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name(module) {
						// get the name. E.g. node_modules/packageName/not/this/part.js
						// or node_modules/packageName
						const packageName = module.context.match(
							/[\\/]node_modules[\\/](.*?)([\\/]|$)/
						)[1];

						// npm package names are URL-safe, but some servers don't like @ symbols
						return `vendor.${packageName.replace("@", "")}`;
					}
				}
			}
		}
	});
	if ((process.env.REACT_APP_FORCE_ENV || config.mode) !== "production") {
		config.devtool = "eval-source-map";
	}

	if (isPublic) {
		config.output = Object.assign({}, config.output, {
			publicPath:
				process.env.REACT_APP_JS_URL
		});
	}

	// console.log(require("util").inspect(config, false, null, true));
	// process.exit(1);
	return config;
});

module.exports = [
	["use-babel-config", ".babelrc.js"],
	["use-eslint-config", ".eslintrc.js"],
	addAlias,
	addScreenlog,
	isGo ? configGo : configWidget
];
