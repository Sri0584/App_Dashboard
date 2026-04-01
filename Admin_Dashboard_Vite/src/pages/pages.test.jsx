import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import authReducer from "../redux/authslice";
import Home from "./home/Home";
import Login from "./login/Login";
import Mail from "./mail/Mail";
import NewProduct from "./newProduct/NewProduct";
import NewUser from "./newUser/NewUser";
import ProductList from "./productList/ProductList";
import Product from "./products/Product";
import Register from "./register/Register";
import UserList from "./userList/UserList";

const mocks = vi.hoisted(() => ({
	navigate: vi.fn(),
	toastSuccess: vi.fn(),
	toastError: vi.fn(),
	loginMutation: vi.fn(),
	loginLoading: false,
	registerMutation: vi.fn(),
	registerLoading: false,
	sendMailMutation: vi.fn(),
	mailLoading: false,
	createProductMutation: vi.fn(),
	createProductLoading: false,
	getProductsQuery: vi.fn(),
	deleteProductMutation: vi.fn(),
	getProductByIdQuery: vi.fn(),
	updateProductMutation: vi.fn(),
	createUserMutation: vi.fn(),
	createUserLoading: false,
	getUsersQuery: vi.fn(),
	deleteUserMutation: vi.fn(),
	getAnalyticsQuery: vi.fn(),
	getUserStatsQuery: vi.fn(),
}));

vi.mock("react-toastify", () => ({
	toast: {
		success: mocks.toastSuccess,
		error: mocks.toastError,
	},
}));

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => mocks.navigate,
	};
});

vi.mock("@mui/x-data-grid", () => ({
	DataGrid: ({ rows = [], columns = [] }) => (
		<div data-testid='data-grid'>
			{columns.map((column) => (
				<div key={column.field}>{column.headerName}</div>
			))}
			{rows.map((row) => (
				<div key={row.id}>
					{columns.map((column) => (
						<div key={column.field}>
							{column.renderCell ?
								column.renderCell({ row, value: row[column.field] })
							:	String(row[column.field] ?? "")}
						</div>
					))}
				</div>
			))}
		</div>
	),
}));

vi.mock("@mui/icons-material/DeleteOutline", () => ({
	default: (props) => <button type='button' {...props}>Delete</button>,
}));

vi.mock("@mui/icons-material/Publish", () => ({
	default: () => <span>Publish</span>,
}));

vi.mock("../components/chart/Chart", () => ({
	default: () => <div>Sales Performance Chart</div>,
}));

vi.mock("../redux/api/authApi", () => ({
	useLoginMutation: () => [mocks.loginMutation, { isLoading: mocks.loginLoading }],
	useRegisterMutation: () => [
		mocks.registerMutation,
		{ isLoading: mocks.registerLoading },
	],
}));

vi.mock("../redux/api/mailApi", () => ({
	useSendMailMutation: () => [mocks.sendMailMutation, { isLoading: mocks.mailLoading }],
}));

vi.mock("../redux/api/productApi", () => ({
	useCreateProductMutation: () => [
		mocks.createProductMutation,
		{ isLoading: mocks.createProductLoading },
	],
	useGetProductsQuery: (...args) => mocks.getProductsQuery(...args),
	useDeleteProductMutation: () => [mocks.deleteProductMutation, { isLoading: false }],
	useGetProductByIdQuery: (...args) => mocks.getProductByIdQuery(...args),
	useUpdateProductMutation: () => [mocks.updateProductMutation, { isLoading: false }],
}));

vi.mock("../redux/api/userApi", () => ({
	useCreateUserMutation: () => [
		mocks.createUserMutation,
		{ isLoading: mocks.createUserLoading },
	],
	useGetUsersQuery: (...args) => mocks.getUsersQuery(...args),
	useDeleteUserMutation: () => [mocks.deleteUserMutation, { isLoading: false }],
}));

vi.mock("../redux/api/analyticsApi", () => ({
	useGetAnalyticsQuery: (...args) => mocks.getAnalyticsQuery(...args),
	useGetUserStatsQuery: (...args) => mocks.getUserStatsQuery(...args),
}));

const createStore = () =>
	configureStore({
		reducer: { auth: authReducer },
		preloadedState: { auth: { user: null } },
	});

const renderWithProviders = (ui, options = {}) =>
	render(
		<Provider store={createStore()}>
			<MemoryRouter initialEntries={options.initialEntries || ["/"]}>{ui}</MemoryRouter>
		</Provider>,
	);

