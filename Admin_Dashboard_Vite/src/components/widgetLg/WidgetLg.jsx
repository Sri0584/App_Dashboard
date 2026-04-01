import { useEffect, useState } from "react";
import { useGetTransactionsQuery } from "../../redux/api/transactionApi";
import "./WidgetLg.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const WidgetLg = () => {
	const { data, isLoading } = useGetTransactionsQuery();
	const [transactions, setTransactions] = useState([]);

	// initial load
	useEffect(() => {
		if (data) {
			setTransactions(data);
		}
	}, [data]);

	// real-time updates
	useEffect(() => {
		socket.on("newTransaction", (newTx) => {
			setTransactions((prev) => [newTx, ...prev]);
		});

		return () => socket.off("newTransaction");
	}, []);

	const Button = ({ type }) => {
		return (
			<button className={"widget-button " + type} aria-label={type}>
				{type}
			</button>
		);
	};

	if (isLoading) return <p>Loading transactions...</p>;

	return (
		<div className='widgetLg'>
			<h3>Latest Transactions</h3>

			<table>
				<thead>
					<tr>
						<th>Customer</th>
						<th>Date</th>
						<th>Amount</th>
						<th>Status</th>
					</tr>
				</thead>

				<tbody>
					{transactions?.slice(0, 6).map((tx) => (
						<tr key={tx._id || tx.id}>
							<td className='first-col'>
								<img
									className='row-image'
									src={
										tx.profilePic ||
										"https://images.pexels.com/photos/4172933/pexels-photo-4172933.jpeg"
									}
									alt='transaction image'
									loading='lazy'
									width={100}
									height={100}
								/>
								<span>{tx.customer || "Unknown User"}</span>
							</td>

							<td>
								{new Date(tx.createdAt || Date.now()).toLocaleDateString()}
							</td>

							<td>${tx.amount}</td>

							<td className='widget-status'>
								<Button type={tx.status || "Pending"} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default WidgetLg;
