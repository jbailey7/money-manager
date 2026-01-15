# money-manager

This project is a full-stack personal finance application featuring a Python Flask API and a React frontend. The backend uses SQLAlchemy to manage persistent financial data, while the frontend presents clear visualizations of spending behavior. I built this application to gain deeper insight into my personal spending habits and improve financial decision-making.

To protect the privacy of my personal financial data, I keep my actual spending records in a separate private repository. This public repository contains made-up sample data designed to demonstrate the application’s full functionality. Users are welcome to add, update, or delete entries to explore the system’s features and workflows.

To show how the application works in practice, the following sections provide a brief walkthrough of each of the nine tabs:

### Home
The Home page is the application's landing page. It simply outlines the 10 spending categories, which are used when creating a spending transaction and further explained in the Add section. 

![Home Page](<images/Home.png>)

### Add
The Add page allows users to record a new transaction in the database. It contains six input fields:

**Date** (required): The date the transaction occurred
**Amount** (required): The transaction amount
**What** (required): A brief description of the transaction
**Category**: One of ten predefined spending categories, selected from a dropdown
**Necessary**: A yes/no dropdown indicating whether the transaction was necessary
**Year** (required): The transaction year, which defaults to the current year

![Add Page](<images/Add.png>)

A single form is used to handle both income and spending transactions. The transaction type is inferred from the fields provided: income entries require only the four core fields, while spending entries include all six.

The Category and Necessary fields are specific to spending—income does not belong to a category and cannot be unnecessary. Submitting a form with Date, Amount, What, and Year creates an income transaction. Submitting all six fields creates a spending transaction. Any other combination of fields is considered invalid and results in an error.

After submission, a popup notification informs the user whether the transaction was created successfully.

### View Incomes

The View Incomes page displays all income transactions and provides flexible filtering options. Incomes can be filtered by year, month, minimum amount, maximum amount, or any combination of these criteria.

For the active filter, the page dynamically updates and displays summary statistics, including the total dollar amount, number of transactions, and average transaction value. Below this summary, individual income entries are listed in reverse chronological order, with each entry showing the date, amount, and description.

![Income Page](<images/Income.png>)

Each income entry includes an Update button that opens a popup allowing the transaction to be edited. Any changes are saved to the database and are immediately reflected in all calculated totals throughout the application.

Users also have the option to delete an income entry, which similarly updates the database and recalculates all affected totals.

![Income Update](<images/EditIncome.png>)

### View Spendings

The View Spendings page follows the same layout and functionality as the View Incomes page, with two additional filters specific to spending transactions: Category and Necessary.

The Necessary filter offers three options — All, Yes, or No — while the Category filter uses a checkbox group, allowing users to narrow results to one or more selected spending categories.

![Spending Page](<images/Spending.png>)

### Monthly Totals

The Monthly Totals page provides a month-by-month financial summary for a selected year. The year can be chosen from a dropdown at the top, which includes every year with recorded transactions.

For each month, the table displays the total Spent, Earned, and Invested, along with the Net result for the month. The net value is color-coded—green for profitable months and red for unprofitable ones. The table also includes a Necessary % column, indicating what portion of total monthly spending was classified as necessary.

A Notes column allows users to record contextual information for each month, such as large purchases or unexpected income. At the bottom of the table, yearly totals are shown for each column to provide a high-level annual summary.

![Monthly Totals Page](<images/MonthlyTotals.png>)

### Yearly Totals

The Yearly Totals page mirrors the structure of the Monthly Totals view but aggregates data at the yearly level. It provides a high-level overview of spending, income, and investment trends over time, allowing users to quickly assess how their financial habits and outcomes have evolved from year to year.

![Yearly Totals Page](<images/YearlyTotals.png>)

### Averages

The Averages page calculates average spending by category for a selected year as well as an overall average for each category across all available years.

To ensure accuracy and comparability, all averages are calculated using only complete months of data. Spending from the current month is excluded, and if the current month is January, the current year is omitted entirely since it contains no full months.

Overall category averages are computed by dividing total spending in that category by the total number of complete months observed across all years. This complete-month requirement prevents partial data from distorting results—for example, avoiding the appearance of reduced average spending simply because a month has just begun.

![Averages Page](<images/CategoryAverages.png>)


### Dashboard

The Dashboard page contains four distinct dashboards designed to visualize spending patterns across categories, months, and years. Each dashboard presents a collection of pie charts, with one chart per category, month, or year depending on the selected view, enabling intuitive comparison across different time granularities.

Pie chart segments can be hovered to display exact dollar amounts. Color assignments are consistent across all dashboards: the same color always represents the same category or month, allowing users to easily track patterns and compare distributions across views.

**Category by Month**: This dashboard displays one pie chart per spending category, showing how that category’s total spending is distributed by month within a selected year. A year selector at the top of the page allows users to compare monthly spending patterns for each category across different years.

![Category by Month](<images/CategoryByMonth.png>)

**Category by Year**: This dashboard also presents one pie chart per spending category, but instead of a monthly breakdown, it shows how spending in each category is distributed across years, highlighting long-term category trends.

![Category by Year](<images/CategoryByYear.png>)

**Month by Category**: This dashboard displays one pie chart for each month in a selected year, illustrating how total spending for that month is distributed across categories. The year can be selected using the dropdown at the top of the page.

![Month by Category](<images/MonthByCategory.png>)

**Year by Category**: This dashboard displays one pie chart per year, showing how total annual spending is distributed by category, providing a high-level view of how spending composition changes over time.

![Year by Category](<images/YearByCategory.png>)

### Admin

This page was primarily used during testing but is retained for maintenance and recovery purposes. It deletes all existing month and year aggregate records in the database and rebuilds them by reprocessing all income and spending transactions.

This reset mechanism ensures that aggregate totals remain consistent and can be used to correct discrepancies if derived data becomes unbalanced. Under normal operation, the page is not required and is intended for use only when making structural or logic changes to the application.


# Usage
