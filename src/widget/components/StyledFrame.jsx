/**
 * Sourced code from https://github.com/hydrateio/react-styled-frame/
 */

import React from "react";
import Frame, { FrameContextConsumer } from "react-frame-component";
import { StyleSheetManager, withTheme, ThemeProvider } from "styled-components";

export default withTheme(props => {
	const { theme, style = {}, children, ...rest } = props;

	return (
		<Frame
			style={{
				display: "block",
				overflow: "scroll",
				WebkitOverflowScrolling: "touch",
				border: 0,
				...style
			}}
			head={
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			}
			{...rest}
		>
			<FrameContextConsumer>
				{({ document }) => (
					<StyleSheetManager target={document.head}>
						{theme ? (
							<ThemeProvider theme={theme}>{children}</ThemeProvider>
						) : (
							children
						)}
					</StyleSheetManager>
				)}
			</FrameContextConsumer>
		</Frame>
	);
});
