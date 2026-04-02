import { Link, useNavigate, useParams } from "react-router-dom";
import "./product.css";
import Publish from "@mui/icons-material/Publish";
import React, { Suspense, useEffect, useMemo, useState } from "react";

import { toast } from "react-toastify";
import {
	useGetProductByIdQuery,
	useUpdateProductMutation,
} from "../../redux/api/productApi";
import { useRefreshTokenMutation } from "../../redux/api/authApi";
import SalesInput from "../../components/salesInput/SalesInput";
import Category from "../../components/categories/Category";
const Chart = React.lazy(() => import("../../components/chart/Chart"));

export default function Product() {
	const { id } = useParams();
	const navigate = useNavigate();

	// ✅ Fetch product
	const { data: product, isLoading } = useGetProductByIdQuery(id, {
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	// ✅ Mutation
	const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
	const [refreshToken] = useRefreshTokenMutation();

	// ✅ Local form state
	const [formData, setFormData] = useState({
		title: "",
		img: "",
		price: "",
		inStock: "yes",
		active: "yes",
		sales: [],
		categories: [],
	});

	const salesData = useMemo(() => formData?.sales || [], [formData.sales]);

	useEffect(() => {
		if (product && !formData?.title) {
			setFormData({
				title: product.title || "",
				img: product.img || "",
				inStock: product.inStock ? "yes" : "no",
				active: product.active ? "yes" : "no",
				sales: product.sales || [],
				price: Number(product.price) || 0,
				categories:
					Array.isArray(product.categories) ? product.categories
					: product.categories ? [product.categories]
					: [],
			});
		}
	}, [formData?.title, product]);

	// ✅ Input handler
	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSalesChange = (updatedSales) => {
		setFormData((prev) => ({
			...prev,
			sales: updatedSales,
		}));
	};

	const handleCategoryChange = (e) => {
		const nextCategories =
			Array.isArray(e.target.value) ? e.target.value
			: e.target.value ? [e.target.value]
			: [];

		setFormData((prev) => ({
			...prev,
			categories: nextCategories,
		}));
	};

	// ✅ Submit update
	const handleSubmit = async (e) => {
		e.preventDefault();

		const updatePayload = {
			id,
			...formData,
			inStock: formData.inStock === "yes",
			active: formData.active === "yes",
			price: Number(formData.price) || 0,
			categories:
				Array.isArray(formData.categories) ? formData.categories
				: formData.categories ? [formData.categories]
				: [],
		};

		try {
			await updateProduct(updatePayload).unwrap();
			toast.success("Product updated!");
			navigate("/products");
		} catch (err) {
			// Handle token expiration
			if (err?.status === 401 && err?.data === "Invalid token!") {
				try {
					// Try to refresh the token
					await refreshToken().unwrap();

					// Retry the product update after token refresh
					await updateProduct(updatePayload).unwrap();
					toast.success("Product updated!");
					navigate("/products");
				} catch (refreshErr) {
					// Token refresh failed, redirect to login
					toast.error(
						`Session expired. Please login again. (${refreshErr?.data || refreshErr.message})`,
					);
					navigate("/login");
				}
			} else {
				toast.error(err?.data || "Update failed ❌");
			}
		}
	};

	if (isLoading || isUpdating) return <div>Loading...</div>;

	return (
		<div className='product'>
			{/* HEADER */}
			<div className='productTitleContainer'>
				<h1 className='productTitle'>Product</h1>
			</div>

			{/* TOP SECTION */}
			<div className='productTop'>
				{formData?.sales?.length > 0 && (
					<div className='productTopLeft'>
						<Suspense fallback={<div>Loading chart...</div>}>
							<Chart
								data={formData.sales}
								datakey='sales'
								title='Sales Performance'
								xDatakey='month'
								grid
							/>
						</Suspense>
					</div>
				)}

				<div className='productTopRight'>
					<div className='productInfoTop'>
						<img
							src={formData.img || "/placeholder.svg"}
							alt='Product information'
							className='productInfoImg'
							loading='lazy'
							width={100}
							height={100}
						/>
						<span className='productName'>{formData.title}</span>
					</div>

					<div className='productInfoBottom'>
						<div className='productInfoItem'>
							<span className='productInfoKey'>id:</span>
							<span className='productInfoValue'>{product?._id}</span>
						</div>

						<div className='productInfoItem'>
							<span className='productInfoKey'>sales:</span>
							<span className='productInfoValue'>
								{formData.sales.reduce((acc, item) => acc + item.sales, 0)}
							</span>
						</div>

						<div className='productInfoItem'>
							<span className='productInfoKey'>active:</span>
							<span className='productInfoValue'>{formData.active}</span>
						</div>

						<div className='productInfoItem'>
							<span className='productInfoKey'>in stock:</span>
							<span className='productInfoValue'>{formData.inStock}</span>
						</div>
					</div>
				</div>
			</div>

			{/* FORM */}
			<div className='productBottom'>
				<form className='productForm' onSubmit={handleSubmit}>
					<div className='productFormLeft'>
						{/* TITLE */}
						<label htmlFor='title'>Product Name</label>
						<input
							type='text'
							name='title'
							id='title'
							value={formData.title}
							onChange={handleChange}
						/>

						{/* IMAGE */}
						<label htmlFor='img'>Product Image</label>
						<input
							type='text'
							name='img'
							id='img'
							value={formData.img}
							onChange={handleChange}
						/>

						{/* SALES */}
						<SalesInput sales={salesData} onChange={handleSalesChange} />

						{/* CATEGORY */}
						<Category
							value={formData.categories}
							handleChange={handleCategoryChange}
						/>
						<label htmlFor='price'>Price</label>
						<input
							type='text'
							name='price'
							id='price'
							value={formData.price}
							onChange={handleChange}
						/>

						{/* STOCK */}
						<label htmlFor='inStock'>In Stock</label>
						<select
							name='inStock'
							id='inStock'
							value={formData.inStock}
							onChange={handleChange}
						>
							<option value='yes'>Yes</option>
							<option value='no'>No</option>
						</select>

						{/* ACTIVE */}
						<label htmlFor='active'>Active</label>
						<select
							name='active'
							id='active'
							value={formData.active}
							onChange={handleChange}
						>
							<option value='yes'>Yes</option>
							<option value='no'>No</option>
						</select>
					</div>

					{/* RIGHT SIDE */}
					<div className='productFormRight'>
						<div className='productUpload'>
							<img
								src={formData.img || "/placeholder.svg"}
								alt='Product Preview'
								className='productUploadImg'
								loading='lazy'
								width={100}
								height={100}
							/>

							<label htmlFor='file'>
								<Publish />
							</label>

							<input type='file' id='file' style={{ display: "none" }} />
						</div>

						<button
							className='productButton'
							disabled={isUpdating}
							aria-label='Update product'
						>
							{isUpdating ? "Updating Product..." : "Update Product"}
						</button>
					</div>
				</form>
			</div>

			<button className='productButton' onClick={() => navigate("/products")}>
				Back to Products
			</button>
		</div>
	);
}
