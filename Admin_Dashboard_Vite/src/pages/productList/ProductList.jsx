import "./productList.css";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import {
	useDeleteProductMutation,
	useGetProductsQuery,
} from "../../redux/api/productApi";
import { toast } from "react-toastify";

const ProductList = () => {
	// ✅ Fetch products
	const { data: products = [], isLoading } = useGetProductsQuery(undefined, {
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	// ✅ Delete mutation
	const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

	// ✅ Transform backend → table rows (NO useState/useEffect)
	const rows = products.map((product) => ({
		id: product._id,
		name: product.name,
		stock: product.inStock ? "Yes" : "No",
		status: product.active ? "Active" : "Inactive",
		price: product.price || 0,
		title: product.title,
		img:
			product.img ||
			"https://images.pexels.com/photos/7156886/pexels-photo-7156886.jpeg",
	}));

	// ✅ Delete handler
	const handleDelete = async (id) => {
		try {
			await deleteProduct(id).unwrap();
			toast.success("Product deleted!");
		} catch (err) {
			toast.error(err?.data || "Delete failed ❌");
		}
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 200 },

		{
			field: "name",
			headerName: "Product",
			width: 220,
			renderCell: (params) => (
				<div className='productListItem'>
					<img
						className='productListImg'
						src={params.row.img}
						alt='Product Image'
						loading='lazy'
						width={100}
						height={100}
					/>
					{params.row.title}
				</div>
			),
		},

		{
			field: "price",
			headerName: "Price",
			width: 120,
		},

		{
			field: "stock",
			headerName: "In Stock",
			width: 120,
		},

		{
			field: "status",
			headerName: "Status",
			width: 120,
		},

		{
			field: "action",
			headerName: "Action",
			width: 160,
			renderCell: (params) => (
				<>
					<Link to={"/product/" + params.row.id}>
						<button className='productListEdit' aria-label='Edit product'>
							Edit
						</button>
					</Link>

					<DeleteOutline
						className='productListDelete'
						aria-label='Delete product'
						onClick={() => handleDelete(params.row.id)}
					/>
				</>
			),
		},
	];

	if (isLoading || isDeleting)
		return <div className='productList'>Loading...</div>;

	return (
		<div className='productList'>
			<Link to='/newproduct'>
				<button className='productAddButton' aria-label='Add product'>
					Add Product
				</button>
			</Link>
			<DataGrid
				rows={rows}
				columns={columns}
				pageSize={10}
				rowsPerPageOptions={[10]}
				checkboxSelection
				disableSelectionOnClick
			/>
		</div>
	);
};

export default ProductList;
