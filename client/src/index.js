import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

function getLibrary(provider, connector) {
	// return new ethers.providers.Web3Provider(window.ethereum);
	const test = new Web3Provider(provider);

	return test; // this will vary according to whether you use e.g. ethers or web3.js
}

ReactDOM.render(
	<Web3ReactProvider getLibrary={getLibrary}>
		<App />
	</Web3ReactProvider>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
