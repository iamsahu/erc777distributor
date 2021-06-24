import React, { useState, useEffect } from "react";
import { Statistic, Card, Row, Col } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { gql, useQuery } from "@apollo/client";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";
const GET_DOGS = gql`
	query GetDogs {
		donations {
			token
			id
			index
			donation
		}
	}
`;

function DashboardStatistics() {
	const web3React = useWeb3React();
	const { loading, error, data } = useQuery(GET_DOGS);
	const [val, setVal] = useState("0");

	useEffect(() => {
		if (!loading) {
			console.log(data);
			function calculateTotalDonation() {
				let value = BigNumber.from(0);
				for (let index = 0; index < data.donations.length; index++) {
					const element = data.donations[index];
					value = value.add(BigNumber.from(element["donation"]));
				}
				// console.log(formatEther(value));
				setVal(formatEther(value).toString());
			}
			calculateTotalDonation();
		}
	}, [loading]);

	if (error) {
		console.log(error.message);
	}

	return (
		<div className="site-statistic-demo-card">
			<Row gutter={16}>
				<Col span={12}>
					<Card>
						<Statistic
							title="Donations Received"
							value={val}
							// precision={2}
							valueStyle={{ color: "#3f8600" }}
							// prefix={<ArrowUpOutlined />}
							// suffix="%"
						/>
					</Card>
				</Col>
				<Col span={12}>
					<Card>
						<Statistic
							title="Total Benefeciaries"
							value={10}
							valueStyle={{ color: "#cf1322" }}
						/>
					</Card>
				</Col>
			</Row>
		</div>
	);
}

export default DashboardStatistics;
