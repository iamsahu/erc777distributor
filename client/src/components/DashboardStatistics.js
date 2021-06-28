import React, { useState, useEffect } from "react";
import { Statistic, Card, Row, Col } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { gql, useQuery } from "@apollo/client";
import USDCxStats from "./USDCxStats";
import TUSDxStats from "./TUSDxStats";
import ETHxStats from "./ETHxStats";
import DAIxStats from "./DAIxStats";
import BeneficiaryCount from "./BeneficiaryCount";
import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";

const GET_DOGS = gql`
	query GetDogs($owner: Bytes) {
		donations(where: { owner: $owner }) {
			token
			id
			index
			donation
		}
	}
`;

function DashboardStatistics() {
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
			if (data !== undefined) calculateTotalDonation();
		}
	}, [loading, data]);

	if (error) {
		console.log(error.message);
	}

	return (
		<div className="site-statistic-demo-card">
			<Row
				gutter={16}
				span={32}
				style={{ paddingTop: "4px", paddingBottom: "4px" }}
			>
				<Col span={8}>
					<USDCxStats />
				</Col>
				<Col span={8}>
					<TUSDxStats />
				</Col>
				<Col span={8}>
					<DAIxStats />
				</Col>
			</Row>
			<Row
				gutter={16}
				span={32}
				style={{ paddingTop: "4px", paddingBottom: "4px" }}
			>
				<Col span={8}>
					<ETHxStats />
				</Col>
				<Col span={16}>
					<BeneficiaryCount />
				</Col>
			</Row>
		</div>
	);
}

export default DashboardStatistics;
