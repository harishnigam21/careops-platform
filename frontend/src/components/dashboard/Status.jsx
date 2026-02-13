export default function Status({ completed, total, workspaceId }) {
  return (
    <article className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 border rounded-lg">
        <h2 className="font-semibold">Workspace Status</h2>
        <p className={workspaceId.isActive ? "text-green-600 animate-pulse" : "text-red-600 animate-pulse"}>
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
  );
}
