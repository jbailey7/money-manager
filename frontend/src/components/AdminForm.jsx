import { toast } from "react-toastify";

const AdminForm = () => {
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const options = {
        method: "DELETE",
      };
      const response = await fetch(
        "/api/delete_months",
        options
      );
      if (response.status == 200) {
        toast.success("Successfully deleted months");
      } else {
        console.error("failed deleting month objects");
      }
    } catch (error) {
      toast.error("error deleting months");
    }

    try {
      const options = {
        method: "DELETE",
      };
      const response = await fetch(
        "/api/delete_years",
        options
      );
      if (response.status == 200) {
        toast.success("Successfully deleted years");
      } else {
        console.error("failed deleting year objects");
      }
    } catch (error) {
      toast.error("error deleting years");
    }

    const response = await fetch("/api/recreate_totals");
    if (response.status == 200) {
      toast.success("Successfully recreated month and year objects");
    } else {
      console.error("failed recreating month objects");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Recalculate</button>
    </form>
  );
};

export default AdminForm;
