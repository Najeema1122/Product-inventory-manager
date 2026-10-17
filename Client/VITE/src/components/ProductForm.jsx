import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/products";

const emptyForm = {
    name: "",
    category: "",
    price: "",
    quantity: "",
};

const ProductForm = ({ mode }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = mode === "edit";

    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isEditing) {
            setForm(emptyForm);
            setLoading(false);
            return;
        }

        const getProduct = async () => {
            try {
                const response = await axios.get(`${API_URL}/${id}`);
                setForm({
                    name: response.data.name ?? "",
                    category: response.data.category ?? "",
                    price: response.data.price ?? "",
                    quantity: response.data.quantity ?? "",
                });
            } catch (err) {
                setError(err.response?.data?.message || "Could not load product.");
            } finally {
                setLoading(false);
            }
        };

        getProduct();
    }, [id, isEditing]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSaving(true);

        const productData = {
            ...form,
            price: Number(form.price),
            quantity: Number(form.quantity),
        };

        try {
            if (isEditing) {
                await axios.put(`${API_URL}/${id}`, productData);
            } else {
                await axios.post(API_URL, productData);
            }

            navigate("/products");
        } catch (err) {
            setError(err.response?.data?.message || "Could not save product.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading product...</p>;

    return (
        <form onSubmit={handleSubmit}>
            <h1>{isEditing ? "Edit product" : "Add product"}</h1>

            <label>
                Name
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Category
                <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Price
                <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Quantity
                <input
                    name="quantity"
                    type="number"
                    min="0"
                    step="1"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                />
            </label>

            {error && <p role="alert">{error}</p>}

            <button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save"}
            </button>

            <button
                type="button"
                onClick={() => navigate("/products")}
                disabled={saving}
            >
                Cancel
            </button>
        </form>
    );
};

export default ProductForm;