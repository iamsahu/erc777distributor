import React, { useEffect, useState } from "react";
import { Tabs, Typography, Layout, Divider } from "antd";
import { Table, Tag, Space } from "antd";
import AddSubscriber from "../components/AddSubscriber";
import ModifySubscriber from "../components/ModifySubscriber";
import RemoveSubscriber from "../components/RemoveSubscriber";
import { useWeb3React } from "@web3-react/core";
import { gql, useQuery } from "@apollo/client";
const { Content } = Layout;
const { Text, Title } = Typography;

const { Column, ColumnGroup } = Table;

const GET_DOGS = gql`
	query subscriberEntities {
		subscriberEntities {
			id
			subscriberAddress
			index
			publisher
			timeStamp
			shares
			totalShares
		}
		subscription2S(
			where: { publisher: "0x4f708393c541fa97594de71297ac3dff5a71247b" }
		) {
			id
			totalShares
			index
			publisher
			timeStamp
		}
	}
`;

function ManageSubscribers() {
	const web3React = useWeb3React();

	const { loading, error, data } = useQuery(GET_DOGS);
	const [dataPoints, setdata] = useState([]);

	useEffect(() => {
		if (!loading && data) {
			// console.log(data);
			const totalShares = data.subscription2S[0].totalShares;
			var temp = [];
			for (let index = 0; index < data.subscriberEntities.length; index++) {
				let element = Object.assign({}, data.subscriberEntities[index]);
				// console.log(element);
				element["shares"] =
					(
						(parseInt(data.subscriberEntities[index]["shares"]) /
							parseInt(totalShares)) *
						100
					)
						.toFixed(2)
						.toString() + " %";
				temp.push(element);
			}
			setdata(temp);
		}
	}, [loading]);

	if (loading) {
		return <div>Loading</div>;
	}

	if (error) {
		console.log(error.message);
		return <div>Something went wrong</div>;
	}

	return (
		<Content
			style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
		>
			<Title> Manage Beneficiaries</Title>
			<AddSubscriber />
			<Table dataSource={dataPoints}>
				<Column
					title="Address"
					dataIndex="subscriberAddress"
					key="subscriberAddress"
				/>
				<Column title="Share" dataIndex="shares" key="shares" />
				{web3React.active && (
					<Column
						title="Action"
						key="action"
						render={(text, record) => {
							// console.log(record);
							return (
								<Space size="middle">
									<ModifySubscriber
										userAddress={record.subscriberAddress}
										currentShare={record.shares}
									/>
									<RemoveSubscriber userAddress={record.subscriberAddress} />
								</Space>
							);
						}}
					/>
				)}
			</Table>
		</Content>
	);
}

export default ManageSubscribers;
