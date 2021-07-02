import React from "react";
import { Form, InputNumber, Modal, Button, notification } from "antd";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import BaseDistributor from "../contracts/BaseDistributor.json";

function ModifySubscriber(props) {
	const web3React = useWeb3React();
	// console.log(props);
	const [visible, setVisible] = React.useState(false);
	const [confirmLoading, setConfirmLoading] = React.useState(false);

	const [form] = Form.useForm();

	const openNotification = () => {
		notification["success"]({
			message: "Success!",
			description: "The share modification worked successfully!",
			duration: 2.5,
			onClick: () => {
				console.log("Notification Clicked!");
			},
		});
	};

	const openFailNotification = () => {
		notification["error"]({
			message: "Fail!",
			description: "The share modification was unsuccessfull!",
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

	async function modifySubscriber(values) {
		const contract = new Contract(
			props.selectedAddress,
			BaseDistributor.abi,
			web3React.library.getSigner()
		);
		// console.log(contract);
		// if (typeof contract !== undefined)
		console.log(props);
		await contract
			.modifyUser(props.userAddress, values.shareUnits)
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
		await modifySubscriber(values);
		// setVisible(false);
		// setConfirmLoading(false);
	};
	const existShare = "Existing share: " + props.currentShare;

	return (
		<>
			{web3React.active && (
				<>
					<Button type="primary" onClick={showModal}>
						Modify share percentage
					</Button>
					<Modal
						title="Modify beneficiary share percentage."
						visible={visible}
						onOk={onOk}
						onCancel={onCancel}
						confirmLoading={confirmLoading}
					>
						{existShare}
						<Form
							form={form}
							layout="vertical"
							name="userForm"
							onFinish={onFinish}
						>
							<Form.Item
								name="shareUnits"
								label="New Share %"
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

export default ModifySubscriber;
