import { Routes, Route, Navigate } from "react-router-dom";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import Dashboard from "./components/Dashboard";

const App = () => (
    <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/new" element={<ProductForm mode="create" />} />
        <Route path="/product/:id/edit" element={<ProductForm mode="edit" />} />
    </Routes>
);

export default App;