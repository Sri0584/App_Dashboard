import { useGetUsersQuery } from "../../redux/api/userApi";
import "./WidgetSm.css";
import { Visibility } from "@mui/icons-material";

const WidgetSm = () => {
	const { data: users, isLoading, isError } = useGetUsersQuery();

	if (isLoading) return <p>Loading users...</p>;
	if (isError) return <p>Error loading users</p>;

	return (
		<div className='widgetSm'>
			<h3 className='widget-title'>New Join Members</h3>

			<ul>
				{users?.slice(0, 5).map((user) => (
					<li className='widgetSm-list' key={user._id}>
						<img
							src={user.profilePic || "/placeholder.svg"}
							alt='user image'
							className='widget-image'
							loading='lazy'
							width={100}
							height={100}
						/>

						<div className='widget-user'>
							<span className='widget-username'>{user.username}</span>

							<span className='widget-title'>{user.email}</span>
						</div>

						<button
							className='widget-btn'
							aria-label={`View ${user.username}'s profile`}
						>
							<Visibility className='widet-icon' />
							Display
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default WidgetSm;
