# ExpenseTracker

**Personal Expense & Finance Management Application**

ExpenseTracker is a full-stack web application designed to help users manage their personal finances 
by tracking income and expenses, organizing transactions into categories, and visualizing their 
financial activity through an interactive dashboard.

The project is built using **ASP.NET Core Web API, Entity Framework Core, SQL Server, Angular, 
and PrimeNG**, with a focus on clean architecture, RESTful APIs, authentication, data validation, 
and a responsive user experience.

## Features

### Authentication

* User registration.
* User login.
* JWT-based authentication.
* Protected API endpoints.
* Route guards on the frontend.
* Each user can only access their own financial data.

### Transactions

Users can create, edit, view, and delete financial transactions.

Each transaction contains:

* Amount.
* Date.
* Description.
* Transaction type.
* Category.
* User.

Transaction types are:

* Income
* Expense

Transactions can also be filtered by:

* Date range.
* Category.
* Transaction type.

### Categories

Users can manage their own transaction categories.

Examples:

* Food
* Transportation
* Housing
* Entertainment
* Health
* Salary
* Shopping
* Other

Each category belongs to either the **Income** or **Expense** transaction type.

### Dashboard

The dashboard provides an overview of the user's financial situation.

It will include:

* Current balance.
* Total income.
* Total expenses.
* Expenses by category.
* Income vs. expenses over time.
* Recent transactions.

Charts will be used to make financial information easier to understand at a glance.

### Future Features

The application is designed to be extended with additional features such as:

* Monthly budgets.
* Savings goals.
* Budget limit alerts.
* Multi-currency support.
* Excel export.
* PDF export.
* More advanced financial statistics.

## Technology Stack

### Backend

* ASP.NET Core Web API
* Entity Framework Core
* SQL Server
* JWT Authentication
* RESTful API
* DTOs
* Dependency Injection
* Entity Relationships
* EF Core Migrations

### Frontend

* Angular
* TypeScript
* PrimeNG
* PrimeFlex
* Angular Router
* Reactive Forms
* HttpClient
* Route Guards
* HTTP Interceptors
* Chart.js

## Architecture

```text
ExpenseTracker/
│
├── backend/
│   ├── ExpenseTracker.sln
│   │
│   ├── ExpenseTracker.Api/
│   │   ├── Controllers/
│   │   ├── Program.cs
│   │   └── appsettings.json
│   │
│   ├── ExpenseTracker.Core/
│   │   ├── Entities/
│   │   ├── DTOs/
│   │   ├── Interfaces/
│   │   └── Enums/
│   │
│   └── ExpenseTracker.Infrastructure/
│       ├── Data/
│       ├── Repositories/
│       └── Migrations/
│
└── frontend/
    └── expense-tracker-app/
```

## Main Data Model

```text
User
 │
 ├──< Transactions
 │       │
 │       └── Category
 │
 └──< Categories
```

### User

```text
Id
Name
Email
PasswordHash
CreatedAt
```

### Category

```text
Id
Name
Type
UserId
```

### Transaction

```text
Id
Amount
Date
Description
Type
CategoryId
UserId
```

### TransactionType

```text
Income = 0
Expense = 1
```

## Goals

ExpenseTracker is primarily a portfolio project demonstrating the development of a complete 
full-stack application.

The project aims to demonstrate:

* REST API development.
* Authentication and authorization.
* Entity Framework Core.
* Relational database design.
* CRUD operations.
* DTO-based API communication.
* Angular application architecture.
* PrimeNG component usage.
* Reactive forms and validation.
* HTTP interceptors and route guards.
* Data visualization.
* Responsive UI design.
* Clean and maintainable code.
