import { useNavigate } from "react-router-dom";
import { RiRefreshLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { changeLoginStatus, newUser } from "../../store/Slices/userSlice";
import useApi from "../../hooks/Api";
export default function Refresh() {
  const { sendRequest } = useApi();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleRefresh = async () => {
    await sendRequest("refresh", "GET").then((result) => {
      if (result && result.success) {
        dispatch(newUser({ userInfo: result.data.userInfo }));
        dispatch(changeLoginStatus({ status: true }));
        window.localStorage.setItem("acTk", JSON.stringify(result.data.acTk));
        navigate("/", { replace: true });
      }
    });
  };
  return (
    <section className="w-full p-4 h-screen flex items-center justify-center">
      <article className="max-w-full flex-wrap sm:flex-nowrap flex justify-center gap-6 rounded-xl py-10 px-6 bg-bgprimary text-text border border-border">
        <div className="icon flex items-center">
          <RiRefreshLine className="text-9xl text-red-600" />
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl sm:text-4xl text-red-500 uppercase font-extrabold">
              Refresh Page
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-text">
              Its being a while you were not available.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="py-2 px-4 rounded-full uppercase text-text bg-red-500 icon font-medium"
              onClick={handleRefresh}
            >
              Refresh
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}
