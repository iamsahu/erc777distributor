import React, { useState, useEffect } from "react";
import { Statistic, Card, Row, Col } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { gql, useQuery } from "@apollo/client";

import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";
const GET_DOGS = gql`
	query GetDogs {
		subscriberEntities {
			id
		}
	}
`;

function BeneficiaryCount() {
	const { loading, error, data } = useQuery(GET_DOGS);
	const [val, setVal] = useState("0");

	useEffect(() => {
		if (!loading) {
			if (!error) {
				// console.log(data);
				setVal(data.subscriberEntities.length);
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
					title="Total Beneficiaries"
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
export default BeneficiaryCount;
