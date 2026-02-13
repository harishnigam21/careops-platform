import { useState } from "react";
import useApi from "../../hooks/Api";

const BookingForm = ({ slot, slug, onSuccess, showInfoFunc }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { loading, sendRequest } = useApi(); //custom hook, using loading to manage loading between api calls and sendRequest function to make api call
  const validateData = () => {
    //  Names: Only alphabets allowed
    const nameRegex = /^[a-zA-Z][a-zA-Z\s\-']{1,50}$/;
    if (!name.trim() || !nameRegex.test(name)) {
      showInfoFunc("red", "Name is required and should contain only letters.");
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      showInfoFunc(
        "red",
        "Please enter a valid email address (e.g., name@domain.com).",
      );
      return false;
    }

    return true;
  };
  const handleBooking = async (e) => {
    e.preventDefault();
    // Only proceed if validateData returns TRUE
    if (!validateData()) {
      return; // Stop the function here
    }
    await sendRequest(
      `public/book`,
      "POST",
      {
        workspaceSlug: slug,
        name,
        email,
        startTime: slot.start,
        endTime: slot.end,
      },
      {},
      false,
    ).then((result) => {
      const data = result?.data;
      if (data && data.message) {
        showInfoFunc(result.success ? "green" : "red", data.message);
      }
      if (result && result.success) {
        onSuccess();
      }
    });
  };

  return (
    <div className="flex flex-col justify-center border-t border-border/50 pt-4">
      <h2 className="font-semibold mb-3 after:content-['*'] after:text-red-500">
        Enter Your Details
      </h2>

      <input
        type="text"
        placeholder="Your Name"
        className="w-full border rounded-lg p-2 mb-3 border-border/20"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Your Email"
        className="w-full border rounded-lg p-2 mb-3 border-border/20"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button
        disabled={loading}
        onClick={handleBooking}
        className={`mt-4 py-2 px-8 gap-2 rounded-lg flex self-center items-center cursor-pointer transition
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 text-white"
    }`}
      >
        <p>Confirm Booking</p>
        {loading && <p className="spinner"></p>}
      </button>
    </div>
  );
};

export default BookingForm;
