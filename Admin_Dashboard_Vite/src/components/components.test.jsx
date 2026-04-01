import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import authReducer from "../redux/authslice";
import Category from "./categories/Category";
import Chart from "./chart/Chart";
import FeaturedInfo from "./featuredInfo/FeaturedInfo";
import SalesInput from "./salesInput/SalesInput";
import Sidebar from "./sidebar/Sidebar";
import Topbar from "./topbar/Topbar";
import WidgetLg from "./widgetLg/WidgetLg";
import WidgetSm from "./widgetSm/WidgetSm";

const mocks = vi.hoisted(() => ({
	navigate: vi.fn(),
	socketOn: vi.fn(),
	socketOff: vi.fn(),
	useGetTransactionsQuery: vi.fn(),
	useGetUsersQuery: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => mocks.navigate,
	};
});

vi.mock("socket.io-client", () => ({
	io: () => ({
		on: mocks.socketOn,
		off: mocks.socketOff,
	}),
}));

vi.mock("../redux/api/transactionApi", () => ({
	useGetTransactionsQuery: mocks.useGetTransactionsQuery,
}));

vi.mock("../redux/api/userApi", () => ({
	useGetUsersQuery: mocks.useGetUsersQuery,
}));

vi.mock("recharts", () => ({
	ResponsiveContainer: ({ children }) => <div data-testid='chart-wrapper'>{children}</div>,
	LineChart: ({ children }) => <div data-testid='line-chart'>{children}</div>,
	Line: ({ dataKey }) => <div>Line {dataKey}</div>,
	XAxis: ({ dataKey }) => <div>XAxis {dataKey}</div>,
	YAxis: () => <div>YAxis</div>,
	Tooltip: () => <div>Tooltip</div>,
	CartesianGrid: () => <div>Grid</div>,
}));

const createStore = (preloadedState = {}) =>
	configureStore({
		reducer: { auth: authReducer },
		preloadedState: { auth: { user: null }, ...preloadedState },
	});

const renderWithProviders = (ui, preloadedState) =>
	render(
		<Provider store={createStore(preloadedState)}>
			<MemoryRouter>{ui}</MemoryRouter>
		</Provider>,
	);

beforeEach(() => {
	vi.clearAllMocks();
	mocks.useGetTransactionsQuery.mockReturnValue({
		data: [],
		isLoading: false,
	});
	mocks.useGetUsersQuery.mockReturnValue({
		data: [],
		isLoading: false,
		isError: false,
	});
});

