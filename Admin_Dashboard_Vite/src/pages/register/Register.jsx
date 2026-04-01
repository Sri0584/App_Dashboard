import "./register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../redux/api/authApi";

export default function Register() {
	const navigate = useNavigate();
	const [register, { isLoading }] = useRegisterMutation();

	const [form, setForm] = useState({
		username: "",
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
			await register(form).unwrap();

			toast.success("Registration successful 🎉");

			// 👉 redirect to login
			navigate("/login");
		} catch (err) {
			console.error(err);
			toast.error(err?.data || "Registration failed ❌");
		}
	};

	if (isLoading) return <div className='register'>Loading...</div>;

	return (
		<div className='register'>
			<h1 className='registerTitle'>Register</h1>

			<form className='registerForm' onSubmit={handleSubmit}>
				<input
					type='text'
					name='username'
					placeholder='Username'
					className='registerInput'
					value={form.username}
					onChange={handleChange}
					required
				/>

				<input
					type='email'
					name='email'
					placeholder='Email'
					className='registerInput'
					value={form.email}
					onChange={handleChange}
					required
				/>

				<input
					type='password'
					name='password'
					placeholder='Password'
					className='registerInput'
					value={form.password}
					onChange={handleChange}
					required
				/>

				<button
					className='registerButton'
					disabled={isLoading}
					aria-label='Register'
				>
					{isLoading ? "Creating..." : "Register"}
				</button>
			</form>

			{/* 👉 Switch to login */}
			<p className='registerLoginLink'>
				Already have an account?{" "}
				<span onClick={() => navigate("/login")}>Login</span>
			</p>
		</div>
	);
}
