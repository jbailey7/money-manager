import { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const CategoryByYear = () => {
  const [catByYear, setCatByYear] = useState([]);

  useEffect(() => {
    fetchCatByYear();
  }, []);

  const fetchCatByYear = async () => {
    const response = await fetch("/api/category_by_year");
    const data = await response.json();
    setCatByYear(data.data);
  };

  return (
    <>
      <h3>Category By Year</h3>
      {catByYear.map((category) => (
        <div style={{ float: "left" }} key={category["category"]}>
          <h2>{category["category"]}</h2>
          <PieChart
            series={[
              {
                data: category["data"],
              },
            ]}
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

export default CategoryByYear;
