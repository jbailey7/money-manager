import { useState } from "react";
import { toast } from "react-toastify";

const MonthlyNoteForm = ({ existingMonth, updateCallback }) => {
  const [note, setNote] = useState(existingMonth.notes);

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = {
      note,
    };

    const url = `http://127.0.0.1:5000/update_month_note/${existingMonth.id}`;
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, options);
    if (response.status != 200) {
      const data = await response.json();
      console.log(data.message);
      toast.error("error upating note");
    } else {
      updateCallback();
      toast.success("Successfully updated note");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="note">Note: </label>
        <input
          type="text"
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ width: '100%' }} 
        />
      </div>
      <br />
      <button type="submit">Update</button>
    </form>
  );
};

export default MonthlyNoteForm;
