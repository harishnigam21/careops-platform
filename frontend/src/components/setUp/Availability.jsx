import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/Api";
import { updateWorkSpace } from "../../store/Slices/userSlice";

export default function Availability() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sendRequest, loading } = useApi();
  const weekDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const [days, setDays] = useState([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [slotDuration, setSlotDuration] = useState(30);

  const workspaceId = useSelector(
    (store) => store.user.userInfo?.workspaceId?._id,
  );
  const [error, setError] = useState(null);
  const toggleDay = (day) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleActivate = async () => {
    if (!workspaceId) return;
    const res = await sendRequest(
      `workspace/${workspaceId}/availability`,
      "PATCH",
      {
        days,
        startTime,
        endTime,
        slotDuration: Number(slotDuration),
      },
    );

    if (res?.success) {
      dispatch(updateWorkSpace({ data: res.data.data }));

      res.data.data.isActive
        ? navigate("/", { replace: true })
        : navigate("/onboarding", { replace: true });
    } else {
      setError(res?.error || "Failed to save availability");
    }
  };

  return (
    <section className="p-6 border rounded-lg flex flex-col gap-4">
      <h2 className="text-xl font-bold">Availability Setup</h2>

      <div>
        <p className="mb-2 font-medium">Working Days</p>
        <div className="flex gap-2 flex-wrap">
          {weekDays.map((day) => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`px-3 py-1 border rounded
            ${days.includes(day) ? "bg-blue-600 text-white" : "bg-border/10 text-text"}`}
            >
              {day.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block">Start Time</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      <div>
        <label className="block">End Time</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      <div>
        <label className="block">Slot Duration (minutes)</label>
        <input
          type="number"
          value={slotDuration}
          onChange={(e) => setSlotDuration(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded w-fit flex gap-4 items-center"
        onClick={handleActivate}
      >
        <p>Save Availability</p>
        {loading && <p className="spinner"></p>}
      </button>
    </section>
  );
}
