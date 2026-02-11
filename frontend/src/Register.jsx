import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useApi from "./hooks/Api";
export default function Register() {
  const { sendRequest, loading } = useApi(); //custom hook, using loading to manage loading between api calls and sendRequest function to make api call
  //state that manges form data
  const [userCredentials, setUserCredentials] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    role: "",
    password: "",
    cnfPassword: "",
  });
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
  const userRole = ["owner", "staff"];
  const navigate = useNavigate();
  //form fields validations
  const validate = () => {
    //  Names: Only alphabets allowed
    const nameRegex = /^[A-Za-z]+$/;
    if (
      !userCredentials.firstname.trim() ||
      !nameRegex.test(userCredentials.firstname)
    ) {
      showInfoFunc(
        "red",
        "First name is required and should contain only letters.",
      );
      return false;
    }
    if (
      userCredentials.middlename.trim() &&
      !nameRegex.test(userCredentials.middlename)
    ) {
      showInfoFunc(
        "red",
        "If entered middlename then it should contain only letters.",
      );
      return false;
    }
    if (
      !userCredentials.lastname.trim() ||
      !nameRegex.test(userCredentials.lastname)
    ) {
      showInfoFunc(
        "red",
        "Last name is required and should contain only letters.",
      );
      return false;
    }
    if (!userRole.includes(userCredentials.role)) {
      showInfoFunc("red", "Not valid role selection");
      return false;
    }
    //  Email: Standard RFC format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(userCredentials.email)) {
      showInfoFunc(
        "red",
        "Please enter a valid email address (e.g., name@domain.com).",
      );
      return false;
    }

    // Password Specific Validation
    if (userCredentials.password.length < 8) {
      showInfoFunc("red", "Password must be at least 8 characters long.");
      return false;
    }
    if (!/[A-Z]/.test(userCredentials.password)) {
      showInfoFunc(
        "red",
        "Password must contain at least one uppercase letter (A-Z).",
      );
      return false;
    }
    if (!/[a-z]/.test(userCredentials.password)) {
      showInfoFunc(
        "red",
        "Password must contain at least one lowercase letter (a-z).",
      );
      return false;
    }
    if (!/[0-9]/.test(userCredentials.password)) {
      showInfoFunc("red", "Password must contain at least one number (0-9).");
      return false;
    }
    if (!/[@$!%*?&]/.test(userCredentials.password)) {
      showInfoFunc(
        "red",
        "Password must contain at least one special character (e.g., @, $, !, %, *, ?, &).",
      );
      return false;
    }
    if (userCredentials.password !== userCredentials.cnfPassword) {
      showInfoFunc("red", "Password does not match with original one.");
      return false;
    }

    return true;
  };
  //sending request to the backend to store user information after field validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    await sendRequest("register", "POST", userCredentials, {}, false).then(
      (result) => {
        const data = result?.data;
        if (result && result.success) {
          showInfoFunc("green", data?.message || "Successfully Registered");
          setUserCredentials({
            firstname: "",
            middlename: "",
            lastname: "",
            email: "",
            password: "",
            cnfPassword: "",
          });
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 2000);
        } else {
          const errorMessage =
            result?.error || data?.message || "An error occurred";
          showInfoFunc("red", errorMessage);
          if (result.status === 409) {
            setTimeout(() => {
              navigate(`/signin`, { replace: true });
            }, 2000);
          }
        }
      },
    );
  };
  //form with fields, max are mandatory as per user criteria, on input change, onChange event handler is used which change their default value state with e.target.value
  return (
    <section className="w-screen h-screen box-border flex flex-col min-[480px]:justify-center items-center p-8 overflow-y-scroll text-text">
      <article className="w-full md:w-[75%] lg:w-[50%] flex flex-col gap-4">
        <h1 className="text-3xl font-times text-center">Welcome to CareOps</h1>
        <p className="text-secondary1 tracking-wider text-center">
          Sign Up to your CareOps account
        </p>
        <form
          action=""
          className="w-full flex flex-col items-center flex-nowrap gap-4"
        >
          {/* name section */}
          <article className="whitespace-nowrap w-full flex flex-col items-center min-[480px]:flex-row min-[480px]:flex-nowrap min-[480px]:justify-between min-[480px]:items-center gap-4">
            <article className="whitespace-nowrap w-full flex flex-col items-center grow">
              <label
                htmlFor="first_name"
                id="first_name_Label"
                className="bg-bgprimary ml-4 z-2 w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
              >
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                id="first_name"
                value={userCredentials.firstname}
                className="border border-border rounded-md p-2 -mt-3 w-full"
                placeholder="Harish"
                aria-required
                onChange={(e) =>
                  setUserCredentials((props) => ({
                    ...props,
                    firstname: e.target.value,
                  }))
                }
              />
            </article>
            <article className="whitespace-nowrap w-full flex flex-col items-center grow">
              <label
                htmlFor="middle_name"
                id="middle_name_Label"
                className="bg-bgprimary ml-4 z-2 w-fit self-start"
              >
                Middle Name
              </label>
              <input
                type="text"
                name="middle_name"
                id="middle_name"
                value={userCredentials.middlename}
                className="border border-border rounded-md p-2 -mt-3 w-full"
                onChange={(e) =>
                  setUserCredentials((props) => ({
                    ...props,
                    middlename: e.target.value,
                  }))
                }
              />
            </article>
            <article className="whitespace-nowrap w-full flex flex-col items-center grow">
              <label
                htmlFor="last_name"
                id="last_name_Label"
                className="bg-bgprimary ml-4 z-2 w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
              >
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                id="last_name"
                value={userCredentials.lastname}
                className="border border-border rounded-md p-2 -mt-3 w-full"
                placeholder="Nigam"
                aria-required
                onChange={(e) =>
                  setUserCredentials((props) => ({
                    ...props,
                    lastname: e.target.value,
                  }))
                }
              />
            </article>
          </article>

          <article className="relative whitespace-nowrap flex flex-col justify-center w-full">
            <p
              id="roleLabel"
              className="bg-bgprimary ml-4 z-2 w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
            >
              Role
            </p>
            <div className="flex flex-wrap gap-3 border-border border -mt-3 rounded-md px-2 pt-5 pb-2">
              {userRole.map((cat) => (
                <label
                  key={cat.toLowerCase()}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="role"
                    value={cat.toLowerCase()}
                    required
                    onChange={(e) =>
                      setUserCredentials((prev) => ({
                        ...prev,
                        role: e.target.value,
                      }))
                    }
                    className="w-4 h-4 accent-red-600"
                  />
                  <span className="capitalize">{cat}</span>
                </label>
              ))}
            </div>
          </article>

          {/* email & password section */}
          <article className="whitespace-nowrap w-full flex flex-col items-center min-[480px]:flex-row min-[480px]:flex-nowrap min-[480px]:justify-between min-[480px]:items-center gap-4">
            {/* email */}
            <article className="whitespace-nowrap w-full flex flex-col items-center grow">
              <label
                htmlFor="email"
                id="email_Label"
                className="bg-bgprimary ml-4 z-2 w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={userCredentials.email}
                className="border border-border rounded-md p-2 -mt-3 w-full"
                placeholder="abc@gmail.com"
                aria-required
                onChange={(e) =>
                  setUserCredentials((props) => ({
                    ...props,
                    email: e.target.value,
                  }))
                }
              />
            </article>
            {/* password */}
            <article className="whitespace-nowrap w-full flex flex-col items-center grow">
              <label
                htmlFor="password"
                id="password_Label"
                className="bg-bgprimary ml-4 z-2 w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={userCredentials.password}
                className="border border-border rounded-md p-2 -mt-3 w-full"
                aria-required
                onChange={(e) =>
                  setUserCredentials((props) => ({
                    ...props,
                    password: e.target.value,
                  }))
                }
              />
            </article>
            {/* cnf password */}
            <article className="whitespace-nowrap w-full flex flex-col items-center grow">
              <label
                htmlFor="cnf_password"
                id="cnf_password_Label"
                className="bg-bgprimary ml-4 z-2 w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
              >
                Confirm Password
              </label>
              <div className="relative flex flex-nowrap -mt-3 w-full items-center">
                <input
                  type="text"
                  name="cnf_password"
                  id="cnf_password"
                  value={userCredentials.cnfPassword}
                  className="border border-border rounded-md p-2 w-full"
                  aria-required
                  onChange={(e) =>
                    setUserCredentials((props) => ({
                      ...props,
                      cnfPassword: e.target.value,
                    }))
                  }
                />
                {userCredentials.cnfPassword.length > 1 &&
                userCredentials.password === userCredentials.cnfPassword ? (
                  <small className="absolute flex items-center right-2 text-white font-extrabold bg-green-400 p-2 w-6 h-6 rounded-full z-3">
                    ✔
                  </small>
                ) : (
                  <small className="absolute flex items-center justify-center right-2 text-white font-extrabold bg-red-400 p-2 w-6 h-6 rounded-full z-3">
                    ✖
                  </small>
                )}
              </div>
            </article>
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
          <p>Sign Up</p>
          {loading && <p className="spinner"></p>}
        </button>
        <span className="text-center">
          Already have an account?{" "}
          <Link to={"/login"} className="text-primary font-semibold">
            Sign In
          </Link>
        </span>
      </article>
    </section>
  );
}
