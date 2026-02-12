import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useDispatch } from "react-redux";
import { changeLoginStatus, newUser } from "./store/Slices/userSlice";
import useApi from "./hooks/Api";
export default function Login() {
  const dispatch = useDispatch();
  const { loading, sendRequest } = useApi(); //custom hook, using loading to manage loading between api calls and sendRequest function to make api call
  //state that manges form data
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });
  //state manages password to plain txt and plain txt to password
  const [passwordStatus, setPasswordStatus] = useState(false);
  //state used to store message
  const [showInfo, setShowInfo] = useState({
    status: false,
    message: "",
    color: "white",
  });
  // & function that shows this messages
  const showInfoFunc = (color, message) => {
    setShowInfo({ status: true, message, color });
    setTimeout(() => {
      setShowInfo({ status: false, message: "", color: "" });
    }, 4000);
  };
  const navigate = useNavigate();
  //form fields validations
  const validate = () => {
    //  Email: Standard RFC format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(userCredentials.email)) {
      showInfoFunc(
        "red",
        "Please enter a valid email address (e.g., name@domain.com).",
      );
      return false;
    }
    return true;
  };
  //form submission, on successful response userInfo will be stored in userSlice and access token will be stored in localstorage
  const handleSubmit = async (e) => {
    e.preventDefault();
    //form validation
    if (!validate()) {
      return;
    }
    //sending request to the backend to verify user
    await sendRequest(
      "login",
      "POST",
      {
        email: userCredentials.email,
        password: userCredentials.password,
      },
      {},
      false,
    ).then((result) => {
      const data = result?.data;
      if (result && result.success) {
        showInfoFunc("green", data?.message || "Successfully Authorized");
        data.actk &&
          window.localStorage.setItem("acTk", JSON.stringify(data.actk));
        if (data.user) {
          dispatch(newUser({ userInfo: data.user }));
          dispatch(changeLoginStatus({ status: true }));
          window.localStorage.setItem("userInfo", JSON.stringify(data.user));
        }
        setTimeout(() => {
          const ws = data?.user?.workspaceId;
          if (!ws) {
            navigate("/create_workspace", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }, 1000);
      } else {
        const errorMessage =
          result?.error || data?.message || "An error occurred";
        showInfoFunc("red", errorMessage);
        if (result.status === 403 || result.status === 404) {
          setTimeout(() => {
            navigate(`/register`, { replace: true });
          }, 2000);
        }
      }
    });
  };

  //A form with two fields email and password,on input change, onChange event handler is used which change their default value state with e.target.value
  return (
    <section className="w-screen h-screen bg-bgprimary box-border flex flex-col justify-center items-center p-8 text-text">
      <article className="w-full md:w-[75%] lg:w-[50%] flex flex-col gap-4">
        <h1 className="text-3xl font-times text-center">Welcome back</h1>
        <p className="text-secondary1 tracking-wider text-center">
          Sign In to your careops account
        </p>
        <form
          action=""
          className="w-full flex flex-col items-center flex-nowrap gap-4"
        >
          <article className="whitespace-nowrap flex flex-col items-center w-full sm:w-3/4">
            <label
              htmlFor="email"
              id="emailLabel"
              className="bg-bgprimary ml-4 z-2 w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={userCredentials.email}
              className="border border-border rounded-md p-2 -mt-3 w-full"
              placeholder="you@example.com"
              aria-required
              onChange={(e) =>
                setUserCredentials((props) => ({
                  ...props,
                  email: e.target.value,
                }))
              }
            />
          </article>
          <article className="whitespace-nowrap flex flex-col items-center w-full sm:w-3/4">
            <label
              htmlFor="password"
              id="passwordLabel"
              className="bg-bgprimary ml-4 z-2 w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
            >
              Password
            </label>
            <div className="relative w-full flex items-center -mt-3">
              <input
                type={passwordStatus ? "text" : "password"}
                name="password"
                id="password"
                value={userCredentials.password}
                className="border border-border rounded-md p-2 w-full"
                placeholder="........"
                aria-required
                onChange={(e) =>
                  setUserCredentials((props) => ({
                    ...props,
                    password: e.target.value,
                  }))
                }
              />
              {passwordStatus ? (
                <IoMdEyeOff
                  className="cursor-pointer text-2xl absolute right-2"
                  onMouseLeave={() => setPasswordStatus(false)}
                />
              ) : (
                <IoMdEye
                  className="cursor-pointer text-2xl absolute right-2"
                  onMouseEnter={() => setPasswordStatus(true)}
                />
              )}
            </div>
          </article>
        </form>
        {showInfo.status && (
          <p className={`text-center font-bold text-${showInfo.color}-500`}>
            {showInfo.message}
          </p>
        )}
        <button
          className="py-2 px-8 rounded-md bg-primary text-white self-center focus:shadow-[0.1rem_0.1rem_1rem_0.5rem_green_inset] w-fit gap-2 flex justify-center items-center icon"
          onClick={(e) => {
            handleSubmit(e);
          }}
        >
          <p>Sign In</p>
          {loading && <p className="spinner"></p>}
        </button>
        <Link to={"/forgot_password"} className="text-primary self-center">
          Forgot your password?
        </Link>
        <span className="text-center">
          Don't have an account?{" "}
          <Link to={"/register"} className="text-primary font-semibold">
            Sign up
          </Link>
        </span>
      </article>
    </section>
  );
}
