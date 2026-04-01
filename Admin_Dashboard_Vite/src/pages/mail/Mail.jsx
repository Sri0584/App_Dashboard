import { toast } from "react-toastify";
import { useSendMailMutation } from "../../redux/api/mailApi";
import "./mail.css";
import { useState } from "react";
const initialState = {
	to: "",
	subject: "",
	message: "",
};
export default function Mail() {
	const [sendMail, { isLoading }] = useSendMailMutation();
	const [formData, setFormData] = useState(initialState);

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSend = async (e) => {
		e.preventDefault();

		try {
			await sendMail(formData).unwrap();
			toast.success("Email sent successfully!");
			setFormData(initialState);
		} catch (error) {
			toast.error(`Email failure, ${error?.data?.message}`);
		}
	};

	if (isLoading) return <div className='mail'>Sending Email...</div>;

	return (
		<div className='mail'>
			<h1 className='mailTitle'>Send Mail</h1>

			<form className='mailForm' onSubmit={handleSend}>
				<div className='mailItem'>
					<label htmlFor='to'>To</label>
					<input
						type='email'
						name='to'
						id='to'
						value={formData.to}
						onChange={handleChange}
						placeholder='example@gmail.com'
						required
					/>
				</div>

				<div className='mailItem'>
					<label htmlFor='subject'>Subject</label>
					<input
						type='text'
						name='subject'
						id='subject'
						value={formData.subject}
						onChange={handleChange}
						placeholder='Enter subject'
						required
					/>
				</div>

				<div className='mailItem'>
					<label htmlFor='message'>Message</label>
					<textarea
						name='message'
						id='message'
						value={formData.message}
						onChange={handleChange}
						placeholder='Write your message...'
						rows={6}
						required
					/>
				</div>

				<button className='mailButton' type='submit' aria-label='send mail'>
					Send Mail
				</button>
			</form>
		</div>
	);
}
