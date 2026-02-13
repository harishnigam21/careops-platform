import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/Api";
import { setBookings } from "../../store/Slices/bookingSlice";
import SlotList from "../public/SlotList";
import { useEffect } from "react";
export default function CreateBooking() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, sendRequest } = useApi(); //custom hook, using loading to manage loading between api calls and sendRequest function to make api call
  const workspace = useSelector((store) => store.user.userInfo?.workspaceId);
  const [info, setInfo] = useState({
    name: "",
    email: "",
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
  const [slots, setSlots] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  useEffect(() => {
    if (selectedSlot && slots.length > 0) {
      setInfo((prev) => ({
        ...prev,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
      }));
    } else {
      setSelectedSlot(null);
      setInfo((prev) => ({
        ...prev,
        startTime: "",
        endTime: "",
      }));
    }
  }, [selectedSlot, slots]);
  // & this function reflect the message to user
  const showInfoFunc = (color, message) => {
    setShowInfo({ status: true, message, color });
    setTimeout(() => {
      setShowInfo({ status: false, message: "", color: "" });
    }, 4000);
  };
  const validateData = () => {
    //  Names: Only alphabets allowed
    const nameRegex = /^[a-zA-Z][a-zA-Z\s\-']{1,50}$/;
    if (!info.name.trim() || !nameRegex.test(info.name)) {
      showInfoFunc("red", "Name is required and should contain only letters.");
      return false;
    }
    //  Email: Standard RFC format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(info.email)) {
      showInfoFunc(
        "red",
        "Please enter a valid email address (e.g., name@domain.com).",
      );
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
      showInfoFunc("red", "Missing slot");
      return false;
    }

    if (!info.endTime) {
      showInfoFunc("red", "Missing slot");
      return false;
    }

    return true;
  };
  const getSlots = async (date) => {
    await sendRequest(
      `public/availability/${workspace.slug}?date=${date}`,
    ).then((result) => {
      const data = result?.data;
      showInfoFunc(result.success ? "green" : "red", data.message);
      if (result && result.success) {
        setSlots(data.slots);
      }
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Only proceed if validateData returns TRUE
    if (!validateData()) {
      return; // Stop the function here
    }
    console.log("validation completed..");
    sendRequest(`booking/${workspace._id}`, "POST", info, {}, false).then(
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
        {/* 1st row name and email*/}
        <article className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* name */}
          <article className="whitespace-nowrap flex flex-col items-center w-full">
            <label
              htmlFor="bname"
              id="bnameLabel"
              className="bg-bgprimary ml-4 z-2 w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
            >
              Name
            </label>
            <input
              type="text"
              name="bname"
              id="bname"
              value={info.name}
              className="border border-border rounded-md p-2 -mt-3 w-full"
              placeholder="Enter full name here.."
              onChange={(e) =>
                setInfo((prev) => ({ ...prev, name: e.target.value }))
              }
              aria-required
            />
          </article>
          {/* email */}
          <article className="relative whitespace-nowrap flex flex-col items-center justify-center w-full">
            <label
              htmlFor="email"
              id="emailLabel"
              className="bg-bgprimary ml-4 z-2 w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
            >
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              value={info.email}
              className="border border-border rounded-md p-2 -mt-3 w-full"
              placeholder="Enter email here..."
              aria-required
              onChange={(e) =>
                setInfo((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </article>
        </article>
        {/* 2nd row Date & Time*/}
        <article className="flex flex-col md:flex-row gap-12 w-full">
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
              onChange={(e) => {
                setInfo((prev) => ({ ...prev, date: e.target.value }));
                getSlots(e.target.value);
              }}
              aria-required
            />
          </article>
          {/* Time */}
          <article className="flex items-center gap-4 w-full">
            {/* Time Slots */}
            {!loading ? (
              slots ? (
                slots.length > 0 ? (
                  <SlotList
                    slots={slots}
                    onSelect={setSelectedSlot}
                    selectedSlot={selectedSlot}
                  />
                ) : (
                  <p className="text-red-500 text-center text-xl mt-2">
                    No Slot Available
                  </p>
                )
              ) : (
                <p className="text-blue-500 text-center text-xl mt-2">
                  Please select date to get slots..
                </p>
              )
            ) : (
              <div className="flex items-center justify-center">
                <p className="spinner h-18 w-18" />
              </div>
            )}
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
            className="text-center font-bold text-xl"
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
