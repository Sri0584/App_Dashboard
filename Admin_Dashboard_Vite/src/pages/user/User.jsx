import { useParams } from "react-router-dom";
import "./user.css";
import LocationSearching from "@mui/icons-material/LocationSearching";
import MailOutline from "@mui/icons-material/MailOutline";
import PermIdentity from "@mui/icons-material/PermIdentity";
import Publish from "@mui/icons-material/Publish";
import { toast } from "react-toastify";

import { useState } from "react";
import {
	useGetUserByIdQuery,
	useUpdateUserMutation,
} from "../../redux/api/userApi";

const User = () => {
	const { id } = useParams();

	const { data: user, isLoading } = useGetUserByIdQuery(id);
	const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

	// ✅ initialize directly (no useEffect)
	const [formData, setFormData] = useState(null);

	// ✅ handle change
	const handleChange = (e) => {
		const { name, value, files, type } = e.target;

		setFormData((prev) => ({
			...(prev || user), // fallback to original user
			[name]: type === "file" ? files[0] : value,
		}));
	};

	// ✅ submit
	const handleSubmit = async (e) => {
		e.preventDefault();

		const finalData = formData || user;

		try {
			await updateUser({
				id,
				...finalData,
			}).unwrap();

			toast.success("✅ User updated successfully!");
		} catch (err) {
			toast.error(err?.data?.message || "Update failed");
		}
	};
	if (isLoading || !user || isUpdating) return <div>Loading...</div>;

	// ✅ always read from merged data
	const displayData = formData ?? user;

	return (
		<div className='user'>
			<div className='user-header'>
				<h1>Edit User</h1>
			</div>

			<div className='user-details'>
				{/* LEFT */}
				<div className='old-data'>
					<div className='title'>
						<img
							src={
								typeof displayData?.avatar === "string" ? displayData.avatar
								: displayData?.avatar ?
									URL.createObjectURL(displayData.avatar)
								:	"https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"

							}
							alt='user avatar'
							loading='lazy'
							className='oldData-image'
							width={100}
							height={100}
						/>

						<div>
							<span>{displayData.username}</span>
							<span>Software Engineer</span>
						</div>
					</div>

					<div>
						<PermIdentity />
						<span>{displayData.username}</span>
					</div>

					<div>
						<MailOutline />
						<span>{displayData.email}</span>
					</div>

					<div>
						<LocationSearching />
						<span>New York | USA</span>
					</div>
				</div>

				{/* RIGHT */}
				<div className='edit-data'>
					<h2>Edit</h2>

					<form onSubmit={handleSubmit}>
						<label htmlFor='username'>Username</label>
						<input
							type='text'
							name='username'
							id='username'
							value={displayData.username || ""}
							onChange={handleChange}
						/>

						<label htmlFor='email'>Email</label>
						<input
							type='email'
							name='email'
							id='email'
							value={displayData.email || ""}
							onChange={handleChange}
						/>

						<label htmlFor='transaction'>Transaction</label>
						<input
							type='text'
							name='transaction'
							id='transaction'
							value={displayData.transaction || ""}
							onChange={handleChange}
						/>

						<div>
							<img
								src={
									typeof displayData.avatar === "string" ? displayData.avatar
									: displayData.avatar ?
										URL.createObjectURL(displayData.avatar)
									:	""
								}
								alt='Avatar'
								width='100'
								loading='lazy'
								height='100'
								className='avatar-preview'
							/>

							<label htmlFor='avatar'>
								Change
								<Publish />
							</label>

							<input
								type='file'
								id='avatar'
								name='avatar'
								onChange={handleChange}
								style={{ display: "none" }}
							/>
						</div>

						<button type='submit' disabled={isLoading} aria-label='Update user'>
							{isLoading ? "Updating..." : "Update"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default User;
