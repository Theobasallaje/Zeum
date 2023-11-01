import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Scene } from "./components/Scene";
import { Home } from "./components/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const App = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/Zeum" element={<Home />} />
                    <Route path="/Zeum/:eventId" element={<Scene />} />
                </Routes>
            </Router>

            <ToastContainer />
        </>
    );
};
