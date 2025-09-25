
# Vendor DashBoard Backend

A full-stack food delivery web application inspired by Swiggy, built using MERN stack (MongoDB, Express, React, Node.js). Vendors can manage restaurants and products, and users can browse restaurant menus.


## 🌐 Live Demo

Frontend (Vercel): https://vendor-dashboard-frontend-five.vercel.app/

Backend (Render): https://sample-swiggy-clone.onrender.com
## Tech Stack

***Frontend:*** 
React.js, Vite, CSS

***Backend:***
Node.js, Express.js, MongoDB

***Dev Tools:***
VS Code, Postman, Git/GitHub

## Installation

Install my-project with npm

```bash
git clone <repo-url>
cd Vendor_Dashboard_Backend (go inside your file)
npm install 
```
- with **npm install** (required packages will be installed used in this project)    
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

- Create a .env file:

`MONGO_URI` : your_mongodb_connection_string

`JWT_SECRET` : your_secret_key

`PORT` : your_port_no


## Start server:

Run the following command

```bash
  npm run dev
```
- As per in the scripts
## Features

## Vendor Panel

* Vendor registration and login (JWT authentication)

* Add and manage firms/restaurants

* Add and manage products/dishes

* Upload images for products and firms

* Delete products or firms

* View all products linked to a firm


## API Endpoints :

### Vendor

| Method | Endpoint         | Description        |
| ------ | ---------------- | ------------------ |
| POST   | /vendor/register | Register vendor    |
| POST   | /vendor/login    | Vendor login       |
| GET    | /vendor/:id      | Get vendor details |

### Firm

| Method | Endpoint             | Description               |
| ------ | -------------------- | ------------------------- |
| POST   | /firm/add-firm       | Add a firm (JWT required) |
| DELETE | /firm/delete/:firmId | Delete a firm             |

### Product

| Method | Endpoint                           | Description                |
| ------ | ---------------------------------- | -------------------------- |
| POST   | /product/add-product/:firmId       | Add product to a firm      |
| GET    | /product/:firmId/products          | Get all products of a firm |
| DELETE | /product/delete-product/:productId | Delete a product           |

---



## Folder Structure

### Backend

backend/
├─ controllers/
├─ models/
├─ routes/
├─ uploads/
├─ middleware/
└─ index.js/

#

├─ controllers/

    -->vendorController.js
    -->firmController.js 
    -->productController.js

├─ models/

    --> Vendor.js
    --> Firm.js
    --> Product.js

├─ routes/

    --> vendorRoutes.js
    --> firmRoutes.js
    --> productRoutes.js

├─ uploads/

├─ middleware/

    -->verifyToken.js

└─ index.js (main file)

└─ .env

    
