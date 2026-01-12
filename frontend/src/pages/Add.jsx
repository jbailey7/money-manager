import AddForm from "../components/AddForm";
import { useTransactionContext } from "../contexts/TransactionContext";

function Add() {
  const { currentTransaction, onTransactionUpdate } = useTransactionContext();

  return (
    <>
      <h1>Add Transaction</h1>
      <br />
      <AddForm
        existingTransaction={currentTransaction}
        updateCallback={onTransactionUpdate}
      ></AddForm>
    </>
  );
}

export default Add;
