import { FaCaretRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
export default function Status({ completed, total, workspaceId }) {
  const navigate = useNavigate();
  return (
    <article className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        title="View All"
        className=" border rounded-lg flex justify-between items-center overflow-hidden"
        onClick={() => navigate("/onboarding")}
      >
        <div className="flex p-4 flex-col">
          <h2 className="font-semibold">Workspace Status</h2>
          <p
            className={
              workspaceId.isActive
                ? "text-green-600 animate-pulse"
                : "text-red-600 animate-pulse"
            }
          >
            {workspaceId.isActive ? "Active" : "Inactive"}
          </p>
        </div>
        <div className="flex h-full items-center bg-amber-600 cursor-pointer">
          <FaCaretRight className="text-2xl" />
        </div>
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
  );
}
