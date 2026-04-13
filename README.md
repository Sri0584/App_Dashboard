A full-stack Admin Dashboard application built with modern technologies, featuring user management, product management, authentication, real-time updates, and email functionality.

🔐 Authentication (JWT-based login/register)
👥 User Management (CRUD)
📦 Product Management (CRUD + sales data)
📊 Charts & Analytics (Recharts)
📧 Email Sending (Nodemailer)
⚡ Real-time updates (Socket.IO)
🎨 Modern UI (React + MUI)
☁️ Deployed on Azure

Frontend (Admin_Dashboard_Vite)
⚛️ React
⚡ Vite
🎨 Material UI
📊 Recharts
🧠 Redux Toolkit
🔄 RTK Query
📝 Formik + Yup

Backend (Backend_Dashboard)
🟢 Node.js
🚂 Express.js
🍃 MongoDB + Mongoose
🔐 JSON Web Token
📧 Nodemailer
🔌 Socket.IO

🔹 Backend → Azure App Service
Create Web App in Microsoft Azure
Runtime: Node.js (18+)
Deploy via GitHub Actions
Set environment variables in Azure
Ensure startup command:
npm start

Backend URL:

https://your-backend.azurewebsites.net

🔹 Frontend → Azure Static Web Apps
Create Static Web App in Azure
Connect GitHub repo
Configure:
App location: Admin_Dashboard_Vite
Output location: dist

https://portal.azure.com/#create/Microsoft.WebSite
Front end url: https://orange-smoke-016ceda03.7.azurestaticapps.net/
Back end url: https://app-dashboard-api-c4gvdch3fvgcgtcz.westeurope-01.azurewebsites.net/
Issue	Fix
403 Web App stopped	Start App Service in Azure
Not authenticated	Send JWT token in headers
MIME type CSS error	Fix staticwebapp.config.json
Socket.IO fails	Use HTTPS + enable WebSockets
MongoDB error	Check Atlas IP whitelist
📈 Performance Optimizations
Code splitting (React.lazy)
Bundle optimization (manualChunks)
Lazy loading images
Deferred chart rendering
🏁 Future Improvements
Role-based access control
Dashboard analytics enhancements
File/image uploads (Azure Blob)
Notifications system
Author : Srilatha Danalakota
