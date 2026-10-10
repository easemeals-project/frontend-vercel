# EaseMeals Web Client

EaseMeals Web Client is a modern web application designed to streamline meal planning, food ordering, and event management. Built with the latest web technologies, it offers a seamless and intuitive user experience for managing your culinary needs.

## 🚀 Features

- **User Authentication**: Secure sign-up and login functionality powered by AWS Amplify.
- **Interactive Dashboard**: A centralized hub to manage all your activities.
- **Meal Planning**:
  - **Timetable**: Organize your weekly meal plans.
  - **Schedule**: Keep track of upcoming meals and deliveries.
- **Food Ordering**:
  - **Vendors**: Browse a variety of food vendors.
  - **Checkout**: Seamless checkout process for your orders.
  - **Order Confirmation**: Track the status of your orders.
- **Personalization**:
  - **Food Preferences**: Customize your dietary preferences and restrictions.
  - **Profile Management**: Update your personal information and settings.
- **Wallet & Payments**: Manage your digital wallet for easy transactions.
- **Event Management**: Organize and manage food requirements for your events.

## 🛠️ Tech Stack

This project is built using a robust and modern technology stack:

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Component Library**: [Ant Design (Antd)](https://ant.design/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Data Fetching**: [Apollo Client](https://www.apollographql.com/) (GraphQL) & [Axios](https://axios-http.com/)
- **Backend & Auth**: [AWS Amplify](https://aws.amazon.com/amplify/)
- **Form Handling**: [Formik](https://formik.org/) & [Yup](https://github.com/jquense/yup)

## 📦 Getting Started

Follow these steps to set up the project locally:

### Prerequisites

- Node.js (v18 or later recommended)
- npm, yarn, pnpm, or bun

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd easemeals-web-client
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Environment Setup:**

    Create a `.env.local` file in the root directory and add necessary environment variables (e.g., AWS Amplify config, API endpoints).
    *(Refer to `.env.example` if available)*

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Scripts

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs the linter to check for code quality issues.

## 📂 Project Structure

```
easemeals-web-client/
├── src/
│   ├── app/              # Next.js App Router pages and layouts
│   │   ├── auth/         # Authentication pages
│   │   ├── dashboard/    # Dashboard feature pages
│   │   └── ...
│   ├── core/             # Core application logic
│   ├── lib/              # Utility functions and libraries
│   └── ...
├── public/               # Static assets
├── .env.local            # Local environment variables
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

## 📄 License

## 📄 License

This project is private and proprietary. All rights reserved.
Unauthorized copying, distribution, or use of this source code is strictly prohibited.


