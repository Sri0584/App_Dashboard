import "./newUser.css";
import { useFormik } from "formik";
import { object, string } from "yup";
import { toast } from "react-toastify";
import { useCreateUserMutation } from "../../redux/api/userApi"; // adjust path if needed
import { useNavigate } from "react-router-dom";

export default function NewUser() {
	const navigate = useNavigate();
	const [createUser, { isLoading }] = useCreateUserMutation();

	const formik = useFormik({
		initialValues: {
			username: "",
			fullName: "",
			email: "",
			password: "",
			phone: "",
			address: "",
			gender: "male",
			active: "yes",
			role: "admin",
			avatar: "",
		},

		validationSchema: object({
			username: string().required("Required"),
			fullName: string().required("Required"),
			email: string().email("Invalid email").required("Required"),
			password: string().min(6, "Min 6 chars").required("Required"),
			phone: string().required("Required"),
			address: string().required("Required"),
			role: string()
				.oneOf(["admin", "manager", "support"])
				.required("Required"),
		}),

		onSubmit: async (values, { resetForm }) => {
			try {
				await createUser(values).unwrap();
				toast.success("User created successfully 🚀");
				resetForm();
				navigate("/users");
			} catch (err) {
				toast.error(err?.data?.message || "Failed to create user ❌");
			}
		},
	});

	if (isLoading) return <div className='newUser'>Loading...</div>;

	return (
		<div className='newUser'>
			<h1 className='newUserTitle'>New User</h1>

			<form className='newUserForm' onSubmit={formik.handleSubmit}>
				<div className='newUserItem'>
					<label htmlFor='username'>Username</label>
					<input
						type='text'
						name='username'
						placeholder='john'
						id='username'
						value={formik.values.username}
						onChange={formik.handleChange}
					/>
					{formik.errors.username && (
						<span role='alert'>{formik.errors.username}</span>
					)}
				</div>

				<div className='newUserItem'>
					<label htmlFor='fullName'>Full Name</label>
					<input
						type='text'
						name='fullName'
						placeholder='John Smith'
						id='fullName'
						value={formik.values.fullName}
						onChange={formik.handleChange}
					/>
				</div>

				<div className='newUserItem'>
					<label htmlFor='email'>Email</label>
					<input
						type='email'
						name='email'
						placeholder='john@gmail.com'
						id='email'
						value={formik.values.email}
						onChange={formik.handleChange}
					/>
				</div>

				<div className='newUserItem'>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						name='password'
						placeholder='password'
						id='password'
						value={formik.values.password}
						onChange={formik.handleChange}
					/>
				</div>

				<div className='newUserItem'>
					<label htmlFor='phone'>Phone</label>
					<input
						type='text'
						name='phone'
						placeholder='+1 123 456 78'
						id='phone'
						value={formik.values.phone}
						onChange={formik.handleChange}
					/>
				</div>

				<div className='newUserItem'>
					<label htmlFor='address'>Address</label>
					<input
						type='text'
						name='address'
						placeholder='New York | USA'
						id='address'
						value={formik.values.address}
						onChange={formik.handleChange}
					/>
				</div>

				<div className='newUserItem'>
					<label htmlFor='gender'>Gender</label>
					<div className='newUserGender'>
						{["male", "female", "other"].map((g) => (
							<label key={g} htmlFor={`gender-${g}`}>
								<input
									type='radio'
									name='gender'
									id={`gender-${g}`}
									value={g}
									checked={formik.values.gender === g}
									onChange={formik.handleChange}
								/>
								{g}
							</label>
						))}
					</div>
				</div>

				<div className='newUserItem'>
					<label htmlFor='active'>Active</label>
					<select
						className='newUserSelect'
						name='active'
						id='active'
						value={formik.values.active}
						onChange={formik.handleChange}
					>
						<option value='yes'>Yes</option>
						<option value='no'>No</option>
					</select>
				</div>
				<div className='newUserItem'>
					<label htmlFor='role'>Role</label>
					<select
						className='newUserSelect'
						name='role'
						id='role'
						value={formik.values.role}
						onChange={formik.handleChange}
					>
						<option value='admin'>Admin</option>
						<option value='manager'>Manager</option>
						<option value='support'>Support</option>
					</select>
				</div>

				<button
					type='submit'
					className='newUserButton'
					disabled={isLoading}
					aria-label='Create new user'
				>
					{isLoading ? "Creating..." : "Create"}
				</button>
			</form>
		</div>
	);
}
