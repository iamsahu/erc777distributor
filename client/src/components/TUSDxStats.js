import React, { useState, useEffect } from "react";
import { Statistic, Card } from "antd";

import { gql, useQuery } from "@apollo/client";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";
const GET_DOGS = gql`
	query GetDogs($owner: Bytes) {
		donations(where: { token: "fTUSDx", owner: $owner }) {
			id
			token
			index
			donation
		}
	}
`;

function TUSDxStats() {
	const web3React = useWeb3React();
	const { loading, error, data } = useQuery(GET_DOGS, {
		variables: {
			owner: web3React.account,
		},
	});
	const [val, setVal] = useState("0");

	useEffect(() => {
		if (!loading) {
			function calculateTotalDonation() {
				let value = BigNumber.from(0);
				for (let index = 0; index < data.donations.length; index++) {
					const element = data.donations[index];
					value = value.add(BigNumber.from(element["donation"]));
				}
				// console.log(formatEther(value));
				setVal(formatEther(value).toString());
			}
			if (data) if (data.donations !== undefined) calculateTotalDonation();
		}
	}, [loading, data]);

	if (error) {
		console.log(error.message);
	}

	return (
		<div className="site-statistic-demo-card">
			<Card>
				<Statistic
					title="TUSDx tokens received"
					value={web3React.active ? val : "Connect Wallet"}
					// precision={2}
					valueStyle={{ color: "#3f8600" }}
					// prefix={<ArrowUpOutlined />}
					// suffix="%"
				/>
			</Card>
		</div>
	);
}
export default TUSDxStats;
