import { useState, useEffect, useRef } from "react";
import { useTransactionContext } from "../contexts/TransactionContext";
import { toast } from "react-toastify";

const AddForm = ({ existingTransaction = {}, updateCallback }) => {
  const updating = Object.entries(existingTransaction).length !== 0;
  const { currentYear, CATEGORIES } = useTransactionContext();

  const [date, setDate] = useState(existingTransaction.date || "");
  const [amount, setAmount] = useState(existingTransaction.amount || 0);
  const [what, setWhat] = useState(existingTransaction.what || "");
  const [category, setCategory] = useState(existingTransaction.category || "");
  const [necessary, setNecessary] = useState(
    existingTransaction.necessary || ""
  );
  const [year, setYear] = useState(existingTransaction.year || currentYear);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, [date]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = {
      date,
      amount,
      what,
      category,
      necessary,
      year,
    };

    const url =
      "/api/" +
      (updating
        ? `update_transaction/${existingTransaction.id}`
        : "add_transaction");
    const options = {
      method: updating ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, options);
    if (response.status !== 201 && response.status !== 200) {
      const data = await response.json();
      console.log(data.message);
      toast.error(data.message);
    } else {
      updateCallback();
      if (updating) {
        toast.success("Successfully updated transaction");
      } else {
        toast.success("Successfully added transaction");
      }
    }

    setDate("");
    setAmount(0.0);
    setWhat("");
    setCategory("");
    setNecessary("");
    setYear(currentYear);
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="date">Date: </label>
        <input
          type="text"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          ref={inputRef}
        />
      </div>
      <div>
        <label htmlFor="amount">Amount: </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="what">What: </label>
        <input
          type="text"
          id="what"
          value={what}
          onChange={(e) => setWhat(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="category">Category: </label>
        <select
          name="category"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((category) => (
            <option value={category} key={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="necessary">Necessary: </label>
        <select
          name="necessary"
          id="necessary"
          value={necessary}
          onChange={(e) => setNecessary(e.target.value)}
        >
          <option value=""></option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div>
        <label htmlFor="year">Year: </label>
        <input
          type="number"
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>
      <br />
      <button type="submit">{updating ? "Update" : "Create"}</button>
    </form>
  );
};

export default AddForm;
