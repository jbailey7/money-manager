# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


# Dev Notes
- `npm install` will install all the dependencies listed in the package.json file
- All the dependencies are installed in node_modules folder
- React code gets injected in index.html (in the `root` div)
- in main.jsx file, we are searching for root div (located in index.html) and we are injecting our content in that element
- There is an issue with "Maximum update depth exceeded" error being triggered by moving mouse over Dashboard PieCharts. This is an issue with the PieCharts themselves, not the implementation. 

# To Run
`npm run dev` from frontend directory
- Has "hot reload" which means that every time changes are saved, changes are updated if application is running