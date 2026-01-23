import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Portfolio": Portfolio,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};