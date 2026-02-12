import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/Api";
import { updateWorkSpace } from "../../store/Slices/userSlice";

export default function Availability() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sendRequest, loading } = useApi();

  const workspaceId = useSelector(
    (store) => store.user.userInfo?.workspaceId?._id,
  );

  const [error, setError] = useState(null);

  const handleActivate = async () => {
    if (!workspaceId) return;

    const res = await sendRequest(
      `service/${workspaceId}/availability`,
      "PATCH",
    );

    if (res?.success) {
      dispatch(updateWorkSpace({ data: res.data.data }));
      res.data.data.isActive
        ? navigate("/", { replace: true })
        : navigate("/onboarding", { replace: true });
    } else {
      setError(res?.error || "Failed to activate availability");
    }
  };

  return (
    <section className="p-6 border rounded-lg flex flex-col gap-4">
      <h2 className="text-xl font-bold">Availability Setup</h2>

      <p className="text-gray-600">
        Enable availability scheduling for bookings.
      </p>

      {error && <p className="text-red-500">{error}</p>}

      <button
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded w-fit flex gap-4 items-center"
        onClick={handleActivate}
      >
        <p>Activate Availability</p>
        {loading && <p className="spinner"></p>}
      </button>
    </section>
  );
}
