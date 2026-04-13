const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const sendMail = require("./routes/mailRoutes.js");

const app = express();
const server = http.createServer(app);
// socket setup
const io = new Server(server, {
	cors: { origin: "*" },
});

app.use(express.json());
app.use(cors());
// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/mail", sendMail);
// ✅ make io accessible in routes
app.set("io", io);

// ✅ socket connection

io.on("connection", (socket) => {
	console.log("user connected");

	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});

// simulate real-time transactions
setInterval(() => {
	io.emit("newTransaction", {
		id: Date.now(),
		customer: "Live User",
		amount: Math.floor(Math.random() * 1000),
		status: ["Approved", "Pending", "Declined"][Math.floor(Math.random() * 3)],
		createdAt: new Date(),
	});
}, 5000);
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
	server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
