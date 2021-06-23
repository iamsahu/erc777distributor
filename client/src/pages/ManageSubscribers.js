import React from "react";
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
			tokenAddress
			publisher
			timeStamp
			shares
		}
	}
`;

const data = [
	{
		key: "1",
		share: 30,
		address: "0x18e884951F37Ce547fe1c6CF66Bc31E1C05206dE",
	},
	{
		key: "2",
		share: 40,
		address: "0xB820c4623E006d07aDF25a72cd28BEE517266Da5",
	},
	{
		key: "3",
		share: 30,
		address: "0x904259ADc7cf7e7e4F8Dd529aa85E6bcEd7917C8",
	},
];
function ManageSubscribers() {
	const web3React = useWeb3React();

	const { loading, error, data } = useQuery(GET_DOGS);
	if (loading) {
		return <div>Loading</div>;
	}
	if (error) {
		console.log(error.message);
	}
	return (
		<Content
			style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
		>
			<Title> Manage Benefeciaries</Title>
			<AddSubscriber />
			<Table dataSource={data.subscriberEntities}>
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
