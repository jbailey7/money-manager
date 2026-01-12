import { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const YearByCategory = () => {
  const [yearByCat, setYearByCat] = useState([]);

  useEffect(() => {
    fetchYearByCat();
  }, []);

  const fetchYearByCat = async () => {
    const response = await fetch("http://127.0.0.1:5000/year_by_category");
    const data = await response.json();
    setYearByCat(data.data);
  };

  return (
    <>
      <h3>Year by Category</h3>
      {yearByCat.map((year) => (
        <div style={{ float: "left" }} key={year["year"]}>
          <h2>{year["year"]}</h2>
          <PieChart
            className="changeColor"
            series={[{ data: year["data"], color: "#blue" }]}
            width={600}
            height={400}
            slotProps={{
              legend: {
                labelStyle: {
                  fontSize: 14,
                  fill: "white",
                },
              },
            }}
          />
        </div>
      ))}
    </>
  );
};

export default YearByCategory;
