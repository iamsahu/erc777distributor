import React, { useEffect, useState } from "react";
import { Tabs, Typography, Layout, Divider } from "antd";
import { Table, Tag, Space } from "antd";
import AddAddress from "../components/AddAddress";
import { useWeb3React } from "@web3-react/core";
import { gql, useQuery } from "@apollo/client";
const { Content } = Layout;
const { Text, Title } = Typography;

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

function ManageAddresses() {
	const web3React = useWeb3React();
	console.log(web3React.account);
	const { loading, error, data } = useQuery(GET_DOGS, {
		variables: { owner: web3React.account },
	});
	const [dataPoints, setdata] = useState([]);

	useEffect(() => {
		if (!loading && data) {
			console.log(data);
			// const totalShares = data.subscription2S[0].totalShares;
			// var temp = [];
			// for (let index = 0; index < data.receiveAddresses.length; index++) {
			// 	let element = Object.assign({}, data.receiveAddresses[index]);
			// 	// console.log(element);
			// 	element["shares"] =
			// 		(
			// 			(parseInt(data.subscriberEntities[index]["shares"]) /
			// 				parseInt(totalShares)) *
			// 			100
			// 		)
			// 			.toFixed(2)
			// 			.toString() + " %";
			// 	temp.push(element);
			// }
			setdata(data.receiveAddresses);
		}
	}, [loading]);

	if (loading) {
		return <div>Loading</div>;
	}

	if (error) {
		console.log(error.message);
		return <div>Something went wrong</div>;
	}
	// return <div>Data</div>;
	return (
		<Content
			style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
		>
			<Title> Manage Accounts</Title>
			<AddAddress />
			<Table dataSource={dataPoints}>
				<Column title="Name" dataIndex="name" key="name" />
				<Column
					title="Address"
					dataIndex="receiveAddress"
					key="receiveAddress"
				/>
				<Column title="Time" dataIndex="timeStamp" key="timeStamp" />
			</Table>
		</Content>
	);
}

export default ManageAddresses;
