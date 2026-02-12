import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function OnBoarding() {
  const data = useSelector((store) => store.user.userInfo);
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState("");
  const serviceRouteMap = {
    emailSetup: "email",
    bookingSetup: "booking",
    availabilitySetup: "availability",
  };
  useEffect(() => {
    const path = location.pathname.split("/");
    const lastEle = path[path.length - 1];
    setSelected(lastEle);
  }, [location]);
  useEffect(() => {
    if (!data) return;
    if (!data.workspaceId) {
      navigate("/create_workspace", { replace: true });
    }
  }, [data, navigate]);

  if (!data || !data.workspaceId) return null;

  const { workspaceId } = data;
  const onboarding = workspaceId.onboarding || {};

  const completed = Object.values(onboarding).filter(Boolean).length;
  const total = Object.keys(onboarding).length;

  return (
    <section className="flex flex-col h-full p-6 gap-6">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Workspace Setup</h1>
        <p className="text-gray-500">
          {workspaceId.name} • {completed}/{total} completed
        </p>
      </header>

      {/* Warning banner */}
      {!workspaceId.isActive && (
        <div className="p-4 rounded-lg bg-yellow-100 text-red-500 border border-yellow-300">
          ⚠️ Your workspace is inactive. Complete setup to activate it.
        </div>
      )}

      {/* Setup list */}
      <article className="flex flex-col gap-4">
        {Object.entries(onboarding).map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between items-center p-4 border rounded-lg"
          >
            <div>
              <p className="font-semibold capitalize">
                {key.replace("_", " ")}
              </p>
              <p className="text-sm text-gray-500">
                {value ? "Configured" : "Not configured"}
              </p>
            </div>

            {value ? (
              <span className="px-3 py-1 text-sm bg-green-500 text-white rounded">
                Active
              </span>
            ) : (
              <button
                disabled={selected == serviceRouteMap[key]}
                className="px-4 py-1 text-sm bg-blue-600 text-white rounded"
                onClick={() =>
                  navigate(`/onboarding/setup/${serviceRouteMap[key]}`)
                }
              >
                Setup
              </button>
            )}
          </div>
        ))}
      </article>

      {/* particular setup */}
      <article className="flex flex-col bg-red-500 text-white">
        <Outlet />
      </article>
    </section>
  );
}
