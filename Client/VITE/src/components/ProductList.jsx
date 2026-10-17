import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/products";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const getProducts = async () => {
        try {
            const response = await axios.get(API_URL);
            setProducts(response.data);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Could not load products.");
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setProducts((current) => current.filter((product) => product._id !== id));
        } catch (err) {
            setError(err.response?.data?.message || "Could not delete product.");
        }
    };

    return (
        <div>
            <h1>Products</h1>

            <button type="button" onClick={() => navigate("/product/new")}>
                Add product
            </button>

            {error && <p role="alert">{error}</p>}

            <div className="product_disp">
                {products.map((product) => (
                    <div className="product_card" key={product._id}>
                        <div className="name">{product.name}</div>
                        <div className="category">{product.category}</div>
                        <p>Price: {product.price}</p>
                        <p>Quantity: {product.quantity}</p>

                        <div className="button_section">
                            <button
                                type="button"
                                onClick={() => navigate(`/product/${product._id}/edit`)}
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(product._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;