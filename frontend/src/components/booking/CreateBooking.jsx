import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/Api";
import { setBookings } from "../../store/Slices/bookingSlice";
export default function CreateBooking() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, sendRequest } = useApi(); //custom hook, using loading to manage loading between api calls and sendRequest function to make api call
  const workspaceId = useSelector(
    (store) => store.user.userInfo?.workspaceId?._id,
  );
  const [info, setInfo] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
  });
  //store message to show user
  const [showInfo, setShowInfo] = useState({
    status: false,
    message: "",
    color: "white",
  });
  // & this function reflect the message to user
  const showInfoFunc = (color, message) => {
    setShowInfo({ status: true, message, color });
    setTimeout(() => {
      setShowInfo({ status: false, message: "", color: "" });
    }, 4000);
  };
  const validateData = () => {
    //Title Validation
    if (!info.title || info.title.length < 3) {
      showInfoFunc("red", "Tile not valid, require atleast 3 character");
      return false;
    }

    //Date validation
    if (!info.date) {
      showInfoFunc("red", "Missing Date");
      return false;
    }
    const bookingDate = new Date(info.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(bookingDate.getTime()) || bookingDate < today) {
      showInfoFunc("red", "Invalid date or date is in the past");
      return false;
    }

    //Time Validation
    if (!info.startTime) {
      showInfoFunc("red", "Missing startTime");
      return false;
    }
    const start = parseInt(info.startTime.replace(":", ""));

    if (!info.endTime) {
      showInfoFunc("red", "Missing endTime");
      return false;
    }
    const end = parseInt(info.endTime.replace(":", ""));
    if (end <= start) {
      showInfoFunc("red", "End time must be after start time");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Only proceed if validateData returns TRUE
    if (!validateData()) {
      return; // Stop the function here
    }
    console.log("validation completed..");
    sendRequest(`booking/${workspaceId}`, "POST", info, {}, false).then(
      (result) => {
        const data = result?.data;
        showInfoFunc(result.success ? "green" : "red", data.message);
        if (result && result.success) {
          dispatch(setBookings({ data: data.data }));
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      },
    );
  };
  return (
    <section className="text-text flex flex-col h-full justify-center gap-4 p-2 md:p-4">
      <h1 className="[font-variant:small-caps] justify-self-center self-center text-2xl md:text-4xl font-medium tracking-wide bg-linear-to-b from-text from-0% via-text via-50% to-primary to-50% bg-clip-text text-transparent drop-shadow-sm uppercase">
        Book Now
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 w-full md:w-3/4 xl:w-1/2 self-center"
      >
        {/* 1st row Title*/}
        <article className="whitespace-nowrap flex flex-col items-center w-full">
          <label
            htmlFor="title"
            id="titleLabel"
            className="bg-bgprimary ml-4 z-2 w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="border border-border rounded-md p-2 -mt-3 w-full"
            placeholder="Enter Title here..."
            value={info.title}
            onChange={(e) =>
              setInfo((prev) => ({ ...prev, title: e.target.value }))
            }
            aria-required
          />
        </article>
        {/* 2nd row Date & Time*/}
        <article className="flex flex-col sm:flex-row gap-4 w-full">
          {/* Date*/}
          <article className="whitespace-nowrap flex flex-col items-center">
            <label
              htmlFor="date"
              id="dateLabel"
              className="bg-bgprimary ml-4 z-2 w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
            >
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              className="border border-border rounded-md p-2 -mt-3 self-start"
              value={info.date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setInfo((prev) => ({ ...prev, date: e.target.value }))
              }
              aria-required
            />
          </article>
          {/* Time */}
          <article className="flex gap-4">
            {/* Start Time */}
            <article className="whitespace-nowrap flex flex-col items-center">
              <label
                htmlFor="startTime"
                id="startTimeLabel"
                className="bg-bgprimary ml-4 z-2 w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
              >
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                id="startTime"
                className="p-2 -mt-3 rounded-md border border-border self-start"
                value={info.startTime}
                onChange={(e) =>
                  setInfo((prev) => ({ ...prev, startTime: e.target.value }))
                }
                aria-required
              />
            </article>
            {/* End Time */}
            <article className="whitespace-nowrap flex flex-col items-center">
              <label
                htmlFor="endTime"
                id="endTimeLabel"
                className="bg-bgprimary ml-4 z-2 w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
              >
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                id="endTime"
                className="p-2 -mt-3 rounded-md border border-border self-start"
                value={info.endTime}
                onChange={(e) =>
                  setInfo((prev) => ({ ...prev, endTime: e.target.value }))
                }
                aria-required
              />
            </article>
          </article>
        </article>
        {/* 3rd Row Description */}
        <article className="whitespace-nowrap flex flex-col items-center w-full">
          <label
            htmlFor="description"
            id="descriptionLabel"
            className="bg-bgprimary ml-4 z-2 w-fit self-start after:ml-1"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            className="border border-border rounded-md p-2 -mt-3 w-full"
            placeholder="Enter description here..."
            value={info.description}
            onChange={(e) =>
              setInfo((prev) => ({ ...prev, description: e.target.value }))
            }
          ></textarea>
        </article>
        {/*backend information handler */}
        {showInfo.status && (
          <p
            style={{ color: showInfo.color }}
            className="text-center font-bold"
          >
            {showInfo.message}
          </p>
        )}
        {/* submit& cancel button */}
        <div className="flex self-center gap-4">
          <button
            className="font-medium py-2 px-6 rounded-md border border-border icon"
            onClick={() => navigate("/", { replace: true })}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 font-medium py-2 px-6 rounded-md border border-border self-center shadow-[0.1px_0.1px_10px_0.1px_#222222_inset] icon"
          >
            <p>Submit</p>
            {loading && (
              <p className="w-5 aspect-square rounded-full border-2 border-l-bgprimary border-r-primary border-b-secondary border-t-bgprimary animate-[spin_0.3s_linear_infinite]"></p>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
