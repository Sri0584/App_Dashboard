import { loginSuccess } from "../authslice";
import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		// 🔐 LOGIN
		login: builder.mutation({
			query: (data) => ({
				url: "/auth/login",
				method: "POST",
				body: data,
			}),

			// ✅ HANDLE SIDE EFFECTS HERE
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;

					// ✅ store in redux
					dispatch(loginSuccess(data));

					// ✅ persist in localStorage
					localStorage.setItem("user", JSON.stringify(data));
				} catch (err) {
					console.log("Login failed:", err);
				}
			},
		}),

		// 🆕 REGISTER
		register: builder.mutation({
			query: (data) => ({
				url: "/auth/register",
				method: "POST",
				body: data,
			}),
		}),
		refreshToken: builder.mutation({
			query: () => ({
				url: "/auth/refresh",
				method: "POST",
				credentials: "include", // Include cookies with refresh token
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({}),
			}),
		}),
	}),
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useRefreshTokenMutation,
} = authApi;
