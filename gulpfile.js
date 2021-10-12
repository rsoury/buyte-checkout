// PREFERRED TO USE NPM SCRIPTS which call these gulp tasks.

const { src, dest, series, parallel } = require("gulp");
const ginject = require("gulp-inject");
const gserve = require("gulp-serve");
const gclean = require("gulp-clean");

/* START SERVE CONFIG */
const clean = () =>
	src("dist/serve", { read: false, allowEmpty: true }).pipe(gclean());
const inject = () =>
	src(`tools/dev-site/index.html`)
		.pipe(
			ginject(
				src(["dist/widget/index.js"], {
					read: false,
					allowEmpty: true
				}),
				{
					ignorePath: ["/dist/widget", "dist/widget"]
				}
			)
		)
		.pipe(dest("dist/serve"));

const copyAssets = () =>
	src([
		`tools/dev-site/**/*`,
		`tools/dev-site/*`,
		`!tools/dev-site/index.html`
	]).pipe(dest("dist/serve/assets"));
const copy = () =>
	src([`tools/dev-site/*.*`, `!tools/dev-site/index.html`]).pipe(
		dest("dist/serve")
	);
// const copyWidget = () => src([`dist/widget/**/*`]).pipe(dest("dist/serve/widget"));

const widgetTask = series(
	clean,
	inject,
	copyAssets,
	// copyWidget,
	copy,
	gserve({
		root: ["dist/serve", "dist/widget"],
		port: 3000
	})
);
const goTask = series(
	gserve({
		root: "dist/go",
		port: 3001
	})
);
/* END SERVE CONFIG */

exports.widget = widgetTask;
exports.go = goTask;
exports.serve = parallel(widgetTask, goTask);
