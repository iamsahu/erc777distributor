import React from "react";
import { Form, Input, InputNumber, Modal, Button, notification } from "antd";
// import { SmileOutlined, UserOutlined } from "@ant-design/icons";
// import { FormInstance } from "antd/lib/form";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import BaseDistributor from "../contracts/BaseDistributor.json";
// import Web3Context from "../context/Web3Context";

function AddSubscriber(props) {
	// const details = useContext(Web3Context);
	// const { accounts, contract, web3 } = details.current;
	const web3React = useWeb3React();
	// console.log(web3React);
	const [visible, setVisible] = React.useState(false);
	const [confirmLoading, setConfirmLoading] = React.useState(false);

	const [form] = Form.useForm();

	const openNotification = () => {
		notification["success"]({
			message: "Success!",
			description: "Receiver added successfully!",
			duration: 2.5,
			onClick: () => {
				console.log("Notification Clicked!");
			},
		});
	};

	const openFailNotification = () => {
		notification["error"]({
			message: "Fail!",
			description: "Receiver addition failed!",
			duration: 2.5,
			onClick: () => {
				console.log("Notification Clicked!");
			},
		});
	};

	const showModal = () => {
		setVisible(true);
	};

	const onOk = () => {
		setConfirmLoading(true);
		form.submit();
	};

	const onCancel = () => {
		setVisible(false);
	};

	async function RegisterSubsriber(values) {
		const contract = new Contract(
			props.address,
			BaseDistributor.abi,
			web3React.library.getSigner()
		);
		// console.log(contract);
		if (typeof contract !== undefined)
			await contract
				.addUser(values.address, values.shareUnits, values.name)
				.then((response) => {
					console.log(response);
					setVisible(false);
					setConfirmLoading(false);
					openNotification();
				})
				.catch((error) => {
					setVisible(false);
					setConfirmLoading(false);
					console.log(error.message);
					openFailNotification();
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
						Add a receiver
					</Button>
					<Modal
						title="Add a receiver"
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
							<Form.Item name="name" label="Name" rules={[{ required: true }]}>
								<Input />
							</Form.Item>
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
								<InputNumber min={1} max={100} />
							</Form.Item>
						</Form>
					</Modal>
				</>
			)}
		</>
	);
}

export default AddSubscriber;
