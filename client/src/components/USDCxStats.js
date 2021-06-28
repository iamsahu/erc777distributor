import React, { useState, useEffect } from "react";
import { Statistic, Card, Row, Col } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { gql, useQuery } from "@apollo/client";

import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";
const GET_DOGS = gql`
	query GetDogs {
		donations(where: { token: "fUSDCx" }) {
			id
			token
			index
			donation
		}
	}
`;

function USDCxStats() {
	const { loading, error, data } = useQuery(GET_DOGS);
	const [val, setVal] = useState("0");

	useEffect(() => {
		if (!loading) {
			// console.log(data);
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
					title="Funds Received in USDCx"
					value={val}
					// precision={2}
					valueStyle={{ color: "#3f8600" }}
					// prefix={<ArrowUpOutlined />}
					// suffix="%"
				/>
			</Card>
		</div>
	);
}
export default USDCxStats;
