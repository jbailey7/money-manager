import "../css/TransactionList.css";
import { useTransactionContext } from "../contexts/TransactionContext";
import { toast } from "react-toastify";

const SpendingList = ({ spendings, updateSpending, updateCallback }) => {
  const { formatNumberWithCommas } = useTransactionContext();

  const onDelete = async (id) => {
    try {
      const options = {
        method: "DELETE",
      };
      const response = await fetch(
        `http://127.0.0.1:5000/delete_spending/${id}`,
        options
      );
      if (response.status == 200) {
        updateCallback();
        toast.success("Successfully deleted spending");
      } else {
        console.error("Failed to delete spending");
      }
    } catch (error) {
      toast.error("error deleting spending");
    }
  };

  const formatDate = (date) => {
    return String(date).slice(-2);
  };

  return (
    <>
      {spendings ? (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>What</th>
              <th>Category</th>
              <th>Necessary</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {spendings.map((spending) => (
              <tr key={spending.id}>
                <td>
                  {spending.date}/{formatDate(spending.year)}
                </td>
                <td>${formatNumberWithCommas(spending.amount)}</td>
                <td>{spending.what}</td>
                <td>{spending.category}</td>
                <td>{spending.necessary}</td>
                <td>
                  <button onClick={() => updateSpending(spending)}>
                    Update
                  </button>
                  <button onClick={() => onDelete(spending.id)}>Delete</button>
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

export default SpendingList;
