import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/products";
const PAGE_SIZE = 5;

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await axios.get(API_URL, {
                    params: { search, category, page, limit: PAGE_SIZE },
                });

                setProducts(response.data.data);
                setTotalPages(Math.max(response.data.totalPages, 1));
            } catch (err) {
                setError(err.response?.data?.message || "Could not load products.");
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, [search, category, page]);

    useEffect(() => {
        axios
            .get(API_URL, { params: { limit: 100 } })
            .then((response) => {
                const allProducts = response.data.data;
                setCategories([...new Set(allProducts.map((item) => item.category))]);
            })
            .catch(() => {
                // The main list request displays API errors.
            });
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;

        try {
            await axios.delete(`${API_URL}/${id}`);
            setProducts((current) => current.filter((product) => product._id !== id));
        } catch (err) {
            setError(err.response?.data?.message || "Could not delete product.");
        }
    };

    return (
        <main>
            <h1>Products</h1>

            <button type="button" onClick={() => navigate("/product/new")}>
                Add product
            </button>

            <div>
                <label>
                    Search
                    <input
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(1);
                        }}
                        placeholder="Search by name"
                    />
                </label>

                <label>
                    Category
                    <select
                        value={category}
                        onChange={(event) => {
                            setCategory(event.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="">All categories</option>
                        {categories.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                </label>
            </div>

            {error && <p role="alert">{error}</p>}
            {loading && <p>Loading products...</p>}

            {!loading && !error && products.length === 0 && <p>No products found.</p>}

            <div className="product_disp">
                {products.map((product) => (
                    <article className="product_card" key={product._id}>
                        <h2>{product.name}</h2>
                        <p>Category: {product.category}</p>
                        <p>Price: {product.price}</p>
                        <p>
                            Quantity: {product.quantity}
                            {product.quantity < 5 && <strong> — Low Stock</strong>}
                        </p>
                        {product.description && <p>{product.description}</p>}

                        <button
                            type="button"
                            onClick={() => navigate(`/product/${product._id}/edit`)}
                        >
                            Edit
                        </button>
                        <button type="button" onClick={() => handleDelete(product._id)}>
                            Delete
                        </button>
                    </article>
                ))}
            </div>

            <div>
                <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((current) => current - 1)}
                >
                    Previous
                </button>
                <span> Page {page} of {totalPages} </span>
                <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((current) => current + 1)}
                >
                    Next
                </button>
            </div>
        </main>
    );
};

export default ProductList;