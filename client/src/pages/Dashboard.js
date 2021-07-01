import React from "react";
import { Card, Typography, Layout, Divider } from "antd";
import DashboardStatistics from "../components/DashboardStatistics";
import DonationLineChart from "../components/DonationLineChart";
const { Content } = Layout;
const { Text, Title, Paragraph } = Typography;

function Dashboard() {
	return (
		<Content
			style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
		>
			<Card>
				<Title level={3}>What is ERC777 distributor?</Title>
				<Paragraph>
					Welcome to ERC777 fund distributor. The easiest way to collect &
					automatically distribute ERC777 tokens at a fixed cost. You can
					distribute funds to any number of receivers at a fixed cost. The
					application allows you to create multiple accounts in which you could
					receive funds and add multiple receivers to those accounts. The
					receivers will receive funds automatically from the accounts in which
					they are added in proportion to the shares they were allocated.
				</Paragraph>
				<Paragraph>
					You can use this to collect & disburse funds for donations, projects,
					royalty distribution, etc.
				</Paragraph>
				<Text type="warning">
					Please note for now we only support DAIx, USDCx, TUSDx & ETHx
				</Text>
			</Card>
			<Divider />
			<Title> Dashboard</Title>
			<Text>
				You can see all the funds received in all the accounts on this page.
			</Text>
			<br />
			<DashboardStatistics />
		</Content>
	);
}

export default Dashboard;
