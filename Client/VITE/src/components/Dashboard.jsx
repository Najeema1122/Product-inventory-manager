import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await axios.get(API_URL, {
                    params: { page: 1, limit: 100 },
                });

                setProducts(response.data.data ?? []);
            } catch (err) {
                setError(
                    err.response?.data?.message || "Could not load dashboard data."
                );
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, []);

    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p role="alert">{error}</p>;

    const totalQuantity = products.reduce(
        (total, product) => total + Number(product.quantity || 0),
        0
    );

    const lowStockProducts = products.filter(
        (product) => Number(product.quantity) < 5
    );

    return (
        <main>
            <h1>Dashboard</h1>

            <section className="dashboard_stats">
                <article>
                    <h2>Total Products</h2>
                    <p>{products.length}</p>
                </article>

                <article>
                    <h2>Total Items in Stock</h2>
                    <p>{totalQuantity}</p>
                </article>

                <article>
                    <h2>Low Stock Products</h2>
                    <p>{lowStockProducts.length}</p>
                </article>
            </section>

            <section>
                <h2>Low Stock</h2>

                {lowStockProducts.length === 0 ? (
                    <p>No products are low in stock.</p>
                ) : (
                    <ul>
                        {lowStockProducts.map((product) => (
                            <li key={product._id}>
                                {product.name} — {product.quantity} remaining
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
};

export default Dashboard;