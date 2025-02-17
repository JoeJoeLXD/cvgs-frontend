# Conestoga Virtual Game Store

## About the Project

The **Conestoga Virtual Game Store (CVGS)** is an online gaming marketplace where users can browse, purchase, and manage games. It provides personalized game recommendations, an engaging shopping experience, and exclusive access to the **CVGS Insiders Club**.

This project consists of a **React frontend** and an **ASP.NET Core backend** with a **Microsoft SQL Server database**.

## Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repositories

```sh
# Clone the backend
git clone https://github.com/JoeJoeLXD/cvgs-backend.git
cd cvgs-backend

# Clone the frontend
git clone https://github.com/JoeJoeLXD/cvgs-frontend.git
cd cvgs-frontend
```

### 2. Install Dependencies

#### Frontend

```sh
cd cvgs-frontend
npm install
```

#### Backend

```sh
cd ../cvgs-backend
dotnet restore
```

### 3. Setup Database

Ensure you have **Microsoft SQL Server** installed and running. Then:

1. Open **SQL Server Management Studio (SSMS)** and execute:

```sql
CREATE DATABASE CVGS;
```

2. Apply migrations:

```sh
cd ../cvgs-backend
dotnet ef database update
```

### 4. Run the Application

#### Start Frontend

```sh
cd ../cvgs-frontend
npm start
```

#### Start Backend

```sh
cd ../cvgs-backend
dotnet run
```

The application should now be running at:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:7245`

## Deployment Instructions

### Backend Deployment (IIS)

1. Publish the application:

```sh
dotnet publish -c Release -o ./publish
```

2. Copy the contents of `publish` to the IIS server and configure it as a new site.

### Frontend Deployment

1. Build the React application:

```sh
npm run build
```

2. Copy the contents of `build` to the web server and configure IIS.

## License

This project is licensed under the **MIT License**. We chose MIT because it allows flexibility for others to use, modify, and distribute our code while keeping attribution to the original authors.

## Issue Tracker

We are currently tracking issues in the repository. An example issue:

- **Enhancement:** Improve UI responsiveness for mobile devices.

## Wiki: Source Control & Versioning Strategy

We are using **Git** as our version control system hosted on GitHub. The top three reasons for choosing Git over other tools:

1. **Distributed Version Control** – Enables multiple developers to work efficiently without conflicts.
2. **Branching & Merging** – Allows structured development with feature branches.
3. **Robust Community & Integration** – Supports CI/CD and integrates well with tools like GitHub Actions.

For more details, visit the **Wiki** section of this repository.

---

**Contributors:** Xiangdong Li, Sheng Xing
**Date:** 2024-12-06
