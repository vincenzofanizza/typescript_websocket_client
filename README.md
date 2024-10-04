# TypeScript WebSocket Client

## Introduction

TypeScript WebSocket Client is a real-time chat application built with React and TypeScript. It leverages WebSockets for seamless, bi-directional communication, allowing users to create and participate in chatrooms. The application integrates with Supabase for authentication, ensuring secure and efficient user management.

The backend for this application can be found at: [https://github.com/vincenzofanizza/typescript_websocket_server.git](https://github.com/vincenzofanizza/typescript_websocket_server.git)

## Live Demo

The app is available at: [https://typescript-websocket-client.vercel.app](https://typescript-websocket-client.vercel.app)

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v14 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/typescript_websocket_client.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd typescript_websocket_client
   ```

3. **Install dependencies:**

   Using npm:

   ```bash
   npm install
   ```

   Using yarn:

   ```bash
   yarn install
   ```

### Configuration

1. **Create a `.env` file in the root directory and add the following:**

   ```env
   REACT_APP_API_URL=http://localhost:8080
   REACT_APP_WS_URL=ws://localhost:8080
   ```

   Adjust the URLs according to your backend server's configuration.

### Running the Application

Start the development server:

Using npm:

```bash
npm start
```

Using yarn:

```bash
yarn start
```

The application will run in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

To create a production-ready build:

Using npm:

```bash
npm run build
```

Using yarn:

```bash
yarn build
```

This will bundle the app into the `build` folder for deployment.