# 💼 GST Automation App

> **Your virtual Chartered Accountant — absolutely free 🇮🇳** > A streamlined GST reconciliation and tax filing preparation tool for Indian businesses.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Stars](https://img.shields.io/github/stars/vaibhavidhenge23/gst-reconciliation-app?style=social)
![Issues](https://img.shields.io/github/issues/vaibhavidhenge23/gst-reconciliation-app)
![Pull Requests](https://img.shields.io/github/issues-pr/vaibhavidhenge23/gst-reconciliation-app)
![Repo Size](https://img.shields.io/github/repo-size/vaibhavidhenge23/gst-reconciliation-app)

## 📖 Overview

The **GST Automation App** solves the tedious, error-prone process of manual GST reconciliation. For small to medium-sized Indian businesses, matching Input Tax Credit (ITC) from purchase invoices against output GST from sales invoices is a monthly struggle. 

This platform provides an automated engine to log invoices, compute GST liabilities, detect mismatches (like missing GSTINs, zero-amount invoices, or invalid tax rates), and generate clean, ITR-ready reports.

## ✨ Features

- **🔐 Secure Access:** PAN-based (Permanent Account Number) user verification and authentication.
- **🧾 Invoice Management:** Easily log Purchase (ITC) and Sales (Output) invoices with automatic GST tax calculations.
- **🔁 Auto Reconciliation:** One-click engine to match monthly purchases vs. sales and calculate Net GST Payable or ITC Available.
- **🚨 Compliance Alerts:** Automatically detects missing vendor GSTINs, anomalous tax rates, and large financial mismatches.
- **📊 Tax Reports:** View annual summaries and month-by-month reconciliation statuses.
- **📈 Real-time Dashboard:** Track financial health, recent transactions, and reconciled percentages at a glance.

## 🛠 Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | [Next.js (App Router)](https://nextjs.org/) | React framework for UI and routing. |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework for modern, responsive design. |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent SVG icon library. |
| **Backend** | [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) | Serverless API endpoints for data processing. |
| **ORM** | [Prisma](https://www.prisma.io/) | Type-safe database client. |
| **Database** | [SQLite](https://www.sqlite.org/) | Lightweight local database for rapid deployment. |

## 🏗 Architecture

The application follows a standard Next.js full-stack architecture. The frontend components communicate with backend API routes, which use Prisma ORM to interact with a local SQLite database.

```mermaid
flowchart TD
    User([User]) -->|Interacts with UI| Client[Next.js Client Components]
    Client -->|HTTP GET/POST| API[Next.js API Routes]
    
    subgraph Backend Services
        API --> Engine[GST Engine lib/gstEngine.js]
        API --> Prisma[Prisma ORM]
    end
    
    Prisma -->|Read/Write| DB[(SQLite Database)]
    Engine -->|Calculates ITC & Payable| API
📁 Project StructurePlaintext├── app/
│   ├── alerts/          # Compliance alerts UI
│   ├── api/             # Backend API Route Handlers
│   │   ├── alerts/
│   │   ├── dashboard/
│   │   ├── invoices/
│   │   ├── reconcile/
│   │   └── reports/
│   ├── components/      # Shared React components (Header, etc.)
│   ├── dashboard/       # Main overview dashboard
│   ├── invoices/        # Invoice creation and listing
│   ├── login/           # PAN verification and Auth
│   ├── reconciliation/  # Reconciliation trigger UI
│   └── reports/         # Annual and monthly reports
├── lib/
│   ├── gstEngine.js     # Core GST math and logic
│   └── prisma.js        # Prisma client singleton
├── prisma/
│   ├── schema.prisma    # Database schema definition
│   └── dev.db           # SQLite database file
├── vercel.json          # Deployment configuration
└── package.json         # Project metadata and scripts
🚀 InstallationFollow these steps to run the application locally.1. Clone the repositoryBashgit clone [https://github.com/vaibhavidhenge23/gst-reconciliation-app.git](https://github.com/vaibhavidhenge23/gst-reconciliation-app.git)
cd gst-reconciliation-app
2. Install dependenciesBashnpm install
3. Setup the DatabaseGenerate the Prisma client and push the schema to the SQLite database.Bashnpx prisma generate
npx prisma db push
4. Start the Development ServerBashnpm run dev
Visit http://localhost:3000 in your browser.💻 UsageLogin: Enter a valid Indian PAN format (e.g., ABCDE1234F) to access the dashboard.Add Invoices: Navigate to the Invoices tab to add your monthly Purchase and Sales records.Reconcile: Go to the Reconcile tab, select the Target Month and Year, and run the engine.Review Compliance: Check the Alerts tab for any missing data or mismatched tax rates detected during reconciliation.Generate Reports: Use the Reports tab to view your aggregated financial data for tax filing.⚙️ ConfigurationCurrently, the app uses a local SQLite database (dev.db). No .env configuration is strictly required to run it locally.If you plan to migrate to a production database (like PostgreSQL), update the prisma/schema.prisma file and add a .env file:Code snippet# .env
DATABASE_URL="postgresql://user:password@localhost:5432/gst_db"
🔌 API ModulesThe application exposes the following internal REST APIs:GET /api/dashboard: Aggregates current month's GST totals, sales/purchase counts, and recent transactions.GET/POST /api/invoices: Fetches or creates PurchaseInvoice and SalesInvoice records.POST /api/reconcile: The core engine. Accepts a month and year, calculates aggregate GST, logs errors, and marks invoices as reconciled.GET /api/reports: Fetches historical reconciliation data ordered by date.GET /api/alerts: Retrieves the top 50 most recent compliance logs.📸 Demo(Add screenshots of your application here)Login ScreenDashboard[Screenshot Placeholder][Screenshot Placeholder]ReconciliationCompliance Alerts[Screenshot Placeholder][Screenshot Placeholder]🤝 ContributingContributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.Fork the ProjectCreate your Feature Branch (git checkout -b feature/AmazingFeature)Commit your Changes (git commit -m 'Add some AmazingFeature')Push to the Branch (git push origin feature/AmazingFeature)Open a Pull Request🗺 Roadmap[ ] Implement OCR / PDF parsing for automated invoice uploads.[ ] Add Multi-tenant support for CAs to manage multiple client profiles.[ ] Integrate email notifications for upcoming filing deadlines (GSTR-1, GSTR-3B).[ ] Migrate from SQLite to PostgreSQL for scalable production deployments.📄 LicenseDistributed under the MIT License. See LICENSE for more information
