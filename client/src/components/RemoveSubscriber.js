import React, { useState, useEffect, useContext } from "react";
import {
	Form,
	Input,
	InputNumber,
	Modal,
	Button,
	Avatar,
	Typography,
} from "antd";
// import { SmileOutlined, UserOutlined } from "@ant-design/icons";
// import { FormInstance } from "antd/lib/form";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import ERC777Distributor from "../contracts/ERC777Distributor.json";
import { Web3Provider } from "@ethersproject/providers";
import Web3Context from "../context/Web3Context";

function RemoveSubscriber(props) {
	const details = useContext(Web3Context);
	const { accounts, contract, web3 } = details.current;
	const web3React = useWeb3React();

	const [visible, setVisible] = React.useState(false);
	const [confirmLoading, setConfirmLoading] = React.useState(false);

	const showModal = () => {
		setVisible(true);
	};

	// useEffect(() => {
	//     const contract = new Contract(ERC777Distributor.networks[web3React.chainId].address,ERC777Distributor.abi, web3React.library.getSigner())
	//     return () => {
	//         cleanup
	//     }
	// }, [input])

	// const networkId = details.current.networkId;
	// // const cc = ERC777Distributor.networks[networkId];
	// const local1nstance = new web3.eth.Contract(
	// 	ERC777Distributor.abi,
	// 	"0x4078d8dC99c90Ac5c5D7A233d01f250CDCFA54A0"
	// );

	const handleCancel = () => {
		console.log("Clicked cancel button");
		setVisible(false);
	};

	const onOk = async () => {
		setConfirmLoading(true);
		await removeSubscriber();
	};

	const onCancel = () => {
		setVisible(false);
	};

	async function removeSubscriber(values) {
		// const contract = new Contract(
		// 	"0x46fc4c2bf75bdd2d88426ac218b84dd168e86a16",
		// 	ERC777Distributor.abi,
		// 	web3React.library.getSigner()
		// );
		// console.log(contract);
		// if (typeof contract !== undefined)
		await details.current.mainContract.methods
			.removeUser(props.userAddress)
			.send({ from: web3React.account })
			.on("confirmation", function (confirmationNumber, receipt) {
				console.log(confirmationNumber);
				console.log(receipt);
				setVisible(false);
				setConfirmLoading(false);
			})
			.on("error", function (error, receipt) {
				// If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
				console.log(error);
			});
	}

	return (
		<>
			{web3React.active && (
				<>
					<Button type="primary" onClick={showModal}>
						Remove
					</Button>
					<Modal
						title="Remove beneficiary"
						visible={visible}
						onOk={onOk}
						onCancel={onCancel}
						confirmLoading={confirmLoading}
						okText="Confirm"
					>
						<p>Are you sure you want to remove {props.userAddress}?</p>
					</Modal>
				</>
			)}
		</>
	);
}

export default RemoveSubscriber;
