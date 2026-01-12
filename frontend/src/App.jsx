import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Add from "./pages/Add";
import ViewSpendings from "./pages/ViewSpendings";
import MonthlyTotals from "./pages/MonthlyTotals";
import NavBar from "./components/NavBar";
import { TransactionProvider } from "./contexts/TransactionContext";
import YearlyTotals from "./pages/YearlyTotals";
import ViewIncomes from "./pages/ViewIncomes";
import { ToastContainer } from "react-toastify";
import Averages from "./pages/Averages";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <TransactionProvider>
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<Add />} />
            <Route path="/view_incomes" element={<ViewIncomes />} />
            <Route path="/view_spendings" element={<ViewSpendings />} />
            <Route path="/monthly_totals" element={<MonthlyTotals />} />
            <Route path="/yearly_totals" element={<YearlyTotals />} />
            <Route path="/averages" element={<Averages />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </TransactionProvider>
      <ToastContainer />
    </>
  );
}

export default App;
