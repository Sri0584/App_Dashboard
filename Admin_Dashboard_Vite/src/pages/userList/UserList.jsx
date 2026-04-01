import "./userList.css";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import {
	useDeleteUserMutation,
	useGetUsersQuery,
} from "../../redux/api/userApi";
import { toast } from "react-toastify";

const UserList = () => {
	// ✅ Fetch users from backend
	const { data: users = [], isLoading } = useGetUsersQuery(undefined, {
		refetchOnMountOrArgChange: true,
		refetchOnFocus: true,
	});

	// ✅ Delete mutation
	const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

	const rows = users?.map((user) => ({
		id: user._id, // required for DataGrid
		username: user.username,
		email: user.email,
		status: user.isActive ? "Active" : "Inactive",
		transaction: user.transactions || "$0",
		avatar:
			user.avatar ||
			"https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
	}));

	// ✅ Handle delete (API + UI)
	const handleDelete = async (id) => {
		try {
			await deleteUser(id).unwrap();
			toast.success("User deleted ✅");
		} catch (err) {
			toast.error(`Delete failed ❌, ${err}`);
		}
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 90 },

		{
			field: "user",
			headerName: "User",
			width: 200,
			renderCell: (params) => (
				<div className='userList-user'>
					<img
						className='UserListImg'
						src={params.row.avatar}
						alt='user image'
						loading='lazy'
						width={100}
						height={100}
					/>
					{params.row.username}
				</div>
			),
		},

		{ field: "email", headerName: "Email", width: 200 },

		{ field: "status", headerName: "Status", width: 120 },

		{
			field: "transaction",
			headerName: "Transaction Volume",
			width: 200,
		},

		{
			field: "action",
			headerName: "Action",
			width: 150,
			renderCell: (params) => (
				<>
					<Link to={"/user/" + params.row.id}>
						<button className='edit' aria-label='Edit user'>
							Edit
						</button>
					</Link>

					<DeleteOutline
						className='delete'
						aria-label='Delete user'
						onClick={() => handleDelete(params.row.id)}
					/>
				</>
			),
		},
	];

	if (isLoading || isDeleting)
		return <div className='userList'>Loading...</div>;

	return (
		<div className='userList-container'>
			<Link to='/newuser'>
				<button aria-label='Create user'>Create User</button>
			</Link>
			<div className='userList'>
				<DataGrid
					rows={rows}
					columns={columns}
					pageSize={10}
					rowsPerPageOptions={[10]}
					checkboxSelection
				/>
			</div>
		</div>
	);
};

export default UserList;