describe("component coverage", () => {
	it("renders category options and forwards selection changes", async () => {
		const handleChange = vi.fn();
		renderWithProviders(<Category value='' handleChange={handleChange} />);

		fireEvent.mouseDown(screen.getByRole("combobox"));
		fireEvent.click(await screen.findByRole("option", { name: /gaming/i }));

		expect(handleChange).toHaveBeenCalled();
		expect(screen.getAllByText(/select category/i).length).toBeGreaterThan(0);
	});

	it("renders category in multi-select mode for existing product values", () => {
		renderWithProviders(
			<Category value={["electronics", "gaming"]} handleChange={vi.fn()} />,
		);

		expect(screen.getByRole("combobox")).toHaveTextContent("electronics, gaming");
	});

	it("renders chart with and without the optional grid", () => {
		const props = {
			title: "Monthly Sales",
			data: [{ month: "Jan", sales: 10 }],
			datakey: "sales",
			xDatakey: "month",
		};

		const { rerender } = renderWithProviders(<Chart {...props} />);
		expect(screen.queryByText("Grid")).not.toBeInTheDocument();

		rerender(
			<Provider store={createStore()}>
				<MemoryRouter>
					<Chart {...props} grid />
				</MemoryRouter>
			</Provider>,
		);

		expect(screen.getByText(/monthly sales/i)).toBeInTheDocument();
		expect(screen.getByText("Grid")).toBeInTheDocument();
	});

	it("renders featured info with positive and negative changes", () => {
		renderWithProviders(
			<FeaturedInfo
				users={5}
				sales={10}
				revenue={99}
				revenueChange={4}
				salesChange={-3}
				userChange={0}
			/>,
		);

		expect(screen.getByText("$99")).toBeInTheDocument();
		expect(screen.getByText("-3")).toBeInTheDocument();
		expect(screen.getAllByText(/compared to last month/i)).toHaveLength(3);
	});

	it("adds, edits, and removes sales rows", async () => {
		const onChange = vi.fn();
		renderWithProviders(
			<SalesInput sales={[{ month: "Jan", sales: 10 }]} onChange={onChange} />,
		);

		fireEvent.change(screen.getByRole("spinbutton", { name: /sales for jan/i }), {
			target: { value: "25" },
		});

		await waitFor(() =>
			expect(onChange).toHaveBeenCalledWith(
				[{ month: "Jan", sales: 25 }],
				"sales",
			),
		);

		fireEvent.change(screen.getAllByRole("combobox")[0], {
			target: { value: "Feb" },
		});
		await waitFor(() =>
			expect(onChange).toHaveBeenCalledWith(
				[{ month: "Feb", sales: 25 }],
				"sales",
			),
		);

		fireEvent.click(screen.getByRole("button", { name: /add monthly sales/i }));
		await waitFor(() =>
			expect(onChange).toHaveBeenCalledWith(
				[
					{ month: "Feb", sales: 25 },
					{ month: "Jan", sales: 0 },
				],
				"sales",
			),
		);
		expect(screen.getAllByRole("button", { name: /remove sales for/i })).toHaveLength(2);

		fireEvent.click(screen.getAllByRole("button", { name: /remove sales for jan/i })[0]);
		await waitFor(() =>
			expect(onChange).toHaveBeenCalledWith(
				[{ month: "Feb", sales: 25 }],
				"sales",
			),
		);
		expect(screen.getAllByRole("button", { name: /remove sales for/i })).toHaveLength(1);
	});

	it("renders the sidebar navigation groups", () => {
		renderWithProviders(<Sidebar />);
		expect(screen.getByRole("navigation")).toBeInTheDocument();
		expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
		expect(screen.getByText(/quick menu/i)).toBeInTheDocument();
	});

	it("renders topbar login state and navigates to login", () => {
		renderWithProviders(<Topbar />);
		fireEvent.click(screen.getByRole("button", { name: /login/i }));
		expect(mocks.navigate).toHaveBeenCalledWith("/login");
	});

	it("renders topbar user state and logs out", () => {
		renderWithProviders(<Topbar />, {
			auth: { user: { username: "Jane", profilePic: "" } },
		});

		expect(screen.getByText(/jane/i)).toBeInTheDocument();
		fireEvent.click(screen.getByRole("button", { name: /logout/i }));
		expect(mocks.navigate).toHaveBeenCalledWith("/login");
		expect(localStorage.removeItem).toHaveBeenCalledWith("user");
	});

	it("falls back to the user email in the topbar", () => {
		renderWithProviders(<Topbar />, {
			auth: { user: { email: "jane@example.com", profilePic: "" } },
		});
		expect(screen.getByText(/jane@example.com/i)).toBeInTheDocument();
	});

	it("renders widget transactions including socket updates and fallbacks", async () => {
		let newTransactionHandler;
		mocks.socketOn.mockImplementation((event, handler) => {
			if (event === "newTransaction") {
				newTransactionHandler = handler;
			}
		});
		mocks.useGetTransactionsQuery.mockReturnValue({
			data: [
				{
					_id: "1",
					customer: "",
					amount: 22,
					status: "",
					createdAt: "2025-01-01T00:00:00.000Z",
				},
			],
			isLoading: false,
		});

		renderWithProviders(<WidgetLg />);

		expect(screen.getByText(/latest transactions/i)).toBeInTheDocument();
		expect(screen.getByText(/unknown user/i)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /pending/i })).toBeInTheDocument();

		newTransactionHandler({
			_id: "2",
			customer: "Maria",
			amount: 44,
			status: "Approved",
			createdAt: "2025-01-02T00:00:00.000Z",
		});

		expect(await screen.findByText(/maria/i)).toBeInTheDocument();
	});

	it("renders widget transactions loading state", () => {
		mocks.useGetTransactionsQuery.mockReturnValue({
			data: [],
			isLoading: true,
		});
		renderWithProviders(<WidgetLg />);
		expect(screen.getByText(/loading transactions/i)).toBeInTheDocument();
	});

	it("renders widget users error, success, and loading states", () => {
		mocks.useGetUsersQuery
			.mockReturnValueOnce({
				data: [],
				isLoading: false,
				isError: true,
			})
			.mockReturnValueOnce({
				data: [
					{
						_id: "u1",
						username: "Chris",
						email: "chris@example.com",
						profilePic: "",
					},
				],
				isLoading: false,
				isError: false,
			})
			.mockReturnValueOnce({
				data: [],
				isLoading: true,
				isError: false,
			});

		const { rerender } = renderWithProviders(<WidgetSm />);
		expect(screen.getByText(/error loading users/i)).toBeInTheDocument();

		rerender(
			<Provider store={createStore()}>
				<MemoryRouter>
					<WidgetSm />
				</MemoryRouter>
			</Provider>,
		);
		expect(screen.getByText(/new join members/i)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /view chris's profile/i })).toBeInTheDocument();

		rerender(
			<Provider store={createStore()}>
				<MemoryRouter>
					<WidgetSm />
				</MemoryRouter>
			</Provider>,
		);
		expect(screen.getByText(/loading users/i)).toBeInTheDocument();
	});
});
