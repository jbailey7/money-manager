import { useEffect } from "react";
import { useTransactionContext } from "../contexts/TransactionContext";
import IncomeList from "../components/IncomeList";
import AddForm from "../components/AddForm";

function ViewIncomes() {
  const {
    currentYear,
    fetchFilterIncomes,
    openTransactionEditModal,
    onTransactionUpdate,
    isTransactionModalOpen,
    closeTransactionModal,
    currentTransaction,
    filterYear,
    setFilterYear,
    years,
    fetchYears,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    filterIncomes,
    incomeAverage,
    incomeNumItems,
    totalIncome,
    month,
    setMonth,
    MONTHS,
    formatNumberWithCommas,
  } = useTransactionContext();

  useEffect(() => {
    fetchFilterIncomes();
    fetchYears();
    setMinPrice(0.0);
    setMaxPrice(0.0);
    setMonth("ALL");
  }, []);

  const onSubmit = async (year) => {
    year.preventDefault();

    fetchFilterIncomes(currentYear);
  };

  const resetPage = async (e) => {
    location.reload();
  };

  return (
    <>
      <h1>View Incomes</h1>
      <br />
      <form>
        <div>
          <label htmlFor="year">Year: </label>
          <select
            name="year"
            id="year"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          >
            <option value="ALL">ALL</option>
            {years.map((year) => (
              <option value={year.year} key={year.year}>
                {year.year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="month">Month: </label>
          <select
            name="month"
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {MONTHS.map((month) => (
              <option value={month} key={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="year">Min Price: </label>
          <input
            type="number"
            id="minPrice"
            value={minPrice}
            onChange={(mp) => setMinPrice(mp.target.value)}
          />
        </div>
        <div>
          <label htmlFor="year">Max Price: </label>
          <input
            type="number"
            id="maxPrice"
            value={maxPrice}
            onChange={(mp) => setMaxPrice(mp.target.value)}
          />
        </div>
        <br />
        <button type="submit" onClick={onSubmit}>
          Filter
        </button>
        <button type="submit" onClick={resetPage}>
          Reset
        </button>
      </form>
      <br />
      <p>Total Income: ${formatNumberWithCommas(totalIncome)}</p>
      <p>Number of Items: {formatNumberWithCommas(incomeNumItems)}</p>
      <p>Average Income Amount: ${formatNumberWithCommas(incomeAverage)}</p>
      <IncomeList
        incomes={filterIncomes}
        updateIncome={openTransactionEditModal}
        updateCallback={onTransactionUpdate}
      />
      {isTransactionModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeTransactionModal}>
              &times;
            </span>
            <AddForm
              existingTransaction={currentTransaction}
              updateCallback={onTransactionUpdate}
            ></AddForm>
          </div>
        </div>
      )}
    </>
  );
}

export default ViewIncomes;
