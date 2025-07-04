import ReactDOM from "react-dom/client";
import App from "./components/App";
import { CoverProvider } from "./context/CoverContext";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <CoverProvider>
    <App />
  </CoverProvider>
);
// This file is the entry point for the React application.
// It imports React, ReactDOM, the main App component, and the global CSS styles.
// It then renders the App component into the root element of the HTML document.
// The use of React.StrictMode helps identify potential problems in the application.
// The `!` after `getElementById('root')` is a TypeScript non-null assertion operator,
// indicating that the element will not be null at runtime, which is safe in this context
// since the root element is expected to be present in the HTML file.
// The `createRoot` method is used to create a root for the React application,
// which is a new API introduced in React 18 for concurrent rendering capabilities.
// The `render` method is called to render the App component into the root element.
// This setup is typical for a React application using Vite as the build tool.
// The `index.css` file is imported to apply global styles to the application.
// The application can be started by running the development server, which will serve the React app
// and allow for hot module replacement during development.