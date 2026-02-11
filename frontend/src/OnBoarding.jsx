import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function OnBoarding() {
  const data = useSelector((store) => store.user.userInfo);
  const navigate = useNavigate();
  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;
    if (data?.workspaceId?.isActive) {
      navigate("/", { replace: true });
    } else if (!data.workspaceId) {
      navigate("/create_workspace", { replace: true });
    }
  }, [data]);
  return (
    <section className="flex flex-col h-full justify-center items-center p-4">
      <article className="flex flex-col gap-4 p-4 rounded-xl border border-border">
        {data?.workspaceId?.onboarding &&
          Object.keys(data.workspaceId.onboarding).map((item, index) => (
            <div
              key={`onboarding/keys/${index}`}
              className="grid grid-cols-2 gap-8 text-xl"
            >
              <p>{item}</p>
              <p className="place-self-center">
                {data.workspaceId.onboarding[item] ? (
                  <button
                    disabled={true}
                    className="py-1 px-3 rounded-md text-base border bg-green-400 text-white font-bold"
                  >
                    Active
                  </button>
                ) : (
                  <button className="py-1 px-3 rounded-md text-base border bg-red-400 text-black font-bold">
                    InActive
                  </button>
                )}
              </p>
            </div>
          ))}
      </article>
    </section>
  );
}