beforeEach(() => {
	vi.clearAllMocks();
	mocks.loginLoading = false;
	mocks.registerLoading = false;
	mocks.mailLoading = false;
	mocks.createProductLoading = false;
	mocks.createUserLoading = false;
	mocks.loginMutation.mockReturnValue({ unwrap: () => Promise.resolve({}) });
	mocks.registerMutation.mockReturnValue({ unwrap: () => Promise.resolve({}) });
	mocks.sendMailMutation.mockReturnValue({ unwrap: () => Promise.resolve({}) });
	mocks.createProductMutation.mockReturnValue({ unwrap: () => Promise.resolve({}) });
	mocks.deleteProductMutation.mockReturnValue({ unwrap: () => Promise.resolve({}) });
	mocks.getProductsQuery.mockReturnValue({ data: [], isLoading: false });
	mocks.getProductByIdQuery.mockReturnValue({ data: null, isLoading: true });
	mocks.updateProductMutation.mockReturnValue({ unwrap: () => Promise.resolve({}) });
	mocks.createUserMutation.mockReturnValue({ unwrap: () => Promise.resolve({}) });
	mocks.getUsersQuery.mockReturnValue({ data: [], isLoading: false });
	mocks.deleteUserMutation.mockReturnValue({ unwrap: () => Promise.resolve({}) });
	mocks.getAnalyticsQuery.mockReturnValue({
		data: {
			users: 10,
			sales: 20,
			revenue: 30,
			revenueChange: 2,
			salesChange: -1,
			userChange: 4,
		},
		isLoading: false,
	});
	mocks.getUserStatsQuery.mockReturnValue({
		data: [{ name: "Jan", users: 8 }],
		isLoading: false,
	});
});

