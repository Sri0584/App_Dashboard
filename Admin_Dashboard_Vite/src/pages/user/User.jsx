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
						<div className='displayFlex'>
							<img
								src={
									typeof displayData?.avatar === "string" ? displayData.avatar
									: displayData?.avatar ?
										URL.createObjectURL(displayData.avatar)
									:	"/placeholder.svg"
								}
								alt='user avatar'
								loading='lazy'
								className='oldData-image'
								width={100}
								height={100}
							/>

							<div style={{ alignSelf: "anchor-center" }}>
								<span>{displayData.username}&nbsp;</span>
								<span>Software Engineer</span>
							</div>
						</div>
						<div className='displayFlex'>
							<PermIdentity />
							<span className='alignSelfEnd'>{displayData.username}</span>
						</div>

						<div className='displayFlex'>
							<MailOutline />
							<span className='alignSelfEnd'>{displayData.email}</span>
						</div>

						<div className='displayFlex'>
							<LocationSearching />
							<span className='alignSelfEnd'>New York | USA</span>
						</div>
					</div>
					<div className='details'></div>
				</div>
				{/* RIGHT */}
				<div className='edit-data'>
					<h2>Edit</h2>

					<form onSubmit={handleSubmit} className='edit-form'>
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

						{displayData.isAdmin && (
							<>
								<label htmlFor='role'>Role</label>
								<select
									name='role'
									id='role'
									onChange={handleChange}
									value={displayData.role || "Admin"}
								>
									<option value='admin'>Admin</option>
									<option value='manager'>Manager</option>
									<option value='support'>Support</option>
								</select>
							</>
						)}

						<div>
							<img
								src={
									typeof displayData.avatar === "string" ? displayData.avatar
									: displayData.avatar ?
										URL.createObjectURL(displayData.avatar)
									:	"/placeholder.svg"
								}
								alt='Avatar Preview'
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
