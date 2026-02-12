import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import myStore from "./store/Store";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import OnBoarding from "./onBoarding.jsx";
import Dashboard from "./Dashboard.jsx";
import App from "./App.jsx";
import CreateWorkSpace from "./components/CreateWorkSpace.jsx";
import Email from "./components/setUp/Email.jsx";
import Availability from "./components/setUp/Availability.jsx";
import Booking from "./components/setUp/Booking.jsx";
import CreateBooking from "./components/booking/CreateBooking.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "onboarding",
        element: <OnBoarding />,
        children: [
          { path: "setup/email", element: <Email /> },
          { path: "setup/booking", element: <Booking /> },
          { path: "setup/availability", element: <Availability /> },
        ],
      },
      {
        path: "create_workspace",
        element: <CreateWorkSpace />,
      },
      {
        path: "booking",
        children: [
          {
            path: "create",
            element: <CreateBooking />,
          },
        ],
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);
createRoot(document.getElementById("root")).render(
  <Provider store={myStore}>
    <RouterProvider router={router} />
  </Provider>,
);
