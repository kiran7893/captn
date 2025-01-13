import { useAuth } from "../../context/AuthContext";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div>{user.role === "admin" ? <AdminDashboard /> : <UserDashboard />}</div>
  );
}

export default Dashboard;
