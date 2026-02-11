import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeLoginStatus, newUser } from "./store/Slices/userSlice";
import useApi from "./hooks/Api";
import { useEffect } from "react";
import Loading from "./components/Loading";
export default function App() {
  const { loading, sendRequest } = useApi();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user.userInfo);
  
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
  return loading ? (
    <div className="w-screen h-screen flex justify-center items-center">
      <Loading />
    </div>
  ) : (
    <main className="flex flex-col w-full h-screen overflow-auto">
      <Outlet />
    </main>
  );
}
