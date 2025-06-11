# AuditHive Project V2

AuditHive Project V2 is a comprehensive web-based platform designed to streamline and automate the management, analysis, and reporting of taxpayer data. The application provides tools for risk assessment, compliance tracking, fraud detection, analytics, and consolidated reporting, making it ideal for audit professionals and organizations handling large volumes of tax-related information.

## Project Overview

Based on the project structure, AuditHive V2 appears to provide functionalities related to:

- **Authentication:** User login and protected routes.
- **Dashboard & Analytics:** Visualizing data through various charts (e.g., sales comparison, risk analysis, GST payable vs. refundable) and summary cards.
- **Tax Modules:** Specific sections for GST (Goods and Services Tax), CIT (Corporate Income Tax), and SWT (likely Withholding Tax).
- **Risk Management:** Features for risk assessment, risk profiling, and fraud detection.
- **Data Handling:** Uploading data (possibly spreadsheets), viewing recent uploads, and managing upload history.
- **Reporting:** Generating and viewing reports, including taxpayer-specific reports and consolidated profiles.
- **Compliance:** Tools to monitor and manage tax compliance.
- **User Support:** Help centre, contact us, and about us pages.

## Key Technologies

- **Frontend:** React, React Router, Redux (with Redux Toolkit and Redux Persist)
- **UI Components:** React-Bootstrap, ApexCharts, React Icons, Lucide React
- **HTTP Client:** Axios
- **Styling:** CSS, Tailwind CSS (potentially)
- **Utilities:** date-fns, papaparse (for CSV parsing), xlsx (for Excel file handling)

## Getting Started

(You can add instructions here on how to clone the repository, install dependencies, and run the project.)

### Prerequisites

(List any prerequisites like Node.js version, npm/yarn, etc.)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd AuditHiveProjV2
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Application

- To start the development server:
  ```bash
  npm start
  ```
- To build the application for production:
  ```bash
  npm run build
  ```
- To build for a development environment (using `.env.development`):
  ```bash
  npm run build:development
  ```

## Project Structure

The `src` directory contains the core application code, organized as follows:

- `components/`: Reusable UI components (e.g., Header, Footer, Table, Charts, Filters).
- `context/`: React context for managing global state (e.g., AuthContext).
- `pages/`: Top-level page components corresponding to different routes/features.
- `services/`: Modules for making API calls (e.g., auth, GST, CIT, SWT services).
- `slice/`: Redux Toolkit slices for managing different parts of the application state.
- `store.js`: Redux store configuration.
- `utils/`: Utility functions (e.g., data formatters).

## Contributing

(Add guidelines for contributing to the project, if applicable.)

## License

(Specify the license for the project.)
