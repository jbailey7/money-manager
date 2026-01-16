import { toast } from "react-toastify";
import { useTransactionContext } from "../contexts/TransactionContext";
import "../css/TransactionList.css";

const IncomeList = ({ incomes, updateIncome, updateCallback }) => {
  const { formatNumberWithCommas } = useTransactionContext();

  const onDelete = async (id) => {
    try {
      const options = {
        method: "DELETE",
      };
      const response = await fetch(
        `/api/delete_income/${id}`,
        options
      );
      if (response.status == 200) {
        updateCallback();
        toast.success("Successfully deleted income");
      } else {
        console.error("Failed to delete income");
      }
    } catch (error) {
      toast.error("error deleting income");
    }
  };

  const formatDate = (date) => {
    return String(date).slice(-2);
  };

  return (
    <>
      {incomes ? (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>What</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((income) => (
              <tr key={income.id}>
                <td>
                  {income.date}/{formatDate(income.year)}
                </td>
                <td>${formatNumberWithCommas(income.amount)}</td>
                <td>{income.what}</td>
                <td>
                  <button onClick={() => updateIncome(income)}>Update</button>
                  <button onClick={() => onDelete(income.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No items to display.</p>
      )}
    </>
  );
};

export default IncomeList;
