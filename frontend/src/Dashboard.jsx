import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Bookings from "./components/dashboard/Bookings";
import Status from "./components/dashboard/Status";

export default function Dashboard() {
  const data = useSelector((store) => store.user.userInfo);
  const navigate = useNavigate();

  useEffect(() => {
    if (data && !data.workspaceId) {
      navigate("/create_workspace", { replace: true });
    }
  }, [data, navigate]);
  if (!data || !data.workspaceId) return null;
  const { workspaceId } = data;
  const onboarding = workspaceId.onboarding || {};
  const completed = Object.values(onboarding).filter(Boolean).length;
  const total = Object.keys(onboarding).length;

  return (
    <section className="p-6 flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Welcome to {workspaceId.name}</h1>
        <p className="text-txlight">
          Onboarding Progress: {completed} / {total}
        </p>
      </header>

      {/* Warning Banner */}
      {!workspaceId.isActive && (
        <div className="p-4 bg-yellow-100 border border-yellow-300 text-red-500 rounded-lg">
          ⚠️ Your workspace is inactive. Complete setup to activate services.
          <button
            className="ml-4 px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => navigate("/onboarding")}
          >
            Complete Setup
          </button>
        </div>
      )}

      {/* Main dashboard content */}
      <Status
        completed={completed}
        total={completed}
        workspaceId={workspaceId}
      />

      {/* Create Booking CTA */}
      <Bookings workspaceId={workspaceId} />
    </section>
  );
}
