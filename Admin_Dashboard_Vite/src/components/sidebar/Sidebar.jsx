import "./Sidebar.css";
import { Link } from "react-router-dom";
import LineStyle from "@mui/icons-material/LineStyle";
import Timeline from "@mui/icons-material/Timeline";
import TrendingUp from "@mui/icons-material/TrendingUp";
import PermIdentity from "@mui/icons-material/PermIdentity";
import Storefront from "@mui/icons-material/Storefront";
import AttachMoney from "@mui/icons-material/AttachMoney";
import BarChart from "@mui/icons-material/BarChart";
import MailOutline from "@mui/icons-material/MailOutline";
import DynamicFeed from "@mui/icons-material/DynamicFeed";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import WorkOutline from "@mui/icons-material/WorkOutline";
import Report from "@mui/icons-material/Report";

const Sidebar = () => {
	return (
		<div className='sidebar' data-testid='sidebar' role='navigation'>
			<div className='sidebar-wrapper'>
				<div className='sidebar-menu'>
					<h3 className='sidebar-title'>Dashboard</h3>
					<ul>
						<li className='sidebar-icons'>
							<LineStyle className='sidebar-icon' />
							<Link to='/' className='sidebar-links'>
								Home
							</Link>
						</li>

						<li className='sidebar-icons'>
							<Timeline className='sidebar-icon' />
							Analytics
						</li>
						<li className='sidebar-icons'>
							<TrendingUp className='sidebar-icon' />
							Sales
						</li>
					</ul>
				</div>
				<div className='sidebar-menu'>
					<h3 className='sidebar-title'>Quick Menu</h3>
					<ul>
						<li className='sidebar-icons'>
							<PermIdentity className='sidebar-icon' />
							<Link to='/users' className='sidebar-links'>
								Users
							</Link>
						</li>
						<li className='sidebar-icons'>
							<Storefront className='sidebar-icon' />
							<Link to='/products' className='sidebar-links'>
								Products
							</Link>
						</li>

						<li className='sidebar-icons'>
							<AttachMoney className='sidebar-icon' />
							<Link to='/transactions' className='sidebar-links'>
								Transactions
							</Link>
						</li>
						<li className='sidebar-icons'>
							<BarChart className='sidebar-icon' />
							<Link to='/reports' className='sidebar-links'>
								Reports
							</Link>
						</li>
					</ul>
				</div>
				<div className='sidebar-menu'>
					<h3 className='sidebar-title'>Notifications</h3>
					<ul>
						<li className='sidebar-icons'>
							<MailOutline className='sidebar-icon' />
							<Link to='/mail' className='sidebar-links'>
								Mail
							</Link>
						</li>
						<li className='sidebar-icons'>
							<DynamicFeed className='sidebar-icon' />
							<Link to='/feedback' className='sidebar-links'>
								Feedback
							</Link>
						</li>
						<li className='sidebar-icons'>
							<ChatBubbleOutline className='sidebar-icon' />
							<Link to='/messages' className='sidebar-links'>
								Messages
							</Link>
						</li>
					</ul>
				</div>
				<div className='sidebar-menu'>
					<h3 className='sidebar-title'>Staff</h3>
					<ul>
						<li className='sidebar-icons'>
							<WorkOutline className='sidebar-icon' />
							<Link to='/manage' className='sidebar-links'>
								Manage
							</Link>
						</li>
						<li className='sidebar-icons'>
							<Timeline className='sidebar-icon' />
							<Link to='/analytics' className='sidebar-links'>
								Analytics
							</Link>
						</li>
						<li className='sidebar-icons'>
							<Report className='sidebar-icon' />
							<Link to='/reports' className='sidebar-links'>
								Reports
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
