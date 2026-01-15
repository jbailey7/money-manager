import { useTransactionContext } from "../contexts/TransactionContext";
import { useEffect } from "react";

function YearFilter({ onSubmit }) {
  const { currentYear, setCurrentYear, years, fetchYears } =
    useTransactionContext();

  useEffect(() => {
    fetchYears();
  }, []);

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="year">Year: </label>
        <select
          name="year"
          id="year"
          value={currentYear}
          onChange={(e) => setCurrentYear(e.target.value)}
        >
          {years.map((year) => (
            <option value={year.year} key={year.year}>
              {year.year}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Filter</button>
    </form>
  );
}

export default YearFilter;
