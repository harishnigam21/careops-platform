import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import myStore from "./store/Store";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);
createRoot(document.getElementById("root")).render(
  <Provider store={myStore}>
    <RouterProvider router={router} />
  </Provider>,
);
