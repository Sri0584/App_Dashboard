import React from "react";
import "./Chart.css";
import {
	LineChart,
	Line,
	XAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	YAxis,
} from "recharts";

const Chart = React.memo(({ title, data, datakey, grid, xDatakey }) => {
	return (
		<div className='chart'>
			<h2 className='chart-title'>{title}</h2>

			<ResponsiveContainer width='100%' height={300}>
				<LineChart width={500} height={300} data={data}>
					<XAxis dataKey={xDatakey} stroke='#5550bd' />
					<Line type='monotone' dataKey={datakey} stroke='#5550bd' />
					<YAxis />
					<Tooltip />
					{grid && <CartesianGrid stroke='#e0dfdf' strokeDasharray='5 5' />}
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
});

export default Chart;
