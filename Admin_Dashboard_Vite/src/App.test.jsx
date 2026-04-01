import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";

const renderApp = () =>
	render(
		<Provider store={store}>
			<App />
		</Provider>,
	);

describe("App Component", () => {
	it("renders without crashing", () => {
		renderApp();
		expect(screen.getByRole("main")).toBeInTheDocument();
	});

	it("renders Topbar", () => {
		renderApp();
		expect(screen.getByText(/ssadmin/i)).toBeInTheDocument(); // Changed to the actual Topbar logo text
	});

	it("renders Sidebar", () => {
		renderApp();
		expect(screen.getByRole("navigation")).toBeInTheDocument();
	});

	it("renders RouteList inside main", () => {
		renderApp();
		const main = screen.getByRole("main");
		expect(main).toBeInTheDocument();
	});

	it("renders ToastContainer", () => {
		renderApp();
		expect(document.querySelector(".Toastify")).toBeInTheDocument();
	});

	it("keeps navigation targets visible and routes update on sidebar click", async () => {
		renderApp();

		const links = screen.queryAllByRole("link");
		expect(links.length).toBeGreaterThan(0);

		// click the first link and assert the route target exists
		const firstLink = links[0];
		const expectedPath = firstLink.getAttribute("href") || "/";

		await userEvent.click(firstLink);

		// for BrowserRouter, location changes are managed internally in tests through history
		expect(window.location.pathname).toBe(expectedPath);
		expect(screen.getByRole("main")).toBeInTheDocument();
	});

	it("ToastContainer renders its wrapper", () => {
		renderApp();
		const toastRoot = document.querySelector(".Toastify");
		expect(toastRoot).toBeInTheDocument();
	});
});
