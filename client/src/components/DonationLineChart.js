import React, { useEffect, useState } from "react";
import { Line } from "@antv/g2plot";
import { gql, useQuery } from "@apollo/client";
import { Chart } from "react-charts";
import { timeConverterIndiv } from "../helpers/HelperFunctions";
import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";

const GET_DOGS = gql`
	query GetDogs {
		donations {
			id
			donation
			tokenAddress
			timeStamp
		}
	}
`;

function DonationLineChart() {
	const { loading, error, data } = useQuery(GET_DOGS);
	const [dataPoints, setDataPoints] = useState(null);
	const axes = [
		{ primary: true, type: "time", position: "bottom" },
		{ type: "linear", position: "left" },
	];

	useEffect(() => {
		if (!loading) {
			let dateDon = {};
			let dates = [];
			for (let index = 0; index < data.donations.length; index++) {
				const element = data.donations[index];
				const { date, month, year } = timeConverterIndiv(element.timeStamp);
				if (dateDon[date + "/" + month + "/" + year] == undefined) {
					dateDon[date + "/" + month + "/" + year] = BigNumber.from(
						element["donation"]
					);
					dates.push(date + "/" + month + "/" + year);
				} else
					dateDon[date + "/" + month + "/" + year] = dateDon[
						date + "/" + month + "/" + year
					].add(BigNumber.from(element["donation"]));
				console.log(
					formatEther(dateDon[date + "/" + month + "/" + year]).toString()
				);
			}
			// for (let index = 0; index < dates.length; index++) {
			// 	const element = dates[index];
			// 	console.log(element);
			// }
		}
	}, [loading]);

	return <div>{/* <Chart data={dataPoints} axes={axes} /> */}</div>;
}

export default DonationLineChart;
