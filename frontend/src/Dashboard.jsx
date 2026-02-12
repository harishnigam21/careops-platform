import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
      <article className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">Workspace Status</h2>
          <p
            className={workspaceId.isActive ? "text-green-600" : "text-red-600"}
          >
            {workspaceId.isActive ? "Active" : "Inactive"}
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">Services Active</h2>
          <p>{completed}</p>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">Total Services</h2>
          <p>{total}</p>
        </div>
      </article>

      {/* Create Booking CTA */}
      <article className="flex items-center justify-between gap-4 p-4 border rounded-lg">
        <h2 className="font-semibold text-2xl">Bookings</h2>

        {workspaceId.isActive ? (
          <div
            className="flex bg-blue-600 w-8 h-8 sm:w-fit sm:h-fit sm:rounded-md sm:py-2 sm:px-4 sm:gap-4 text-white rounded-full items-center justify-center overflow-hidden cursor-pointer"
            onClick={() => navigate("/booking/create")}
          >
            <span className="scale-200 mb-1">+</span>
            <span className={`hidden sm:flex`}>Create Booking</span>
          </div>
        ) : (
          <p className="text-sm text-red-500">
            Complete onboarding to create bookings
          </p>
        )}
      </article>
    </section>
  );
}
