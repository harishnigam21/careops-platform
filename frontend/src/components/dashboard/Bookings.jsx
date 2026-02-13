import { useEffect } from "react";
import { setBookings } from "../../store/Slices/bookingSlice";
import { useDispatch, useSelector } from "react-redux";
import useApi from "../../hooks/Api";
import { BiRefresh } from "react-icons/bi";
import BookingCard from "./BookingCard";
import { useNavigate } from "react-router-dom";
export default function Bookings({ workspaceId }) {
  const { loading, sendRequest } = useApi(); //custom hook, using loading to manage loading between api calls and sendRequest function to make api call
  const booking = useSelector((store) => store.booking.bookings);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    <article className="flex flex-col gap-2 border rounded-lg">
      <article className="flex p-4 items-center justify-between gap-4">
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
      <hr className="border-t border-border/10 w-full" />
      {booking && booking.length > 0 ? (
        <article className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-4 gap-4">
          {booking.map((bk, index) => (
            <BookingCard key={`home/booking/listed/${index}`} bk={bk} />
          ))}
        </article>
      ) : (
        <p className="text-red-500 text-center py-4">No Booking Found</p>
      )}
    </article>
  );
}
