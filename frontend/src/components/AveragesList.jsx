import { useState, useEffect } from "react";
import { useTransactionContext } from "../contexts/TransactionContext";

function AveragesList() {
  const [averages, setAverages] = useState([]);
  const [headers, setHeaders] = useState([]);
  const { formatNumberWithCommas } = useTransactionContext();

  useEffect(() => {
    fetchAverages();
    fetchHeaders();
  }, []);

  const fetchHeaders = async () => {
    const response = await fetch("/api/averages_headers");
    const data = await response.json();
    setHeaders(data.headers);
  };

  const fetchAverages = async () => {
    const response = await fetch("/api/category_averages");
    const data = await response.json();
    setAverages(data.averages);
  };

  return (
    <>
      <table className="styled-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {averages.map((averageList) => (
            <tr key={averageList["id"]}>
              {averageList["data"].map((average) => (
                <td key={average["id"]}>{formatNumberWithCommas(average["value"])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p>{averages["headers"]}</p>
    </>
  );
}

export default AveragesList;
