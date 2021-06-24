import React, { useEffect, useState } from "react";
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
			token
			timeStamp
		}
	}
`;

function DonationLineChart() {
	const { loading, error, data } = useQuery(GET_DOGS);
	const [dataPoints, setDataPoints] = useState("");
	const axes = [
		{ primary: true, type: "linear", position: "bottom" },
		{ type: "linear", position: "left" },
	];

	useEffect(() => {
		if (!loading) {
			let dateDon = {};
			let dates = [];
			let finData = [];
			// console.log(data);
			for (let index = 0; index < data.donations.length; index++) {
				const element = data.donations[index];
				// console.log(timeConverterIndiv(element.timeStamp));
				const [date, month, year] = timeConverterIndiv(element.timeStamp);
				let tempTime = Date.parse(
					year.toString() + "-" + month.toString() + "-" + date.toString()
				);
				// val = new Date();
				if (dateDon[tempTime] === undefined) {
					dateDon[tempTime] = [
						{
							amount: BigNumber.from(element["donation"]),
							category: element.token,
						},
					];
					dates.push(tempTime);
				} else {
					var found = false;
					for (let index = 0; index < dateDon[tempTime].length; index++) {
						const element2 = dateDon[tempTime][index];
						if (element2.category === element.token) {
							found = true;
							dateDon[tempTime][index]["amount"] = dateDon[tempTime][index][
								"amount"
							].add(BigNumber.from(element["donation"]));
							dateDon[tempTime][index]["category"] = element.token;
						}
					}
					if (!found) {
						dateDon[tempTime].push({
							amount: BigNumber.from(element["donation"]),
							category: element.token,
						});
					}
				}

				// console.log(formatEther(dateDon[date + "/" + month + "/" + year]));
			}
			// console.log(dateDon);
			for (var key in dateDon) {
				// console.log(dateDon[key]);
				for (let index = 0; index < dateDon[key].length; index++) {
					const element = dateDon[key][index];
					finData.push({
						date: key,
						value: parseFloat(formatEther(element.amount)),
						category: element.category,
					});
				}
			}
			let finData2 = {};
			for (var key in dateDon) {
				for (let index = 0; index < dateDon[key].length; index++) {
					const element = dateDon[key][index];
					if (finData2[element.category] === undefined) {
						finData2[element.category] = [
							[parseInt(key), parseFloat(formatEther(element.amount))],
						];
					} else {
						finData2[element.category].push([
							parseInt(key),
							parseFloat(formatEther(element.amount)),
						]);
					}
				}
			}
			// console.log(finData2);
			let finalData = [];
			for (var key in finData2) {
				finalData.push({
					label: key,
					data: finData2[key],
				});
			}
			// console.log(finalData);
			setDataPoints(finalData);
			// console.log(finData);
			// for (let index = 0; index < dates.length; index++) {
			// 	const element = dates[index];
			// 	console.log(element);
			// }

			// setDataPoints({
			// 	finData,
			// 	padding: "auto",
			// 	xField: "date",
			// 	yField: "amoount",
			// 	seriesField: "category",
			// 	xAxis: {
			// 		type: "time",
			// 	},
			// });
		}
	}, [loading]);

	// return (
	// 	<div>
	// 		<ReactG2Plot Ctor={Line} options={dataPoints} />
	// 		{/* {dataPoints === "" ? (
	// 			<p>hello</p>
	// 		) : (
	// 			<ReactG2Plot Ctor={Line} options={dataPoints} />
	// 		)} */}
	// 	</div>
	// );
	return (
		<div>
			{dataPoints === "" ? (
				<Chart data={dataPoints} axes={axes} />
			) : (
				<Chart data={dataPoints} axes={axes} />
			)}
		</div>
	);
}

export default DonationLineChart;
