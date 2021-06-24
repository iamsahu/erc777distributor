import React from "react";
import { Tabs, Typography, Layout } from "antd";
import DonationsTimeline from "../components/DonationsTimeline";
const { Title } = Typography;
const { TabPane } = Tabs;
const { Content } = Layout;
function TimeLine() {
	function callback(key) {
		console.log(key);
	}

	return (
		<Content
			style={{ padding: "20px 20px", background: "#fff", minHeight: "83vh" }}
		>
			<Title>Timelines</Title>
			<Tabs defaultActiveKey="1" onChange={callback}>
				<TabPane tab="Donations" key="1">
					<DonationsTimeline />
				</TabPane>
				<TabPane tab="Beneficiary Addition" disabled key="2">
					Content of Tab Pane 2
				</TabPane>
			</Tabs>
		</Content>
	);
}

export default TimeLine;
