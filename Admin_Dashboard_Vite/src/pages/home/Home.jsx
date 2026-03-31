import "./home.css";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import Chart from "../../components/chart/Chart";
import WidgetLg from "../../components/widgetLg/WidgetLg.jsx";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import {
	useGetAnalyticsQuery,
	useGetUserStatsQuery,
} from "../../redux/api/analyticsApi";

const Home = () => {
	const { data: analytics, isLoading: analyticsLoading } =
		useGetAnalyticsQuery();

	const { data: userStats, isLoading: statsLoading } = useGetUserStatsQuery();

	if (analyticsLoading || statsLoading) return <p>Loading dashboard...</p>;

	return (
		<div className='home'>
			<FeaturedInfo data={analytics} />
			<Chart
				data={userStats || null}
				title='User Analytics'
				datakey='users'
				xDatakey='name'
				grid
			/>
			<div className='widgets'>
				<WidgetSm />
				<WidgetLg />
			</div>
		</div>
	);
};

export default Home;