describe("page coverage", () => {
	it("renders home dashboard", () => {
		renderWithProviders(<Home />);
		expect(screen.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument();
	});

	it("submits login successfully", async () => {
		renderWithProviders(<Login />);

		fireEvent.change(screen.getByPlaceholderText(/email/i), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByPlaceholderText(/password/i), {
			target: { value: "secret" },
		});
		fireEvent.click(screen.getByRole("button", { name: /^login$/i }));

		await waitFor(() =>
			expect(mocks.loginMutation).toHaveBeenCalledWith({
				email: "test@example.com",
				password: "secret",
			}),
		);
		expect(mocks.toastSuccess).toHaveBeenCalled();
		expect(mocks.navigate).toHaveBeenCalledWith("/");
	});

	it("renders login loading state", () => {
		mocks.loginLoading = true;
		renderWithProviders(<Login />);
		expect(screen.getByText(/loading/i)).toBeInTheDocument();
	});

	it("handles login failures", async () => {
		mocks.loginMutation.mockReturnValue({
			unwrap: () => Promise.reject({ data: "bad credentials" }),
		});
		renderWithProviders(<Login />);
		fireEvent.change(screen.getByPlaceholderText(/email/i), {
			target: { value: "oops@example.com" },
		});
		fireEvent.change(screen.getByPlaceholderText(/password/i), {
			target: { value: "wrong" },
		});
		fireEvent.click(screen.getByRole("button", { name: /^login$/i }));

		await waitFor(() => expect(mocks.loginMutation).toHaveBeenCalled());
		expect(mocks.navigate).toHaveBeenCalledWith("/register");
	}, 10000);

	it("submits register successfully and navigates through the login link", async () => {
		renderWithProviders(<Register />);

		fireEvent.change(screen.getByPlaceholderText(/username/i), {
			target: { value: "tester" },
		});
		fireEvent.change(screen.getByPlaceholderText(/email/i), {
			target: { value: "tester@example.com" },
		});
		fireEvent.change(screen.getByPlaceholderText(/password/i), {
			target: { value: "123456" },
		});
		fireEvent.click(screen.getByRole("button", { name: /register/i }));

		await waitFor(() => expect(mocks.registerMutation).toHaveBeenCalled());
		expect(mocks.toastSuccess).toHaveBeenCalled();
		expect(mocks.navigate).toHaveBeenCalledWith("/login");

		mocks.navigate.mockClear();
		fireEvent.click(screen.getByText(/^login$/i));
		expect(mocks.navigate).toHaveBeenCalledWith("/login");
	});

	it("handles register errors", async () => {
		renderWithProviders(<Register />);

		fireEvent.change(screen.getByPlaceholderText(/username/i), {
			target: { value: "tester" },
		});
		fireEvent.change(screen.getByPlaceholderText(/email/i), {
			target: { value: "tester@example.com" },
		});
		fireEvent.change(screen.getByPlaceholderText(/password/i), {
			target: { value: "123456" },
		});

		const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
		mocks.registerMutation.mockReturnValueOnce({
			unwrap: () => Promise.reject({ data: "duplicate user" }),
		});
		fireEvent.click(screen.getByRole("button", { name: /register/i }));
		await waitFor(() => expect(mocks.toastError).toHaveBeenCalled());
		consoleError.mockRestore();
	}, 10000);

	it("renders register loading state", () => {
		mocks.registerLoading = true;
		renderWithProviders(<Register />);
		expect(screen.getByText(/loading/i)).toBeInTheDocument();
	});

	it("submits mail successfully and handles failures", async () => {
		const { rerender } = renderWithProviders(<Mail />);

		fireEvent.change(screen.getByPlaceholderText(/example@gmail.com/i), {
			target: { value: "mail@example.com" },
		});
		fireEvent.change(screen.getByPlaceholderText(/enter subject/i), {
			target: { value: "Subject" },
		});
		fireEvent.change(screen.getByPlaceholderText(/write your message/i), {
			target: { value: "Hello there" },
		});
		fireEvent.click(screen.getByRole("button", { name: /send mail/i }));

		await waitFor(() => expect(mocks.sendMailMutation).toHaveBeenCalled());
		expect(mocks.toastSuccess).toHaveBeenCalled();
		expect(screen.getByPlaceholderText(/example@gmail.com/i)).toHaveValue("");

		mocks.sendMailMutation.mockReturnValueOnce({
			unwrap: () => Promise.reject({ data: { message: "smtp down" } }),
		});
		rerender(
			<Provider store={createStore()}>
				<MemoryRouter>
					<Mail />
				</MemoryRouter>
			</Provider>,
		);
		fireEvent.change(screen.getByPlaceholderText(/example@gmail.com/i), {
			target: { value: "mail@example.com" },
		});
		fireEvent.change(screen.getByPlaceholderText(/enter subject/i), {
			target: { value: "Subject" },
		});
		fireEvent.change(screen.getByPlaceholderText(/write your message/i), {
			target: { value: "Hello there" },
		});
		fireEvent.click(screen.getByRole("button", { name: /send mail/i }));

		await waitFor(() => expect(mocks.toastError).toHaveBeenCalled());
	});

	it("renders mail loading state", () => {
		mocks.mailLoading = true;
		renderWithProviders(<Mail />);
		expect(screen.getByText(/sending email/i)).toBeInTheDocument();
	});

	it("creates products and validates form input", async () => {
		renderWithProviders(<NewProduct />);

		fireEvent.blur(screen.getByLabelText(/name/i));
		fireEvent.blur(screen.getByLabelText(/image/i));
		fireEvent.blur(screen.getByLabelText(/price/i));
		fireEvent.click(screen.getByRole("button", { name: /create product/i }));
		expect(await screen.findAllByRole("alert")).not.toHaveLength(0);

		fireEvent.change(screen.getByLabelText(/name/i), {
			target: { value: "AirPods Max" },
		});
		fireEvent.change(screen.getByLabelText(/image/i), {
			target: { value: "https://img.test/product.png" },
		});
		fireEvent.change(screen.getByLabelText(/price/i), {
			target: { value: "199" },
		});
		fireEvent.change(screen.getByLabelText(/in stock/i), {
			target: { value: "no" },
		});
		fireEvent.change(screen.getByLabelText(/^active$/i), {
			target: { value: "no" },
		});
		const categorySelect = screen.getByLabelText(/category/i);
		Object.defineProperty(categorySelect, "selectedOptions", {
			configurable: true,
			value: [{ value: "electronics" }, { value: "gaming" }],
		});
		fireEvent.change(categorySelect);
		fireEvent.click(screen.getByRole("button", { name: /create product/i }));

		await waitFor(() =>
			expect(mocks.createProductMutation).toHaveBeenCalledWith({
				title: "AirPods Max",
				price: 199,
				inStock: false,
				active: false,
				img: "https://img.test/product.png",
				categories: ["electronics", "gaming"],
				sales: [],
			}),
		);
		expect(mocks.toastSuccess).toHaveBeenCalled();
		expect(mocks.navigate).toHaveBeenCalledWith("/products");
	});

	it("handles product creation failures", async () => {
		mocks.createProductMutation.mockReturnValue({
			unwrap: () => Promise.reject({ data: { message: "save failed" } }),
		});
		renderWithProviders(<NewProduct />);

		fireEvent.change(screen.getByLabelText(/name/i), {
			target: { value: "AirPods Max" },
		});
		fireEvent.change(screen.getByLabelText(/image/i), {
			target: { value: "https://img.test/product.png" },
		});
		fireEvent.change(screen.getByLabelText(/price/i), {
			target: { value: "199" },
		});
		fireEvent.click(screen.getByRole("button", { name: /create product/i }));

		await waitFor(() => expect(mocks.createProductMutation).toHaveBeenCalled());
		expect(mocks.toastError).toHaveBeenCalled();
	});

	it("renders new product loading state", () => {
		mocks.createProductLoading = true;
		renderWithProviders(<NewProduct />);
		expect(screen.getByText(/loading/i)).toBeInTheDocument();
	});

	it("creates users with validation and error handling", async () => {
		renderWithProviders(<NewUser />);

		fireEvent.click(screen.getByRole("button", { name: /create new user/i }));
		expect(await screen.findByRole("alert")).toBeInTheDocument();

		fireEvent.change(screen.getByPlaceholderText(/john$/i), {
			target: { value: "johnny" },
		});
		fireEvent.change(screen.getByPlaceholderText(/john smith/i), {
			target: { value: "John Smith" },
		});
		fireEvent.change(screen.getByPlaceholderText(/john@gmail.com/i), {
			target: { value: "john@example.com" },
		});
		fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
			target: { value: "secret12" },
		});
		fireEvent.change(screen.getByPlaceholderText(/\+1 123 456 78/i), {
			target: { value: "+1 555 555 55" },
		});
		fireEvent.change(screen.getByPlaceholderText(/new york/i), {
			target: { value: "Boston" },
		});
		fireEvent.click(screen.getByLabelText(/female/i));
		fireEvent.change(screen.getByLabelText(/^active$/i), {
			target: { value: "no" },
		});
		fireEvent.click(screen.getByRole("button", { name: /create new user/i }));

		await waitFor(() => expect(mocks.createUserMutation).toHaveBeenCalled());
		expect(mocks.toastSuccess).toHaveBeenCalled();
		expect(mocks.navigate).toHaveBeenCalledWith("/users");

		mocks.createUserMutation.mockReturnValueOnce({
			unwrap: () => Promise.reject({ data: { message: "bad user" } }),
		});
		fireEvent.change(screen.getByPlaceholderText(/john$/i), {
			target: { value: "johnny" },
		});
		fireEvent.change(screen.getByPlaceholderText(/john smith/i), {
			target: { value: "John Smith" },
		});
		fireEvent.change(screen.getByPlaceholderText(/john@gmail.com/i), {
			target: { value: "john@example.com" },
		});
		fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
			target: { value: "secret12" },
		});
		fireEvent.change(screen.getByPlaceholderText(/\+1 123 456 78/i), {
			target: { value: "+1 555 555 55" },
		});
		fireEvent.click(screen.getByRole("button", { name: /create new user/i }));
		await waitFor(() => expect(mocks.toastError).toHaveBeenCalled());
	});

	it("renders new user loading state", () => {
		mocks.createUserLoading = true;
		renderWithProviders(<NewUser />);
		expect(screen.getByText(/loading/i)).toBeInTheDocument();
	});

	it("renders product list rows and handles delete outcomes", async () => {
		const product = {
			_id: "p1",
			name: "Headphones",
			title: "Headphones",
			inStock: true,
			active: false,
			price: 49,
			img: "",
		};
		mocks.getProductsQuery.mockReturnValue({
			data: [product],
			isLoading: false,
		});

		const { rerender } = renderWithProviders(<ProductList />);
		expect(screen.getByText(/headphones/i)).toBeInTheDocument();
		expect(screen.getByText(/inactive/i)).toBeInTheDocument();
		fireEvent.click(screen.getByRole("button", { name: /delete product/i }));
		await waitFor(() => expect(mocks.deleteProductMutation).toHaveBeenCalledWith("p1"));
		expect(mocks.toastSuccess).toHaveBeenCalled();

		mocks.deleteProductMutation.mockReturnValueOnce({
			unwrap: () => Promise.reject({ data: "failed" }),
		});
		rerender(
			<Provider store={createStore()}>
				<MemoryRouter>
					<ProductList />
				</MemoryRouter>
			</Provider>,
		);
		fireEvent.click(screen.getByRole("button", { name: /delete product/i }));
		await waitFor(() => expect(mocks.toastError).toHaveBeenCalled());
	});

	it("renders user list rows and handles delete outcomes", async () => {
		const user = {
			_id: "u1",
			username: "Alicia",
			email: "alicia@example.com",
			isActive: true,
			transactions: "$22",
			avatar: "",
		};
		mocks.getUsersQuery.mockReturnValue({
			data: [user],
			isLoading: false,
		});

		const { rerender } = renderWithProviders(<UserList />);
		expect(screen.getByText(/\$22/i)).toBeInTheDocument();
		expect(screen.getByText(/\$22/i)).toBeInTheDocument();
		fireEvent.click(screen.getByRole("button", { name: /delete user/i }));
		await waitFor(() => expect(mocks.deleteUserMutation).toHaveBeenCalledWith("u1"));
		expect(mocks.toastSuccess).toHaveBeenCalled();

		mocks.deleteUserMutation.mockReturnValueOnce({
			unwrap: () => Promise.reject("boom"),
		});
		rerender(
			<Provider store={createStore()}>
				<MemoryRouter>
					<UserList />
				</MemoryRouter>
			</Provider>,
		);
		fireEvent.click(screen.getByRole("button", { name: /delete user/i }));
		await waitFor(() => expect(mocks.toastError).toHaveBeenCalled());
	});

	it("shows list loading states", () => {
		mocks.getProductsQuery.mockReturnValue({
			data: [],
			isLoading: true,
		});
		mocks.getUsersQuery.mockReturnValue({
			data: [],
			isLoading: true,
		});

		const { rerender } = renderWithProviders(<ProductList />);
		expect(screen.getByText(/loading/i)).toBeInTheDocument();

		rerender(
			<Provider store={createStore()}>
				<MemoryRouter>
					<UserList />
				</MemoryRouter>
			</Provider>,
		);
		expect(screen.getByText(/loading/i)).toBeInTheDocument();
	});

	it("renders product loading, populated, and error update states", async () => {
		const product = {
			_id: "prod-1",
			title: "Console",
			img: "",
			inStock: true,
			active: false,
			sales: [{ month: "Jan", sales: 7 }],
			categories: ["gaming"],
		};

		const { rerender } = renderWithProviders(
			<Routes>
				<Route path='/product/:id' element={<Product />} />
			</Routes>,
			{ initialEntries: ["/product/prod-1"] },
		);
		expect(screen.getByText(/loading/i)).toBeInTheDocument();

		mocks.getProductByIdQuery.mockReturnValue({
			data: product,
			isLoading: false,
		});
		rerender(
			<Provider store={createStore()}>
				<MemoryRouter initialEntries={["/product/prod-1"]}>
					<Routes>
						<Route path='/product/:id' element={<Product />} />
					</Routes>
				</MemoryRouter>
			</Provider>,
		);

		expect(await screen.findByText(/sales performance chart/i)).toBeInTheDocument();
		expect(screen.getByText(/prod-1/i)).toBeInTheDocument();

		fireEvent.change(screen.getByLabelText(/product name/i), {
			target: { value: "Updated Console" },
		});
		fireEvent.change(screen.getByLabelText(/product image/i), {
			target: { value: "https://img.test/console.png" },
		});
		fireEvent.change(screen.getByLabelText(/in stock/i), {
			target: { value: "no" },
		});
		fireEvent.change(screen.getByLabelText(/^active$/i), {
			target: { value: "yes" },
		});
		fireEvent.change(screen.getByRole("spinbutton", { name: /sales for jan/i }), {
			target: { value: "10" },
		});
		fireEvent.click(screen.getByRole("button", { name: /add monthly sales/i }));
		fireEvent.change(screen.getAllByRole("combobox")[0], {
			target: { value: "Feb" },
		});
		fireEvent.mouseDown(screen.getByRole("combobox", { expanded: false }));
		fireEvent.click(await screen.findByRole("option", { name: /fitness/i }));
		fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });
		fireEvent.click(
			screen.getByRole("button", { name: /update product/i, hidden: true }),
		);

		await waitFor(() =>
			expect(mocks.updateProductMutation).toHaveBeenCalledWith(
				expect.objectContaining({
					id: "prod-1",
					title: "Updated Console",
					inStock: false,
					active: true,
					sales: [
						{ month: "Feb", sales: 10 },
						{ month: "Jan", sales: 0 },
					],
					categories: ["gaming", "fitness"],
				}),
			),
		);
		expect(mocks.toastSuccess).toHaveBeenCalled();
		expect(mocks.navigate).toHaveBeenCalledWith("/products");

		mocks.updateProductMutation.mockReturnValueOnce({
			unwrap: () => Promise.reject({ data: "bad update" }),
		});
		fireEvent.click(screen.getByRole("button", { name: /update product/i }));
		await waitFor(() => expect(mocks.toastError).toHaveBeenCalled());
	});
});
