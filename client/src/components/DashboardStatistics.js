import React from "react";
import { Statistic, Card, Row, Col } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

function DashboardStatistics() {
	return (
		<div className="site-statistic-demo-card">
			<Row gutter={16}>
				<Col span={12}>
					<Card>
						<Statistic
							title="Donations Received"
							value={11.28}
							// precision={2}
							valueStyle={{ color: "#3f8600" }}
							// prefix={<ArrowUpOutlined />}
							// suffix="%"
						/>
					</Card>
				</Col>
				<Col span={12}>
					<Card>
						<Statistic
							title="Total Benefeciaries"
							value={10}
							valueStyle={{ color: "#cf1322" }}
						/>
					</Card>
				</Col>
			</Row>
		</div>
	);
}

export default DashboardStatistics;
