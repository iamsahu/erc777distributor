import React from "react";
import { Card, Typography, Layout, Divider } from "antd";
import DashboardStatistics from "../components/DashboardStatistics";
const { Content } = Layout;
const { Text, Title, Paragraph } = Typography;

function Dashboard() {
	return (
		<Content
			style={{ padding: "20px 20px", background: "#fff", minHeight: "80vh" }}
		>
			<Card>
				<Title level={3}>What is ERC777 distributor?</Title>
				<Paragraph>
					Welcome to ERC777 token distributor. The easiest way to collect &
					automatically distribute ERC777 tokens at a fixed cost. You can
					distribute tokens to any number of receivers at a fixed cost. The
					application allows you to create multiple accounts in which you could
					receive tokens and add multiple receivers to those accounts. The
					receivers will receive tokens automatically when tokens are sent to
					the account. The amount received by each receiver is determined by the
					share they have been allocated.
				</Paragraph>
				<Paragraph>
					You can use this to collect & disburse tokens for donations, projects,
					royalty distribution, etc.
				</Paragraph>
				<Text type="warning">
					Please note for now we only support DAIx, USDCx, TUSDx & ETHx. And
					only
				</Text>{" "}
				<Text type="danger">RINKEBY NETWORK.</Text>
			</Card>
			<Divider />
			<Title> Dashboard</Title>
			<Text>
				You can see all the tokens received in all of your accounts in the below
				section.
			</Text>
			<br />
			<DashboardStatistics />
		</Content>
	);
}

export default Dashboard;
