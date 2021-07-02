import React, { useEffect, useState } from "react";
import { Typography, Layout, Menu, Dropdown, Modal, Button } from "antd";
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
const { Text, Title, Paragraph, Link } = Typography;

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
		title: "Share %",
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
				Something went wrong!
			</Content>
		);
	}

	function info() {
		Modal.info({
			title: "What is a share?",
			content: (
				<div>
					<p>
						Share is used to calculate the amount a receiver would receive out
						of the total amount received by an address. The share value is out
						of 100.
					</p>
					<p>
						The calculation for shares happen the same it happens for equity.
						When a new receiver is brought on board the existing receivers lose
						proportionate amount of shares to provide the new receiver the new
						share amount.
					</p>
				</div>
			),
			onOk() {},
		});
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
				You can manage the addresses that receive a{" "}
				<Link onClick={info}>share</Link> of the tokens received in the selected
				account. Please note that it might take a couple of minutes for a newly
				added receiver to be reflected in the UI. You will have to refresh.
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
