import { useState, useEffect } from "react";
import YearlyTotalsList from "../components/YearlyTotalsList";
import { useTransactionContext } from "../contexts/TransactionContext";

function YearlyTotals() {
  const [yearsTotal, setYearsTotal] = useState({});

  const { fetchYears, years } = useTransactionContext();

  useEffect(() => {
    fetchYears();
    fetchYearsTotal();
  }, []);

  const fetchYearsTotal = async () => {
    const response = await fetch("/api/years_total");
    const data = await response.json();
    setYearsTotal(data.years_total);
  };

  return (
    <>
      <h1>Yearly Totals</h1>
      <YearlyTotalsList years={years} years_total={yearsTotal} />
    </>
  );
}

export default YearlyTotals;
