import AveragesList from "../components/AveragesList";

function Averages() {
  return (
    <>
      <h1>Category Averages</h1>
      <p>The current month is not factored into the current year's averages.</p>
      <p>Overall average is the category total spending / total months. Total months is calculated by 12 months for a finished year + number of fully completed months for the current year.</p>
      <AveragesList />
    </>
  );
}

export default Averages;
