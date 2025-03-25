import { Outlet } from "react-router";

const Dashboard = () => {
  return (
    <>
      <h1>Dashboard</h1>
      <Outlet />
    </>
  );
};

export default Dashboard;
