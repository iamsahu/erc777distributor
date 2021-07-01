import React, { useEffect, useState } from "react";
import { Typography, Layout } from "antd";
import { Table, Tag, Space } from "antd";
import AddAddress from "../components/AddAddress";
import { useWeb3React } from "@web3-react/core";
import { gql, useQuery } from "@apollo/client";
import ModifyAddressName from "../components/ModifyAddressName";
import { timeConverter } from "../helpers/HelperFunctions";
import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";
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
			donations {
				donation
				token
			}
			distributions {
				amountDistributed
				token
			}
		}
	}
`;

let tagColor = {
	fDAIx: "volcano",
	fTUSDx: "gold",
	fUSDCx: "blue",
	ETHx: "cyan",
};

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
		title: "Funds Received",
		key: "donation",
		render: (text, record) => {
			// console.log(record);
			if (record.donations.length > 0) {
				let value = {
					fDAIx: BigNumber.from(0),
					fTUSDx: BigNumber.from(0),
					fUSDCx: BigNumber.from(0),
					ETHx: BigNumber.from(0),
				};
				for (let index = 0; index < record.donations.length; index++) {
					const element = record.donations[index];

					value[element["token"]] = value[element["token"]].add(
						BigNumber.from(element["donation"])
					);
				}

				let temp = [];

				for (const key in value) {
					if (Object.hasOwnProperty.call(value, key)) {
						temp.push(
							<Tag color={tagColor[key]}>
								{key + " : " + formatEther(value[key]).toString()}
							</Tag>
						);
					}
				}
				return (
					<Space size="small" direction="vertical">
						{temp}
					</Space>
				);
			} else {
				return <Space size="middle">No funds received</Space>;
			}
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
	{
		title: "Funds Disbursed",
		key: "distributions",
		render: (text, record) => {
			// console.log(record);
			if (record.distributions.length > 0) {
				let value = {
					fDAIx: BigNumber.from(0),
					fTUSDx: BigNumber.from(0),
					fUSDCx: BigNumber.from(0),
					ETHx: BigNumber.from(0),
				};
				for (let index = 0; index < record.distributions.length; index++) {
					const element = record.distributions[index];

					value[element["token"]] = value[element["token"]].add(
						BigNumber.from(element["amountDistributed"])
					);
				}

				let temp = [];
				for (const key in value) {
					if (Object.hasOwnProperty.call(value, key)) {
						temp.push(
							<Tag color={tagColor[key]}>
								{key + " : " + formatEther(value[key]).toString()}
							</Tag>
						);
					}
				}
				return (
					<Space size="small" direction="vertical">
						{temp}
					</Space>
				);
			} else {
				return <Space size="middle">No funds to disburse</Space>;
			}
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
					Please note that it might take a couple of minutes for a newly created
					account to be reflected in the UI.
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
					Please note that it might take a couple of minutes for a newly created
					account to be reflected in the UI.
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
				Please note that it might take a couple of minutes for a newly created
				account to be reflected in the UI. You will have to refresh.
			</Text>
			<br />
			<AddAddress />
			<br />
			<Table dataSource={dataPoints} columns={columns}></Table>
		</Content>
	);
}

export default ManageAddresses;
