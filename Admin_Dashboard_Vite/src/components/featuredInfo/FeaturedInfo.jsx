import "./featuredinfo.css";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import React from "react";

const FeaturedInfo = React.memo(
	({ users, sales, revenue, revenueChange, salesChange, userChange }) => {
		const items = [
			{
				title: "Revenue",
				value: revenue,
				change: revenueChange || 0,
				isCurrency: true,
			},
			{
				title: "Sales",
				value: sales,
				change: salesChange || 0,
				isCurrency: false,
			},
			{
				title: "Users",
				value: users,
				change: userChange || 0,
				isCurrency: false,
			},
		];

		return (
			<div className='featuredInfo'>
				{items.map((item, index) => {
					const isPositive = item.change >= 0;

					return (
						<div className='featuredItem' key={index}>
							<h2 className='featured-title'>{item.title}</h2>

							<div className='money'>
								<p>
									{item.isCurrency ? `$${item.value}` : item.value}

									<span>
										{item.change}

										{isPositive ?
											<ArrowUpward className='upward' />
										:	<ArrowDownward className='downward' />}
									</span>
								</p>
							</div>

							<p className='featured-info'>Compared to last month</p>
						</div>
					);
				})}
			</div>
		);
	},
);
export default FeaturedInfo;
