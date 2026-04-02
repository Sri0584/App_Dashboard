import { Route, Routes } from "react-router-dom";
import Home from "../pages/home/Home";
import React, { Suspense } from "react";

const Login = React.lazy(() => import("../pages/login/Login"));
const Logout = React.lazy(() => import("../pages/logout/Logout"));
const Register = React.lazy(() => import("../pages/register/Register"));
const Mail = React.lazy(() => import("../pages/mail/Mail"));
const Product = React.lazy(() => import("../pages/products/Product"));
const ProductList = React.lazy(
	() => import("../pages/productList/ProductList"),
);
const UserList = React.lazy(() => import("../pages/userList/UserList"));
const User = React.lazy(() => import("../pages/user/User"));
const NewProduct = React.lazy(() => import("../pages/newProduct/NewProduct"));
const NewUser = React.lazy(() => import("../pages/newUser/NewUser"));

const RouteList = () => {
	return (
		<Suspense fallback={<div>Loading chart...</div>}>
			<Routes>
				<Route path='/' element={<Home />} />

				{/* USERS */}
				<Route path='/users' element={<UserList />} />
				<Route path='/user/:id' element={<User />} />
				<Route path='/newuser' element={<NewUser />} />

				{/* PRODUCTS */}
				<Route path='/products' element={<ProductList />} />
				<Route path='/product/:id' element={<Product />} />
				<Route path='/newproduct' element={<NewProduct />} />

				{/* AUTH */}
				<Route path='/login' element={<Login />} />
				<Route path='/logout' element={<Logout />} />
				<Route path='/register' element={<Register />} />
				{/* MAIL */}
				<Route path='/mail' element={<Mail />} />
			</Routes>
		</Suspense>
	);
};

export default RouteList;
