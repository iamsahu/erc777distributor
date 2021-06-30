import React, { useState, useEffect } from "react";
import { Statistic, Card } from "antd";

import { gql, useQuery } from "@apollo/client";
import { useWeb3React } from "@web3-react/core";

const GET_DOGS = gql`
	query receiveAddresses($owner: Bytes) {
		receiveAddresses(where: { owner: $owner }) {
			id
		}
	}
`;

function BeneficiaryCount() {
	const web3React = useWeb3React();
	const { loading, error, data } = useQuery(GET_DOGS, {
		variables: {
			owner: web3React.account,
		},
	});
	const [val, setVal] = useState("0");

	useEffect(() => {
		if (!loading) {
			if (!error) {
				// console.log(data);
				setVal(data.receiveAddresses.length);
			}
		}
	}, [loading, data]);

	if (error) {
		console.log(error.message);
	}

	return (
		<div className="site-statistic-demo-card">
			<Card>
				<Statistic
					title="Total Projects"
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
export default BeneficiaryCount;
