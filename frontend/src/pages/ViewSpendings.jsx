import "../css/Modal.css";
import { useEffect } from "react";
import SpendingList from "../components/SpendingList";
import AddForm from "../components/AddForm";
import { useTransactionContext } from "../contexts/TransactionContext";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";

function ViewSpendings() {
  const {
    onTransactionUpdate,
    currentTransaction,
    isTransactionModalOpen,
    closeTransactionModal,
    openTransactionEditModal,
    MONTHS,
    years,
    fetchYears,
    necessary,
    setNecessary,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    month,
    setMonth,
    fetchFilterSpendings,
    categoryState,
    setCategoryState,
    filterYear,
    setFilterYear,
    filterSpendings,
    spendingAverage,
    spendingNumItems,
    totalSpending,
    groceries,
    apartment,
    investment,
    fooddelivery,
    foodpickup,
    goingout,
    transportation,
    travel,
    aesthetic,
    other,
    formatNumberWithCommas,
  } = useTransactionContext();

  const handleCategoryChange = (event) => {
    setCategoryState({
      ...categoryState,
      [event.target.name]: event.target.checked,
    });
  };

  useEffect(() => {
    fetchYears();
    fetchFilterSpendings();
    setMinPrice(0.0);
    setMaxPrice(0.0);
    setMonth("ALL");
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    fetchFilterSpendings();
  };

  const resetPage = async (e) => {
    location.reload();
  };

  return (
    <>
      <h1>View Spendings</h1>
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
          <div>
            <label htmlFor="necessary">Necessary: </label>
            <select
              name="necessary"
              id="necessary"
              value={necessary}
              onChange={(e) => setNecessary(e.target.value)}
            >
              <option value="ALL">ALL</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>
        <div>
          <Box sx={{ display: "flex" }}>
            <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
              <FormLabel component="legend" style={{ color: "white" }}>
                Categories
              </FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={groceries}
                      onChange={handleCategoryChange}
                      name="groceries"
                    />
                  }
                  label="Groceries"
                  labelPlacement="bottom"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={apartment}
                      onChange={handleCategoryChange}
                      name="apartment"
                    />
                  }
                  label="Apartment"
                  labelPlacement="bottom"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={investment}
                      onChange={handleCategoryChange}
                      name="investment"
                    />
                  }
                  label="Investment"
                  labelPlacement="bottom"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={fooddelivery}
                      onChange={handleCategoryChange}
                      name="fooddelivery"
                    />
                  }
                  label="Food Delivery"
                  labelPlacement="bottom"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={foodpickup}
                      onChange={handleCategoryChange}
                      name="foodpickup"
                    />
                  }
                  label="Food Pickup"
                  labelPlacement="bottom"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={goingout}
                      onChange={handleCategoryChange}
                      name="goingout"
                    />
                  }
                  label="Going Out"
                  labelPlacement="bottom"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={transportation}
                      onChange={handleCategoryChange}
                      name="transportation"
                    />
                  }
                  label="Transportation"
                  labelPlacement="bottom"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={travel}
                      onChange={handleCategoryChange}
                      name="travel"
                    />
                  }
                  label="Travel"
                  labelPlacement="bottom"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={aesthetic}
                      onChange={handleCategoryChange}
                      name="aesthetic"
                    />
                  }
                  label="Aesthetic"
                  labelPlacement="bottom"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={other}
                      onChange={handleCategoryChange}
                      name="other"
                    />
                  }
                  label="Other"
                  labelPlacement="bottom"
                />
              </FormGroup>
            </FormControl>
          </Box>
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
      <p>Total Spending: ${formatNumberWithCommas(totalSpending)}</p>
      <p>Number of Items: {formatNumberWithCommas(spendingNumItems)}</p>
      <p>Average Spending Amount: ${formatNumberWithCommas(spendingAverage)}</p>
      <SpendingList
        spendings={filterSpendings}
        updateSpending={openTransactionEditModal}
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

export default ViewSpendings;
