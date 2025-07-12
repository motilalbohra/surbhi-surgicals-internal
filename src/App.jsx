// App.js
import React, {useEffect} from "react";
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Capacitor} from "@capacitor/core";
import {StatusBar, Style} from "@capacitor/status-bar";

import Navbar from "./components/Navbar";
import OrderForm from "./components/OrderForm";
import OrderList from "./components/OrderList";
import InventoryForm from "./components/InventoryForm";
import InventoryList from "./components/InventoryList";

function App() {
    useEffect(() => {
        if (Capacitor.getPlatform() === "android") {
            StatusBar.setOverlaysWebView({overlay: false}); // Key line to prevent notch overlay
            StatusBar.setStyle({style: Style.Dark}); // Optional: Light if using dark background
        }
    }, []);
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
