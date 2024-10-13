# MegaBlog

MegaBlog is a modern blogging platform built using React, Redux Toolkit, and Appwrite. This project aims to provide a dynamic and interactive blogging experience for users, featuring seamless form handling, state management, and routing.

## Installation

Before you begin, ensure you have `Node.js` and `npm` installed on your system.

---

## Dependencies

Here are the key dependencies used in the project:

- **`@reduxjs/toolkit`**: A powerful tool set for managing global state in React.
- **`react-redux`**: Official bindings for using Redux in React apps.
- **`react-router-dom`**: Declarative routing for React applications.
- **`appwrite`**: Backend as a service for managing users, databases, and authentication.
- **`html-react-parser`**: Allows parsing and rendering HTML content in React components.
- **`react-hook-form`**: A lightweight library for managing form validation and input handling in React.

---

## Setting Up Appwrite

Follow these steps to set up Appwrite for your Megablog project:

### 1. Install Appwrite

You can deploy Appwrite on your local machine, a virtual server, or use a cloud provider. To get started, refer to the [Appwrite installation guide](https://appwrite.io/docs/installation).

### 2. Create a New Project

1. Access the Appwrite Console.
2. Click on **`Projects`** in the sidebar.
3. Click on **`Add Project`**.
4. Fill in the project name (e.g., "MegaBlog") and description.
5. Click **`Create Project`**.

### 3. Create a Database

1. In your project dashboard, click on **`Database`** in the sidebar.
2. Click on **`Create Database`**.
3. Provide a name for your database (e.g., "blogs") and click **`Create`**.

### 4. Create Collections

1. Inside your database, click on **`Add Collection`**.
2. Define the collection name (e.g., "`Posts`") and configure its attributes (fields) such as:

   - **`Title`**: String (required)
   - **`Content`**: Text (required)
   - **`Author`**: String (required)
   - **`Created At`**: DateTime (automatically set)

3. Click **`Create`** to finalize the collection.

### 5. Configure Permissions

1. Set up the appropriate permissions for your collection by going to the **`Permissions`** tab in your collection settings.
2. Define who can create, read, update, and delete documents in the collection.

### 6. Generate API Keys

1. In the Appwrite console, navigate to **`API Keys`** in the project settings.
2. Click on **`Add API Key`**.
3. Provide a name for the key (e.g., "MegaBlog API Key").
4. Select the required scopes based on your project needs (e.g., `database`, `users`, etc.).
5. Click **Create** and copy the generated API key.

### 7. Update Your .env File

Add the following variables to your `.env` file:

```bash
VITE_APPWRITE_URL = "your-appwrite-url"
VITE_APPWRITE_PROJECT_ID = "your-project-id"
VITE_APPWRITE_DATABASE_ID = "your-database-id"
VITE_APPWRITE_COLLECTION_ID = "your-collection-id"
VITE_APPWRITE_BUCKET_ID = "your-bucket-id"
```

---

## .env File

This project uses a `.env` file to manage environment-specific variables such as API keys and backend URLs. Before running the project, create a `.env` file in the root directory with the following format:

To access these variables in the project, use:

```js
console.log(import.meta.env.VITE_DB_URL);
```

## .env.sample

The `.env.sample` file is a template or example file that shows developers which environment variables they need to set in their own `.env` file to properly configure the project. It provides placeholders (such as `your-appwrite-api-url`) to indicate what kind of information needs to be entered but without exposing sensitive data like API keys or project IDs.

### Purpose of `.env.sample`:

- **Guidance**: It helps developers set up their environment variables correctly by providing an example structure.
- **Security**: It doesn’t contain actual sensitive data (unlike `.env`), so it can be safely committed to version control.
- **Collaboration**: When working in a team or sharing the project, others can copy this file and rename it to `.env`, then fill in their specific values. This ensures everyone has the same environment variable setup.

---

## Configuring Environment Variables for Production

When deploying your application, it's essential to manage your environment variables effectively to ensure security, flexibility, and maintainability. This section outlines how to create a configuration file for `.env` to use in a production environment.

### Creating the .env File

1. **Create a `.env` file**: In the root of your project, create a new file named `.env`. This file will contain all the environment-specific variables that your application needs to run in production.

2. **Add Environment Variables**: Populate the `.env` file with the necessary variables.

### Accessing Environment Variables Im config.js file

In your Vite application, you can access these environment variables using `import.meta.env.VITE_VARIABLE_NAME` For example:

```js
// ./src/config/config.js
const config = {
  appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
  appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
};

export default config;
```

---

## Authentication Service (Production Grade)

For the authentication flow, we have implemented a robust, production-grade solution using Appwrite. The authentication service handles user registration, login, session management, and logout functionality securely and efficiently. Below is a detailed description of how to set up and use the authentication service in a production environment.

### Step 1: Authentication Service Structure

In this project, the authentication logic is encapsulated within a class `AuthService` for better maintainability and scalability.

### File Structure

Create a dedicated file to manage the authentication logic:

```plaintext
src/
├── appwrite/
│   └── auth_service.js
├── config/
│   └── config.js
```

### Step 2: Configure Appwrite Client in auth_service.js

The authentication service is built using the Appwrite JavaScript. The following code is used to handle account creation, login, session management, and logout.

```js
// src/appwrite/auth_service.js
import { config } from "../config/config";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl) // Appwrite API URL
      .setProject(config.appwriteProjectId); // Appwrite Project ID

    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        // Automatically log in the user after account creation
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      return error;
    }
  }

  async logout() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      return error;
    }
  }
}

const authService = new AuthService();
export default authService;
```

### Step 3: Config File for Production

In the config directory, create a `config.js` file to manage environment variables in a centralized way. This helps you easily switch between different environments (development, production) without hardcoding values.

### Step 4: Using the AuthService in Your Components

To use the AuthService in your components, you can import it and call its methods like createAccount, login, getCurrentUser, and logout.

### Benefits of This Approach

1. **Scalability**: By encapsulating authentication logic within a dedicated service (`AuthService`), the app becomes more modular and easier to scale. You can extend or modify authentication methods (e.g., social login) without affecting other parts of the app.

2. **Separation of Concerns**: Managing environment-specific variables (e.g., API URL, Project ID) via the `.env` and `config.js` files keeps sensitive data centralized and ensures that configurations can be easily changed for different environments (development, production).

3. **Reusability**: The `AuthService` class is reusable across components, reducing code duplication and making the app more maintainable.

4. **Security**: Sensitive information like API URLs and keys are securely managed via environment variables, preventing hardcoding of credentials in the codebase.

5. **Error Handling**: The structured use of `try-catch` blocks helps manage errors more effectively, providing better debugging and user experience in the authentication flow.

---
