import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/Api";
import { useState } from "react";
import { updateWorkSpace } from "../store/Slices/userSlice";
export default function CreateWorkSpace() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, sendRequest } = useApi(); //custom hook, using loading to manage loading between api calls and sendRequest function to make api call
  const [info, setInfo] = useState({
    name: "",
    address: "",
    email: "",
    timezone: "",
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
    //  Names: Only alphabets allowed
    const nameRegex = /^[A-Za-z]+$/;
    if (!info.name.trim() || !nameRegex.test(info.name)) {
      showInfoFunc(
        "red",
        "Business name is required and should contain only letters.",
      );
      return false;
    }
    //TimeZone
    if (info.timezone.length < 4) {
      showInfoFunc("red", "Please enter a valid TimeZone from options");
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

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Only proceed if validateData returns TRUE
    if (!validateData()) {
      return; // Stop the function here
    }
    console.log("validation completed..");
    sendRequest("workspace", "POST", info, {}, false).then((result) => {
      const data = result?.data;
      showInfoFunc(result.success ? "green" : "red", data.message);
      if (result && result.success) {
        dispatch(updateWorkSpace({ data: data.data }));
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    });
  };
  return (
    <section className="text-text flex flex-col h-full justify-center gap-4 p-2 md:p-4">
      <h1
        className="
  [font-variant:small-caps] justify-self-center self-center 
  text-2xl md:text-4xl font-medium tracking-wide
  bg-linear-to-b from-text from-0% via-text via-50% to-primary to-50%
  bg-clip-text text-transparent
  drop-shadow-sm
"
      >
        Create WorkSpace
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 w-full md:w-3/4 xl:w-1/2 self-center"
      >
        {/* 1st row */}
        <article className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* channel name */}
          <article className="whitespace-nowrap flex flex-col items-center w-full">
            <label
              htmlFor="name"
              id="nameLabel"
              className="bg-bgprimary ml-4 z-2 w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="border border-border rounded-md p-2 -mt-3 w-full"
              placeholder="Business Name"
              value={info.name}
              onChange={(e) =>
                setInfo((prev) => ({ ...prev, name: e.target.value }))
              }
              aria-required
            />
          </article>
          <article className="whitespace-nowrap flex flex-col items-center w-full">
            <label
              htmlFor="address"
              id="addressLabel"
              className="bg-bgprimary ml-4 z-2 w-fit self-start after:ml-1"
            >
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              className="border border-border rounded-md p-2 -mt-3 w-full"
              placeholder="Enter Address here..."
              value={info.address}
              onChange={(e) =>
                setInfo((prev) => ({ ...prev, address: e.target.value }))
              }
            />
          </article>
        </article>
        {/* 2nd row */}
        <article className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* TimeZone */}
          <article className="whitespace-nowrap flex flex-col items-center w-full">
            <label
              htmlFor="tz"
              id="tzLabel"
              className="bg-bgprimary ml-4 z-2 w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
            >
              TimeZone
            </label>
            <select
              name="tz"
              id="tz"
              className="border bg-bgprimary border-border rounded-md p-2 -mt-3 w-full"
              value={info.timezone}
              onChange={(e) =>
                setInfo((prev) => ({ ...prev, timezone: e.target.value }))
              }
            >
              <option value="">Select</option>
              {Intl.supportedValuesOf("timeZone").map((tz, index) => (
                <option key={`tz/${index}`} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </article>
          <article className="whitespace-nowrap flex flex-col items-center w-full">
            <label
              htmlFor="email"
              id="emailLabel"
              className="bg-bgprimary ml-4 z-2 w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="border border-border rounded-md p-2 -mt-3 w-full"
              placeholder="Contact Email"
              value={info.email}
              onChange={(e) =>
                setInfo((prev) => ({ ...prev, email: e.target.value }))
              }
              aria-required
            />
          </article>
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
