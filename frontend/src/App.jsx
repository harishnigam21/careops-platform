import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import { useDispatch } from "react-redux";
import { changeLoginStatus, newUser } from "./store/Slices/userSlice";
import useApi from "./hooks/Api";
import { useEffect } from "react";
export default function App() {
  const { sendRequest } = useApi();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //getting userInfo at every refresh and assigning new access token to local storage and userInfo to redux store
  useEffect(() => {
    sendRequest("refresh", "GET").then((result) => {
      if (result && result.success) {
        dispatch(newUser({ userInfo: result.data.userInfo }));
        dispatch(changeLoginStatus({ status: true }));
        window.localStorage.setItem("acTk", JSON.stringify(result.data.acTk));
      }
    });
  }, [dispatch, navigate, sendRequest]);
  return (
    <main className="flex flex-col bg-black">
      <Dashboard />
    </main>
  );
}
