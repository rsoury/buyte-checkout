import React from "react";
import Helmet from "react-helmet";
import Loader from "react-spinners/BarLoader";

import { LogoBlack } from "@go/assets";
import * as colors from "@/constants/colors";
import { Container, LoaderContainer, LoaderWrapper, Logo } from "./styles";

const LoaderScreen = () => {
	return (
		<Container>
			<LoaderContainer>
				<Helmet>
					<style type="text/css">{`
                        html, body, #root {
                            height: 100%;
                        }
                    `}</style>
				</Helmet>
				<Logo src={LogoBlack} alt="Loading Go Buyte Checkout" />
				<LoaderWrapper>
					<Loader color={colors.BLACK} />
				</LoaderWrapper>
			</LoaderContainer>
		</Container>
	);
};

export default LoaderScreen;
