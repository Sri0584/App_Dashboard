import "./home.css";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";

import {
	useGetAnalyticsQuery,
	useGetUserStatsQuery,
} from "../../redux/api/analyticsApi";
import React, { Suspense, useMemo } from "react";
const Chart = React.lazy(() => import("../../components/chart/Chart"));
const WidgetLg = React.lazy(
	() => import("../../components/widgetLg/WidgetLg.jsx"),
);
const WidgetSm = React.lazy(() => import("../../components/widgetSm/WidgetSm"));

const Home = () => {
	const { data: analytics, isLoading: analyticsLoading } =
		useGetAnalyticsQuery();

	const { data: userStats, isLoading: statsLoading } = useGetUserStatsQuery();

	const chartData = useMemo(() => userStats || [], [userStats]);
	if (analyticsLoading || statsLoading || !analytics || !userStats)
		return <p>Loading dashboard...</p>;

	return (
		<div className='home'>
			<h1>Dashboard</h1>
			<Suspense fallback={<div>Loading ...</div>}>
				<FeaturedInfo
					users={analytics.users}
					revenue={analytics.revenue}
					sales={analytics.sales}
					revenueChange={analytics.revenueChange}
					salesChange={analytics.salesChange}
					userChange={analytics.userChange}
				/>

				<Chart
					data={chartData}
					title='User Analytics'
					datakey='users'
					xDatakey='name'
					grid
				/>
				<div className='widgets'>
					<WidgetSm />
					<WidgetLg />
				</div>
			</Suspense>
		</div>
	);
};

export default Home;
