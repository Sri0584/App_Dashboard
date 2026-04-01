import "./login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { useLoginMutation } from "../../redux/api/authApi";

export default function Login() {
	const navigate = useNavigate();

	const [loginUser, { isLoading }] = useLoginMutation();

	const [form, setForm] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await loginUser(form).unwrap();

			toast.success("Login successful 🎉");

			// ✅ redirect
			navigate("/");
		} catch (err) {
			toast.error(err?.data || "Login failed ❌");
			navigate("/register");
		}
	};

	if (isLoading) return <div className='login'>Loading...</div>;

	return (
		<div className='login'>
			<h1 className='loginTitle'>Login</h1>

			<form className='loginForm' onSubmit={handleSubmit}>
				<input
					type='email'
					name='email'
					placeholder='Email'
					className='loginInput'
					value={form.email}
					onChange={handleChange}
					required
				/>

				<input
					type='password'
					name='password'
					placeholder='Password'
					className='loginInput'
					value={form.password}
					onChange={handleChange}
					required
				/>

				<button
					className='loginButton'
					disabled={isLoading}
					aria-label='login'
					type='submit'
				>
					{isLoading ? "Logging in..." : "Login"}
				</button>
			</form>
		</div>
	);
}
