import React, { useEffect, useState } from "react";
import { Tabs, Typography, Layout, Divider, Menu, Dropdown } from "antd";
import { Table, Tag, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import AddSubscriber from "../components/AddSubscriber";
import ModifySubscriber from "../components/ModifySubscriber";
import RemoveSubscriber from "../components/RemoveSubscriber";
import { useWeb3React } from "@web3-react/core";
import { gql, useQuery } from "@apollo/client";
import { client } from "../index";
const { Content } = Layout;
const { Text, Title } = Typography;

const { Column, ColumnGroup } = Table;

const GET_RECEIVE_ADDRESS = gql`
	query receiveAddresses($owner: Bytes) {
		receiveAddresses(where: { owner: $owner }) {
			id
			receiveAddress
			owner
			timeStamp
		}
	}
`;

const GET_DOGS = gql`
	query subscriberEntities($publisher: Bytes) {
		subscriberEntities(where: { publisher: $publisher, shares_gt: 0 }) {
			id
			subscriberAddress
			index
			publisher
			timeStamp
			shares
			totalShares
		}
		subscription2S(where: { publisher: $publisher }) {
			id
			totalShares
		}
	}
`;

function ManageSubscribers() {
	const web3React = useWeb3React();

	const { loading, error, data } = useQuery(GET_RECEIVE_ADDRESS, {
		variables: {
			owner: web3React.account,
		},
	});
	const [dataPoints, setdata] = useState([]);
	const [menu, setMenu] = useState(<Menu></Menu>);
	const [selectedAddress, setSelectedAddress] = useState(null);

	function onItemClick(item) {
		console.log(item);
		LoadBeneficiaries(item.key);
		setSelectedAddress(item.key);
	}

	async function LoadBeneficiaries(of) {
		console.log(of);
		setdata([]);
		await client
			.query({
				query: GET_DOGS,
				variables: {
					publisher: of,
				},
			})
			.then((response) => {
				console.log(response.data);

				const totalShares = response.data.subscription2S[0].totalShares;
				var temp = [];
				for (
					let index = 0;
					index < response.data.subscriberEntities.length;
					index++
				) {
					let element = Object.assign(
						{},
						response.data.subscriberEntities[index]
					);
					// console.log(element);
					element["shares"] =
						(
							(parseInt(response.data.subscriberEntities[index]["shares"]) /
								parseInt(totalShares)) *
							100
						)
							.toFixed(2)
							.toString() + " %";
					temp.push(element);
				}
				setdata(temp);

				// setdata(response.data.subscriberEntities);
			});
	}

	useEffect(() => {
		if (!loading && data) {
			console.log(data);
			for (let index = 0; index < data.receiveAddresses.length; index++) {}
			const temp = data.receiveAddresses.map((item) => (
				<Menu.Item key={item.receiveAddress} onClick={onItemClick}>
					{item.receiveAddress}
				</Menu.Item>
			));
			setMenu(<Menu>{temp}</Menu>);
			// const totalShares = data.subscription2S[0].totalShares;
			// var temp = [];
			// for (let index = 0; index < data.subscriberEntities.length; index++) {
			// 	let element = Object.assign({}, data.subscriberEntities[index]);
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
			// setdata(temp);
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
			<Title>
				{" "}
				Manage Receivers{" "}
				{selectedAddress === null ? <></> : "for " + selectedAddress.toString()}
			</Title>
			<Dropdown overlay={menu} trigger={["click"]}>
				<a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
					Click me <DownOutlined />
				</a>
			</Dropdown>
			{selectedAddress !== null ? (
				<AddSubscriber address={selectedAddress} />
			) : (
				<></>
			)}
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
							console.log(record);
							return (
								<Space size="middle">
									<ModifySubscriber
										userAddress={record.subscriberAddress}
										currentShare={record.shares}
										selectedAddress={selectedAddress}
									/>
									<RemoveSubscriber
										userAddress={record.subscriberAddress}
										selectedAddress={selectedAddress}
									/>
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
