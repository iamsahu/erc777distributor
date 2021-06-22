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

function AddSubscriber() {
	const details = useContext(Web3Context);
	const { accounts, contract, web3 } = details.current;
	const web3React = useWeb3React();
	console.log(web3React);
	const [visible, setVisible] = React.useState(false);
	const [confirmLoading, setConfirmLoading] = React.useState(false);
	const [modalText, setModalText] = React.useState("Content of the modal");
	const [form] = Form.useForm();
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

	const onOk = () => {
		setModalText("The modal will be closed after two seconds");
		setConfirmLoading(true);
		form.submit();
	};

	const onCancel = () => {
		setVisible(false);
	};

	async function RegisterSubsriber(values) {
		// const contract = new Contract(
		// 	"0x46fc4c2bf75bdd2d88426ac218b84dd168e86a16",
		// 	ERC777Distributor.abi,
		// 	web3React.library.getSigner()
		// );
		// console.log(contract);
		// if (typeof contract !== undefined)
		await details.current.mainContract.methods
			.addUser(values.address, values.shareUnits)
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

	const onFinish = async (values) => {
		console.log("Success:", values);
		//TO DO: Add function to fire a query to handle addition of subscriber data.
		await RegisterSubsriber(values);
		// setVisible(false);
		// setConfirmLoading(false);
	};

	return (
		<>
			{web3React.active && (
				<>
					<Button type="primary" onClick={showModal}>
						Add a beneficiary
					</Button>
					<Modal
						title="Add a subsriber"
						visible={visible}
						onOk={onOk}
						onCancel={onCancel}
						confirmLoading={confirmLoading}
					>
						<Form
							form={form}
							layout="vertical"
							name="userForm"
							onFinish={onFinish}
						>
							<Form.Item
								name="address"
								label="Address"
								rules={[{ required: true }]}
							>
								<Input />
							</Form.Item>
							<Form.Item
								name="shareUnits"
								label="Share %"
								rules={[{ required: true }]}
							>
								<InputNumber />
							</Form.Item>
						</Form>
					</Modal>
				</>
			)}
		</>
	);
}

export default AddSubscriber;
