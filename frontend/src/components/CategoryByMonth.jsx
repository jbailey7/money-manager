import { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useTransactionContext } from "../contexts/TransactionContext";
import YearFilter from "./YearFilter";

const CategoryByMonth = () => {
  const [catByMonth, setCatByMonth] = useState([]);
  const { currentYear } = useTransactionContext();

  useEffect(() => {
    fetchCatByMonth();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    fetchCatByMonth();
  };

  const fetchCatByMonth = async () => {
    const response = await fetch(
      `/api/category_by_month/${currentYear}`
    );
    const data = await response.json();
    setCatByMonth(data.data);
  };

  return (
    <>
      <YearFilter onSubmit={onSubmit} />
      <br />
      <h3>Category By Month for {currentYear}</h3>
      {catByMonth.map((category) => (
        <div style={{ float: "left" }} key={category["category"]}>
          <h2>{category["category"]}</h2>
          <PieChart
            series={[
              {
                data: category["data"],
                labelStyle: {
                  fill: "white",
                  fontSize: 12,
                },
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

export default CategoryByMonth;
