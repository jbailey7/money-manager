import { useTransactionContext } from "../contexts/TransactionContext";

const YearlyTotalsList = ({ years, years_total }) => {
  const { formatNumberWithCommas } = useTransactionContext();

  return (
    <table className="styled-table">
      <thead>
        <tr>
          <th>Year</th>
          <th>Spent</th>
          <th>Earned</th>
          <th>Invested</th>
          <th>Net</th>
          <th>Necessary %</th>
        </tr>
      </thead>
      <tbody>
        {years.map((year) => (
          <tr key={year.id}>
            <td>{year.year}</td>
            <td>${formatNumberWithCommas(year.spent)}</td>
            <td>${formatNumberWithCommas(year.earned)}</td>
            <td>${formatNumberWithCommas(year.invested)}</td>
            <td style={{ color: year.net < 0 ? "red" : "#009879" }}>
              {formatNumberWithCommas(year.net)}
            </td>
            <td>{year.necessary}%</td>
          </tr>
        ))}
        <tr>
          <td>TOTAL</td>
          <td>${formatNumberWithCommas(years_total.spent)}</td>
          <td>${formatNumberWithCommas(years_total.earned)}</td>
          <td>${formatNumberWithCommas(years_total.invested)}</td>
          <td>{formatNumberWithCommas(years_total.net)}</td>
          <td>{years_total.necessary}%</td>
        </tr>
      </tbody>
    </table>
  );
};

export default YearlyTotalsList;
