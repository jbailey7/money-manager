import CategoryByMonth from "../components/CategoryByMonth";
import CategoryByYear from "../components/CategoryByYear";
import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MonthByCategory from "../components/MonthByCategory";
import YearByCategory from "../components/YearByCategory";

function Dashboard() {
  const [dashboard, setDashboard] = useState("categoryByMonth");

  const handleChange = async (e) => {
    e.preventDefault();
    setDashboard(e.target.value);
  };

  return (
    <>
      <h1>Dashboard</h1>
      <p>Dashboard values are total amounts, not percentages</p>
      <br />
      <FormControl
        fullWidth
        style={{ marginLeft: "10px", paddingRight: "20px" }}
      >
        <InputLabel id="dashboardSelectionLabel" style={{ color: "white" }}>
          Which Dashboard?
        </InputLabel>
        <br />
        <Select
          labelId="dashobardSelectionLabel"
          id="dashboardSelect"
          value={dashboard}
          label="Dashboard"
          onChange={handleChange}
          style={{ outline: "2px solid white", color: "white" }}
        >
          <MenuItem value="categoryByMonth">Category by Month</MenuItem>
          <MenuItem value="categoryByYear">Category by Year</MenuItem>
          <MenuItem value="monthByCategory">Month by Category</MenuItem>
          <MenuItem value="yearByCategory">Year by Category</MenuItem>
        </Select>
      </FormControl>
      <br />
      <br />
      <div>
        {dashboard === "categoryByMonth" ? (
          <CategoryByMonth />
        ) : dashboard === "categoryByYear" ? (
          <CategoryByYear />
        ) : dashboard === "monthByCategory" ? (
          <MonthByCategory />
        ) : dashboard === "yearByCategory" ? (
          <YearByCategory />
        ) : (
          <p>Something has gone wrong</p>
        )}
      </div>
    </>
  );
}

export default Dashboard;
