import { Link } from "react-router-dom";
import "../css/NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/add" className="nav-link">
          Add
        </Link>
        <Link to="/view_incomes" className="nav-link">
          View Incomes
        </Link>
        <Link to="/view_spendings" className="nav-link">
          View Spendings
        </Link>
        <Link to="/monthly_totals" className="nav-link">
          Monthly Totals
        </Link>
        <Link to="/yearly_totals" className="nav-link">
          Yearly Totals
        </Link>
        <Link to="/averages" className="nav-link">
          Averages
        </Link>
        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>
        <Link to="/admin" className="nav-link">
          Admin
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
