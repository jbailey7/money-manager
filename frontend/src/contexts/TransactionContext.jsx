import { createContext, useState, useContext, useEffect } from "react";

const TransactionContext = createContext();

export const useTransactionContext = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [currentTransaction, setCurrentTransaction] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [months, setMonths] = useState([]);
  const [currentMonth, setCurrentMonth] = useState([]);
  const [year, setYear] = useState([]);
  const [isMTModalOpen, setIsMTModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [years, setYears] = useState([]);
  const [month, setMonth] = useState("ALL");
  const [necessary, setNecessary] = useState("ALL");
  const [minPrice, setMinPrice] = useState("0.0");
  const [maxPrice, setMaxPrice] = useState("0.0");
  const [filterYear, setFilterYear] = useState("ALL");
  const [filterSpendings, setFilterSpendings] = useState([]);
  const [filterIncomes, setFilterIncomes] = useState([]);
  const [spendingAverage, setSpendingAverage] = useState(0.0);
  const [spendingNumItems, setSpendingNumItems] = useState(0);
  const [incomeAverage, setIncomeAverage] = useState(0.0);
  const [incomeNumItems, setIncomeNumItems] = useState(0.0);
  const [totalSpending, setTotalSpending] = useState(0.0);
  const [totalIncome, setTotalIncome] = useState(0.0);
  const [categoryState, setCategoryState] = useState({
    groceries: true,
    apartment: true,
    investment: true,
    fooddelivery: true,
    foodpickup: true,
    goingout: true,
    transportation: true,
    travel: true,
    aesthetic: true,
    other: true,
  });

  useEffect(() => {
    fetchMonths();
    fetchFilterIncomes();
    fetchFilterSpendings();
  }, []);

  const CATEGORIES = [
    "",
    "Groceries",
    "Apartment",
    "Investment",
    "Food Delivery",
    "Food Pickup",
    "Going Out",
    "Transportation",
    "Travel",
    "Aesthetic",
    "Other",
  ];

  const MONTHS = [
    "ALL",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const {
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
  } = categoryState;

  const onTransactionUpdate = () => {
    closeTransactionModal();
    fetchFilterIncomes(currentYear);
    fetchMonths(currentYear);
    fetchFilterSpendings();
  };

  const onMTUpdate = (currentYear) => {
    closeMTModal();
    fetchMonths(currentYear);
  };

  const closeTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setCurrentTransaction({});
  };

  const closeMTModal = () => {
    setIsMTModalOpen(false);
    setCurrentMonth({});
  };

  const openTransactionEditModal = (transaction) => {
    if (isTransactionModalOpen) return;
    setCurrentTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const openMTEditModal = (month) => {
    if (isMTModalOpen) return;
    setCurrentMonth(month);
    setIsMTModalOpen(true);
  };

  const fetchFilterIncomes = async () => {
    const response = await fetch(
      `/api/incomes/${filterYear}/${month}/${minPrice}/${maxPrice}`
    );
    const data = await response.json();
    setFilterIncomes(data.res);
    setIncomeAverage(data.average);
    setIncomeNumItems(data.num_items);
    setTotalIncome(data.total_income);
  };

  const fetchMonths = async () => {
    const response = await fetch(`/api/months/${currentYear}`);
    const data = await response.json();
    setMonths(data.months);
  };

  const fetchFilterSpendings = async () => {
    let filterCategories = [];
    if (groceries) {
      filterCategories.push("Groceries");
    }
    if (apartment) {
      filterCategories.push("Apartment");
    }
    if (investment) {
      filterCategories.push("Investment");
    }
    if (fooddelivery) {
      filterCategories.push("Food Delivery");
    }
    if (foodpickup) {
      filterCategories.push("Food Pickup");
    }
    if (goingout) {
      filterCategories.push("Going Out");
    }
    if (transportation) {
      filterCategories.push("Transportation");
    }
    if (travel) {
      filterCategories.push("Travel");
    }
    if (aesthetic) {
      filterCategories.push("Aesthetic");
    }
    if (other) {
      filterCategories.push("Other");
    }
    const response = await fetch(
      `/api/spendings/${filterYear}/${month}/${filterCategories.join()}/${necessary}/${minPrice}/${maxPrice}`
    );
    const data = await response.json();
    setFilterSpendings(data.res);
    setSpendingAverage(data.average);
    setSpendingNumItems(data.num_items);
    setTotalSpending(data.total_spending);
  };

  const fetchYear = async () => {
    const response = await fetch(
      `/api/yearly_total/${currentYear}`
    );
    const data = await response.json();
    setYear(data.year);
  };

  const fetchYears = async () => {
    const response = await fetch("/api/years");
    const data = await response.json();
    setYears(data.years);
  };

  function formatNumberWithCommas(number) {
    if (isNaN(number)) {
      return number
    }
    return parseFloat(number).toLocaleString();
  }

  const value = {
    currentTransaction,
    currentYear,
    setCurrentYear,
    months,
    currentMonth,
    year,
    isMTModalOpen,
    setIsMTModalOpen,
    isTransactionModalOpen,
    setIsTransactionModalOpen,
    years,
    setYears,
    month,
    setMonth,
    necessary,
    setNecessary,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    filterYear,
    setFilterYear,
    filterSpendings,
    filterIncomes,
    spendingAverage,
    spendingNumItems,
    incomeAverage,
    incomeNumItems,
    totalSpending,
    totalIncome,
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
    categoryState,
    setCategoryState,
    CATEGORIES,
    MONTHS,
    onTransactionUpdate,
    onMTUpdate,
    closeTransactionModal,
    closeMTModal,
    openTransactionEditModal,
    openMTEditModal,
    fetchFilterIncomes,
    fetchMonths,
    fetchFilterSpendings,
    fetchYear,
    fetchYears,
    formatNumberWithCommas
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
