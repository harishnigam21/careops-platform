import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BiRefresh } from "react-icons/bi";
import useApi from "./hooks/Api";
import { setBookings } from "./store/Slices/bookingSlice";
import { getDaysBetween } from "./utils/getDate";

export default function Dashboard() {
  const data = useSelector((store) => store.user.userInfo);
  const booking = useSelector((store) => store.booking.bookings);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, sendRequest } = useApi(); //custom hook, using loading to manage loading between api calls and sendRequest function to make api call

  useEffect(() => {
    if (data && !data.workspaceId) {
      navigate("/create_workspace", { replace: true });
    }
  }, [data, navigate]);
  if (!data || !data.workspaceId) return null;

  const { workspaceId } = data;
  const onboarding = workspaceId.onboarding || {};

  const completed = Object.values(onboarding).filter(Boolean).length;
  const total = Object.keys(onboarding).length;

  const getBookings = async () => {
    await sendRequest(`booking/${workspaceId._id}`, "GET").then((result) => {
      const data = result?.data;
      if (result && result.success) {
        dispatch(setBookings({ data: data?.data }));
      }
    });
  };

  useEffect(() => {
    getBookings();
  }, []);
  return (
    <section className="p-6 flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Welcome to {workspaceId.name}</h1>
        <p className="text-txlight">
          Onboarding Progress: {completed} / {total}
        </p>
      </header>

      {/* Warning Banner */}
      {!workspaceId.isActive && (
        <div className="p-4 bg-yellow-100 border border-yellow-300 text-red-500 rounded-lg">
          ⚠️ Your workspace is inactive. Complete setup to activate services.
          <button
            className="ml-4 px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => navigate("/onboarding")}
          >
            Complete Setup
          </button>
        </div>
      )}

      {/* Main dashboard content */}
      <article className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">Workspace Status</h2>
          <p
            className={workspaceId.isActive ? "text-green-600" : "text-red-600"}
          >
            {workspaceId.isActive ? "Active" : "Inactive"}
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">Services Active</h2>
          <p>{completed}</p>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">Total Services</h2>
          <p>{total}</p>
        </div>
      </article>

      {/* Create Booking CTA */}
      <article className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <article className="flex flex-col  gap-4 p-4 border rounded-lg">
          <article className="flex items-center justify-between gap-4">
            <h2 className="font-semibold text-2xl flex items-center gap-2">
              Bookings
              <div className="flex cursor-pointer mt-1" onClick={getBookings}>
                <BiRefresh
                  className={`text-2xl text-blue-500 ${loading && "animate-spin"}`}
                />
              </div>
            </h2>
            {workspaceId.isActive ? (
              <div
                className="flex bg-blue-600 w-8 h-8 sm:w-fit sm:h-fit sm:rounded-md sm:py-2 sm:px-4 sm:gap-4 text-white rounded-full items-center justify-center overflow-hidden cursor-pointer"
                onClick={() => navigate("/booking/create")}
              >
                <span className="scale-200 mb-1">+</span>
                <span className={`hidden sm:flex`}>Create Booking</span>
              </div>
            ) : (
              <p className="text-sm text-red-500">
                Complete onboarding to create bookings
              </p>
            )}
          </article>
          {booking && booking.length > 0 ? (
            <article className="flex flex-col overflow-hidden">
              {booking.map((bk, index) => (
                <div
                  key={`home/booking/listed/${index}`}
                  className="flex justify-between gap-3 items-center bg-bgprimary border-b pb-4 mb-4 border-txlight/10 cursor-pointer"
                >
                  <div className="flex flex-col gap-1 whitespace-nowrap overflow-hidden">
                    <h3 className="text-xl md:text-xl">
                      {bk.title.slice(0, 15)}
                      {bk.title.length > 15 && "..."}
                    </h3>
                    <small>created by : {bk.created_by}</small>
                    <small>{getDaysBetween(bk.createdAt)}</small>
                  </div>
                  <div className="flex items-center text-xl md:text-2xl whitespace-nowrap">
                    <strong>at {bk.startTime}</strong>
                  </div>
                </div>
              ))}
            </article>
          ) : (
            <p className="text-red-500">No Booking Found</p>
          )}
        </article>
      </article>
    </section>
  );
}
