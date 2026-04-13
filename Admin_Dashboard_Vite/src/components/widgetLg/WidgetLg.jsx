import { useEffect, useState } from "react";
import { useGetTransactionsQuery } from "../../redux/api/transactionApi";
import "./WidgetLg.css";
import { io } from "socket.io-client";

const socket = io(
	"http://app-dashboard-api-c4gvdch3fvgcgtcz.westeurope-01.azurewebsites.net",
);

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

			<div className='widgetLgTableWrap'>
				<table>
					<caption
						style={{
							position: "absolute",
							width: "1px",
							height: "1px",
							padding: 0,
							margin: "-1px",
							overflow: "hidden",
							clip: "rect(0, 0, 0, 0)",
							whiteSpace: "nowrap",
							border: 0,
						}}
					>
						Recent customer transactions
					</caption>
					<thead>
						<tr>
							<th scope='col'>Customer</th>
							<th scope='col'>Date</th>
							<th scope='col'>Amount</th>
							<th scope='col'>Status</th>
						</tr>
					</thead>

					<tbody>
						{transactions?.length > 0 ?
							transactions.slice(0, 6).map((tx) => (
								<tr key={tx._id || tx.id}>
									<td className='first-col'>
										<img
											className='row-image'
											src={tx.profilePic || "/placeholder.svg"}
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
							))
						:	<tr>
								<td colSpan={4}>No transactions available.</td>
							</tr>
						}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default WidgetLg;
