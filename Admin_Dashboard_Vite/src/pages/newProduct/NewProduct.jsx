import "./newProduct.css";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { object, string, number, array } from "yup";
import { toast } from "react-toastify";
import { useCreateProductMutation } from "../../redux/api/productApi";

const options = [
	"electronics",
	"shoes",
	"furniture",
	"fashion",
	"gaming",
	"fitness",
];
export default function NewProduct() {
	const navigate = useNavigate();
	const [createProduct, { isLoading }] = useCreateProductMutation();

	// ✅ validation schema
	const validationSchema = object({
		title: string().min(3, "Too short").required("Product title is required"),

		price: number()
			.typeError("Price must be a number")
			.positive("Must be positive")
			.required("Price is required"),

		inStock: string().required(),
		active: string().required(),
		img: string().required(),
		categories: array().min(1, "Select at least one category"),
	});

	// ✅ formik setup
	const formik = useFormik({
		initialValues: {
			title: "",
			price: "",
			inStock: "yes",
			active: "yes",
			img: "",
			categories: ["electronics"],
			sales: [],
		},

		validationSchema,

		onSubmit: async (values) => {
			try {
				const payload = {
					title: values.title,
					price: Number(values.price),
					inStock: values.inStock === "yes",
					active: values.active === "yes",
					img: values.img,
					categories: values.categories,
					sales: values.sales || [],
				};

				await createProduct(payload).unwrap();

				toast.success("✅ Product created successfully!");
				formik.resetForm();
				navigate("/products");
			} catch (err) {
				toast.error(err?.data?.message || "❌ Failed to create product");
			}
		},
	});

	if (isLoading) return <div className='newProduct'>Loading...</div>;

	return (
		<div className='newProduct'>
			<h1 className='addProductTitle'>New Product</h1>

			<form className='addProductForm' onSubmit={formik.handleSubmit}>
				{/* NAME */}
				<div className='addProductItem'>
					<label htmlFor='title'>Name</label>
					<input
						type='text'
						name='title'
						placeholder='Apple AirPods'
						id='title'
						{...formik.getFieldProps("title")}
					/>
					{formik.touched.title && formik.errors.title && (
						<span className='error' role='alert'>
							{formik.errors.title}
						</span>
					)}
				</div>
				<div className='addProductItem'>
					<label htmlFor='img'>Image</label>
					<input
						type='text'
						name='img'
						id='img'
						placeholder='https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=500&q=80&fm=webp'
						{...formik.getFieldProps("img")}
					/>
					{formik.touched.img && formik.errors.img && (
						<span className='error' role='alert'>
							{formik.errors.img}
						</span>
					)}
				</div>

				{/* PRICE */}
				<div className='addProductItem'>
					<label htmlFor='price'>Price</label>
					<input
						type='number'
						name='price'
						id='price'
						placeholder='999'
						{...formik.getFieldProps("price")}
					/>
					{formik.touched.price && formik.errors.price && (
						<span className='error' role='alert'>
							{formik.errors.price}
						</span>
					)}
				</div>

				{/* STOCK */}
				<div className='addProductItem'>
					<label htmlFor='inStock'>In Stock</label>
					<select {...formik.getFieldProps("inStock")} id='inStock'>
						<option value='yes'>Yes</option>
						<option value='no'>No</option>
					</select>
				</div>

				{/* ACTIVE */}
				<div className='addProductItem'>
					<label htmlFor='active'>Active</label>
					<select {...formik.getFieldProps("active")} id='active'>
						<option value='yes'>Yes</option>
						<option value='no'>No</option>
					</select>
				</div>
				<div className='addProductItem'>
					<label htmlFor='categories'>Category</label>
					<select
						value={formik.values.categories}
						onChange={(e) =>
							formik.setFieldValue(
								"categories",
								Array.from(e.target.selectedOptions, (opt) => opt.value),
							)
						}
						id='categories'
					>
						{options.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</div>

				{/* BUTTON */}
				<button
					className='addProductButton'
					type='submit'
					disabled={isLoading}
					aria-label='create product'
				>
					{isLoading ? "Creating..." : "Create"}
				</button>
			</form>
		</div>
	);
}
