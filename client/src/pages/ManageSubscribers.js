import React, { useEffect, useState } from "react";
import { Typography, Layout, Menu, Dropdown } from "antd";
import { Table, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import AddSubscriber from "../components/AddSubscriber";
import ModifySubscriber from "../components/ModifySubscriber";
import RemoveSubscriber from "../components/RemoveSubscriber";
import ModifyReceiverName from "../components/ModifyReceiverName";
import { useWeb3React } from "@web3-react/core";
import { gql, useQuery } from "@apollo/client";
import { client } from "../index";

const { Content } = Layout;
const { Text, Title, Paragraph } = Typography;

const GET_RECEIVE_ADDRESS = gql`
	query receiveAddresses($owner: Bytes) {
		receiveAddresses(where: { owner: $owner }) {
			id
			receiveAddress
			owner
			timeStamp
			name
		}
	}
`;

const columns2 = [
	{
		title: "Name",
		dataIndex: "name",
		key: "name",
		render: (text) => <>{text}</>,
	},
	{
		title: "Address",
		dataIndex: "subscriberAddress",
		key: "subscriberAddress",
		render: (text) => <Paragraph copyable>{text}</Paragraph>,
	},
];

const columns = [
	{
		title: "Name",
		dataIndex: "name",
		key: "name",
		render: (text) => <>{text}</>,
	},
	{
		title: "Address",
		dataIndex: "subscriberAddress",
		key: "subscriberAddress",
		render: (text) => <Paragraph copyable>{text}</Paragraph>,
	},
	{
		title: "Shares",
		dataIndex: "shares",
		key: "shares",
		render: (text) => <>{text}</>,
	},
	{
		title: "Action",
		key: "action",
		render: (text, record) => {
			// console.log(record);
			return (
				<Space size="middle">
					<ModifySubscriber
						userAddress={record.subscriberAddress}
						currentShare={record.shares}
						selectedAddress={record.receiveAddress.receiveAddress}
					/>
					<ModifyReceiverName
						userAddress={record.subscriberAddress}
						index={record.index}
						publisher={record.receiveAddress.receiveAddress}
						owner={record.receiveAddress.owner}
						name={record.name}
					/>
					<RemoveSubscriber
						userAddress={record.subscriberAddress}
						selectedAddress={record.receiveAddress.receiveAddress}
					/>
				</Space>
			);
		},
	},
];

const GET_DOGS = gql`
	query subscriberEntities($publisher: Bytes) {
		subscriberEntities(where: { shares_gt: 0, publisher: $publisher }) {
			id
			subscriberAddress
			index
			publisher
			timeStamp
			shares
			totalShares
			name
			receiveAddress {
				receiveAddress
				owner
				name
				totalShares
			}
		}
	}
`;

function ManageSubscribers() {
	const web3React = useWeb3React();
	const [dataPoints, setdata] = useState([]);
	const [projectName, setProjectName] = useState(null);
	const [menu, setMenu] = useState(<Menu></Menu>);
	const [selectedAddress, setSelectedAddress] = useState(null);

	const { loading, error, data } = useQuery(GET_RECEIVE_ADDRESS, {
		variables: {
			owner: web3React.account,
		},
	});

	function onItemClick(item) {
		// console.log(item);
		LoadBeneficiaries(item.key);
		setSelectedAddress(item.key);
		// console.log(item.item.props);
		setProjectName(item.item.props.name);
	}

	async function LoadBeneficiaries(of) {
		// console.log(of);
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
				if (response.data !== undefined) {
					let totalShares = 0;
					// if (response.data.subscription2S.length > 0)
					// 	totalShares = response.data.subscription2S[0].totalShares;
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
									parseInt(
										response.data.subscriberEntities[index]["receiveAddress"][
											"totalShares"
										]
									)) *
								100
							)
								.toFixed(2)
								.toString() + " %";
						temp.push(element);
					}
					setdata(temp);
				}

				// setdata(response.data.subscriberEntities);
			});
	}

	useEffect(() => {
		if (!loading && data) {
			// console.log(data);
			for (let index = 0; index < data.receiveAddresses.length; index++) {}
			const temp = data.receiveAddresses.map((item) => (
				<Menu.Item
					key={item.receiveAddress}
					name={item.name}
					onClick={onItemClick}
				>
					{item.name}
				</Menu.Item>
			));
			setMenu(<Menu>{temp}</Menu>);
		}
	}, [loading]);

	if (loading) {
		return (
			<Content
				style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
			>
				<Title>Manage Receivers</Title>
				<Text>
					You can use manage the addresses that receive a share of the funds
					received in the selected account.
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
				<Title>Manage Receivers</Title>
				<Text>
					You can use manage the addresses that receive a share of the funds
					received in the selected account.
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
				<Title>Manage Receivers</Title>
				<Text>
					You can use manage the addresses that receive a share of the funds
					received in the selected account.
				</Text>
				Something went wrong!
			</Content>
		);
	}

	return (
		<Content
			style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
		>
			<Title>
				{" "}
				Manage Receivers {projectName === null ? <></> : "for " + projectName}
			</Title>{" "}
			<Text>
				You can use manage the addresses that receive a share of the funds
				received in the selected account.
			</Text>
			<br />
			{/* <Paragraph copyable>{selectedAddress}</Paragraph> */}
			<Dropdown overlay={menu} trigger={["click"]}>
				<a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
					Click me <DownOutlined />
				</a>
			</Dropdown>{" "}
			{selectedAddress !== null ? (
				<AddSubscriber address={selectedAddress} />
			) : (
				<></>
			)}
			<br />
			<Table
				dataSource={dataPoints}
				columns={web3React.active ? columns : columns}
			/>
		</Content>
	);
}

export default ManageSubscribers;
