import React from "react";
import { Timeline, Layout, Typography } from "antd";
import { gql, useQuery } from "@apollo/client";
import { timeConverter } from "../helpers/HelperFunctions";
import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";
const { Content } = Layout;
const { Title } = Typography;

const GET_donations = gql`
	query donations($owner: Bytes) {
		donations(orderBy: timeStamp, where: { owner: $owner }) {
			id
			donation
			token
			timeStamp
			from
			subscription {
				name
			}
		}
	}
`;

function DonationsTimeline() {
	const web3React = useWeb3React();
	const { loading, error, data } = useQuery(GET_donations, {
		variables: {
			owner: web3React.account,
		},
	});

	if (!web3React.active)
		return (
			<Content
				style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
			>
				Please connect your wallet!
			</Content>
		);

	if (loading) {
		return <div>Loading</div>;
	}
	if (error) {
		console.log(error.message);
		return <div>SOmething went wrong</div>;
	}
	console.log(data);
	return (
		<Content
			style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
		>
			<Timeline>
				<Timeline.Item>
					Created the fund receiving contract on 10/10/2021
				</Timeline.Item>
				{data.donations.map((record) => (
					<Timeline.Item key={record.id}>
						Received an amount of{" "}
						{formatEther(BigNumber.from(record.donation)).toString()}{" "}
						{record.token} on {timeConverter(record.timeStamp)} from{" "}
						{record.from.toString()} in {record.subscription.name}
					</Timeline.Item>
				))}
				{/* <Timeline.Item>
					Added recepient <a>0xB820c4623E006d07aDF25a72cd28BEE517266Da5</a> with
					a share of '40%' on 11/10/2021
				</Timeline.Item>
				<Timeline.Item>
					Received a donation of 10 USDCx from
					<a>0x904259ADc7cf7e7e4F8Dd529aa85E6bcEd7917C8</a> on 12/10/2021
				</Timeline.Item> */}
			</Timeline>
		</Content>
	);
}

export default DonationsTimeline;
