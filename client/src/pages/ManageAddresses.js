import React, { useEffect, useState } from "react";
import { Tabs, Typography, Layout, Divider } from "antd";
import { Table, Tag, Space } from "antd";
import AddAddress from "../components/AddAddress";
import { useWeb3React } from "@web3-react/core";
import { gql, useQuery } from "@apollo/client";
import ModifyAddressName from "../components/ModifyAddressName";
import { timeConverter } from "../helpers/HelperFunctions";
const { Content } = Layout;
const { Text, Title, Paragraph } = Typography;

const { Column, ColumnGroup } = Table;

const GET_DOGS = gql`
	query subscriberEntities($owner: Bytes) {
		receiveAddresses(where: { owner: $owner }) {
			id
			receiveAddress
			owner
			timeStamp
			name
		}
	}
`;

const columns = [
	{
		title: "Name",
		dataIndex: "name",
		key: "name",
	},
	{
		title: "Address",
		dataIndex: "receiveAddress",
		key: "receiveAddress",
		render: (text) => <Paragraph copyable>{text}</Paragraph>,
	},
	{
		title: "Created Time",
		dataIndex: "timeStamp",
		key: "timeStamp",
		render: (text) => <>{timeConverter(text)}</>,
	},
	{
		title: "Action",
		key: "action",
		render: (text, record) => {
			// console.log(record);
			return (
				<Space size="middle">
					<ModifyAddressName
						address={record.receiveAddress}
						owner={record.owner}
						name={record.name}
					/>
				</Space>
			);
		},
	},
];

function ManageAddresses() {
	const web3React = useWeb3React();
	// console.log(web3React.account);
	const { loading, error, data } = useQuery(GET_DOGS, {
		variables: { owner: web3React.account },
	});
	const [dataPoints, setdata] = useState([]);

	useEffect(() => {
		if (!loading && data) {
			setdata(data.receiveAddresses);
		}
	}, [loading]);

	if (loading) {
		return (
			<Content
				style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
			>
				<Title> Manage Accounts</Title>
				<Text>
					You can use create multiple addresses (accounts) to receive funds.
				</Text>
				Loading...
			</Content>
		);
	}

	if (!web3React.active) {
		return (
			<Content
				style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
			>
				<Title> Manage Accounts</Title>
				<Text>
					You can use create multiple addresses (accounts) to receive funds.
				</Text>
				Please connect wallet!
			</Content>
		);
	}

	if (error) {
		console.log(error.message);
		return (
			<Content
				style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
			>
				<Title> Manage Accounts</Title>
				<Text>
					You can use create multiple addresses (accounts) to receive funds.
				</Text>
				Something went wrong!
			</Content>
		);
	}
	// return <div>Data</div>;
	return (
		<Content
			style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
		>
			<Title> Manage Accounts</Title>
			<Text>
				You can use create multiple addresses (accounts) to receive funds.
			</Text>
			<br />
			<AddAddress />
			<Table dataSource={dataPoints} columns={columns}></Table>
		</Content>
	);
}

export default ManageAddresses;
