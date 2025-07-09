// App.js
import React from "react";
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Navbar from "./components/Navbar";
import OrderForm from "./components/OrderForm";
import OrderList from "./components/OrderList";
import InventoryForm from "./components/InventoryForm";
import InventoryList from "./components/InventoryList";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<OrderForm />} />
                    <Route path="/orders" element={<OrderList />} />
                    <Route path="/inventory" element={<InventoryForm />} />
                    <Route path="/inventory-list" element={<InventoryList />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
