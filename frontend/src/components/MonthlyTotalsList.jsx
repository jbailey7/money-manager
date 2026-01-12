import { useTransactionContext } from "../contexts/TransactionContext";

const MonthlyTotalsList = ({ months, year, updateMonth }) => {
  const { formatNumberWithCommas } = useTransactionContext();

  return (
    <>
      {months ? (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Spent</th>
              <th>Earned</th>
              <th>Invested</th>
              <th>Net</th>
              <th>Necessary %</th>
              <th>Notes</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {months.map((month) => (
              <tr key={month.id}>
                <td style={{ fontWeight: "bold" }}>{month.name}</td>
                <td>${formatNumberWithCommas(month.spent)}</td>
                <td>${formatNumberWithCommas(month.earned)}</td>
                <td>${formatNumberWithCommas(month.invested)}</td>
                <td style={{ color: month.net < 0 ? "red" : "#009879" }}>
                  {formatNumberWithCommas(month.net)}
                </td>
                <td>
                  {month.necessary}%
                </td>
                <td>{month.notes}</td>
                <td>
                  <button onClick={() => updateMonth(month)}>
                    Update Note
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td style={{ fontWeight: "bold" }}>TOTAL</td>
              <td>${formatNumberWithCommas(year.spent)}</td>
              <td>${formatNumberWithCommas(year.earned)}</td>
              <td>${formatNumberWithCommas(year.invested)}</td>
              <td style={{ color: year.net < 0 ? "red" : "#009879" }}>
                {formatNumberWithCommas(year.net)}
              </td>
              <td>{year.necessary}%</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No items to display</p>
      )}
    </>
  );
};

export default MonthlyTotalsList;
