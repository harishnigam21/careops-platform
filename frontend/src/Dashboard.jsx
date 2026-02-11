import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const data = useSelector((store) => store.user.userInfo);
  const navigate = useNavigate();
  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;
    if (!data?.workspaceId?.isActive) {
      navigate("/onboarding", { replace: true });
    }
  }, [data]);
  return <div>Dashboard</div>;
}
