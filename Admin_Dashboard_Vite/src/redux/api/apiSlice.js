import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: "http://localhost:5000/api",
		credentials: "include", // Include cookies with all requests
		prepareHeaders: (headers, { getState }) => {
			const tok = JSON.parse(localStorage.getItem("user")) || {};

			const token = tok?.accessToken || getState()?.auth?.user?.accessToken;

			if (token) {
				headers.set("token", `Bearer ${token}`); // ✅ IMPORTANT
			}
			return headers;
		},
	}),
	tagTypes: ["Users", "Products"],
	endpoints: () => ({}),
});
