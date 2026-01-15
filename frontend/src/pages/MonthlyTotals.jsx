import "../css/Modal.css";
import { useEffect } from "react";
import MonthlyTotalsList from "../components/MonthlyTotalsList";
import MonthlyNoteForm from "../components/MonthlyNoteForm";
import { useTransactionContext } from "../contexts/TransactionContext";
import YearFilter from "../components/YearFilter";

function MonthlyTotals() {
  const {
    currentYear,
    isMTModalOpen,
    closeMTModal,
    openMTEditModal,
    onMTUpdate,
    currentMonth,
    months,
    fetchMonths,
    fetchYear,
    year,
  } = useTransactionContext();

  useEffect(() => {
    fetchMonths();
    fetchYear();
  }, []);

  const onSubmitYear = async (e) => {
    e.preventDefault();
    fetchMonths(currentYear);
    fetchYear(currentYear);
  };

  return (
    <>
      <h1>Monthly Totals</h1>
      <br />
      <YearFilter onSubmit={onSubmitYear} />
      <MonthlyTotalsList
        months={months}
        year={year}
        updateMonth={openMTEditModal}
        updateCallback={onMTUpdate}
      />
      {isMTModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeMTModal}>
              &times;
            </span>
            <MonthlyNoteForm
              existingMonth={currentMonth}
              updateCallback={onMTUpdate}
            ></MonthlyNoteForm>
          </div>
        </div>
      )}
    </>
  );
}

export default MonthlyTotals;
