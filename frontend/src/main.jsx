import { lazy, Suspense } from "react";
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
import PublicBookingPage from "./components/booking/PublicBookingPage.jsx";
import Loading from "./components/Loading.jsx";
const Loginmsg = lazy(() => import("./components/User_friendly_Error/Login.jsx"));
const NotFound = lazy(
  () => import("./components/User_friendly_Error/NotFound.jsx"),
);
const Refresh = lazy(
  () => import("./components/User_friendly_Error/Refresh.jsx"),
);
const BadRequest = lazy(
  () => import("./components/User_friendly_Error/BadRequest.jsx"),
);
const ServerError = lazy(
  () => import("./components/User_friendly_Error/ServerError.jsx"),
);
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
      {
        path: "msg/login",
        element: (
          <Suspense
            fallback={
              <div className="w-screen h-screen flex justify-center items-center">
                <Loading />
              </div>
            }
          >
            <Loginmsg />
          </Suspense>
        ),
      },
      {
        path: "msg/not-found",
        element: (
          <Suspense
            fallback={
              <div className="w-screen h-screen flex justify-center items-center">
                <Loading />
              </div>
            }
          >
            <NotFound />
          </Suspense>
        ),
      },
      {
        path: "msg/bad-request",
        element: (
          <Suspense
            fallback={
              <div className="w-screen h-screen flex justify-center items-center">
                <Loading />
              </div>
            }
          >
            <BadRequest />
          </Suspense>
        ),
      },
      {
        path: "msg/server-error",
        element: (
          <Suspense
            fallback={
              <div className="w-screen h-screen flex justify-center items-center">
                <Loading />
              </div>
            }
          >
            <ServerError />
          </Suspense>
        ),
      },
      {
        path: "msg/refresh",
        element: (
          <Suspense
            fallback={
              <div className="w-screen h-screen flex justify-center items-center">
                <Loading />
              </div>
            }
          >
            <Refresh />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/book/:slug", element: <PublicBookingPage /> },
]);
createRoot(document.getElementById("root")).render(
  <Provider store={myStore}>
    <RouterProvider router={router} />
  </Provider>,
);
