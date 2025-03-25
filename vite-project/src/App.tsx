import { Link, NavLink } from "react-router";

const App = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="dashboard">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="user/1">User 1</NavLink>
          </li>
        </ul>
        <Link to="dashboard/settings">Go to Dashboard Settings</Link>
      </nav>
    </>
  );
};

export default App;