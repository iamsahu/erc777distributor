import React from "react";
import { Tabs, Typography, Layout, Divider } from "antd";
import DashboardStatistics from "../components/DashboardStatistics";
import DonationLineChart from "../components/DonationLineChart";
const { Content } = Layout;
const { Text, Title } = Typography;

function Dashboard() {
	return (
		<Content
			style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
		>
			<Title> Dashboard</Title>
			<br />
			<DashboardStatistics />
			<DonationLineChart />
		</Content>
	);
}

export default Dashboard;
