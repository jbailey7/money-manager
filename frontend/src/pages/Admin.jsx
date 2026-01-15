import AdminForm from "../components/AdminForm";

function Admin() {
  return (
    <>
      <h1>Admin</h1>
      <p>
        Recalculate button deletes month and year objects and recreates them.
        Use if totals get out of sync or need to be reset for any reason.
      </p>
      <br />
      <AdminForm></AdminForm>
    </>
  );
}

export default Admin;
