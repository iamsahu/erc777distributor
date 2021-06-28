import React from "react";
import { Form, Input, InputNumber, Modal, Button, notification } from "antd";
// import { SmileOutlined, UserOutlined } from "@ant-design/icons";
// import { FormInstance } from "antd/lib/form";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import DistributorFactory from "../contracts/DistributorFactory.json";
// import Web3Context from "../context/Web3Context";

function AddAddress() {
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
			description: "Beneficiary added successfully!",
			duration: 2.5,
			onClick: () => {
				console.log("Notification Clicked!");
			},
		});
	};

	const openFailNotification = () => {
		notification["error"]({
			message: "Fail!",
			description: "Beneficiary addition failed!",
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
		RegisterSubsriber();
	};

	const onCancel = () => {
		setVisible(false);
	};

	async function RegisterSubsriber() {
		const contract = new Contract(
			DistributorFactory.networks[web3React.chainId].address,
			DistributorFactory.abi,
			web3React.library.getSigner()
		);
		// console.log(contract);
		if (typeof contract !== undefined)
			await contract
				.createThing()
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
		await RegisterSubsriber(values);
		// setVisible(false);
		// setConfirmLoading(false);
	};

	return (
		<>
			{web3React.active && (
				<>
					<Button type="primary" onClick={showModal}>
						Create a new account
					</Button>
					<Modal
						title="Create a new receiving account?"
						visible={visible}
						onOk={onOk}
						onCancel={onCancel}
						confirmLoading={confirmLoading}
					></Modal>
				</>
			)}
		</>
	);
}

export default AddAddress;
