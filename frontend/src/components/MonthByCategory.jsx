import { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import YearFilter from "./YearFilter";
import { useTransactionContext } from "../contexts/TransactionContext";

const MonthByCategory = () => {
  const [monthByCat, setMonthByCat] = useState([]);
  const { currentYear } = useTransactionContext();

  useEffect(() => {
    fetchMonthByCat();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    fetchMonthByCat();
  };

  const fetchMonthByCat = async () => {
    const response = await fetch(
      `/api/month_by_category/${currentYear}`
    );
    const data = await response.json();
    setMonthByCat(data.data);
  };

  return (
    <>
      <YearFilter onSubmit={onSubmit} />
      <br />
      <h3>Month by Category for {currentYear}</h3>
      {monthByCat.map((month) => (
        <div style={{ float: "left" }} key={month["month"]}>
          <h2>{month["month"]}</h2>
          <PieChart
            series={[{ data: month["data"] }]}
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

export default MonthByCategory;
