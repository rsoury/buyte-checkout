// Buyte Go - The landing page hosting Checkout Buttons that need domain verification.

import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";

import isProd from "@/utils/is-prod";
import theme from "@/utils/theme";

import App from "./components/App";
import Receiver from "./components/Receiver";

(async () => {
	const rootEl = document.getElementById("root");
	const props = {};
	if (!isProd) {
		const urlParams = new URLSearchParams(window.location.search);
		const exampleData = urlParams.get("example-data");
		if (exampleData === "true" || exampleData === true) {
			props.app = await import("./example-data").then(m =>
				m.default ? m.default : m
			);
		}
	}

	ReactDOM.render(
		<ThemeProvider theme={theme}>
			<Receiver>
				<App {...props} />
			</Receiver>
		</ThemeProvider>,
		rootEl
	);
})();
