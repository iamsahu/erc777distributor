import React from "react";
import { Form, InputNumber, Modal, Button, notification } from "antd";
// import { SmileOutlined, UserOutlined } from "@ant-design/icons";
// import { FormInstance } from "antd/lib/form";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import ERC777Distributor from "../contracts/ERC777Distributor.json";

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

	const onOk = () => {
		setConfirmLoading(true);
		form.submit();
	};

	const onCancel = () => {
		setVisible(false);
	};

	async function modifySubscriber(values) {
		const contract = new Contract(
			ERC777Distributor.networks[web3React.chainId].address,
			ERC777Distributor.abi,
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
		// .send({ from: web3React.account })
		// .on("confirmation", function (confirmationNumber, receipt) {
		// 	console.log(confirmationNumber);
		// 	console.log(receipt);
		// 	setVisible(false);
		// 	setConfirmLoading(false);
		// })
		// .on("error", function (error, receipt) {
		// 	// If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
		// 	console.log(error);
		// });
	}

	const onFinish = async (values) => {
		console.log("Success:", values);
		//TO DO: Add function to fire a query to handle addition of subscriber data.
		await modifySubscriber(values);
		// setVisible(false);
		// setConfirmLoading(false);
	};
	const existShare = "Existing share%: " + props.currentShare;

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
								<InputNumber />
							</Form.Item>
						</Form>
					</Modal>
				</>
			)}
		</>
	);
}

export default ModifySubscriber;
