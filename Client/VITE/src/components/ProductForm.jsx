import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/products";

const emptyForm = {
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
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
                const product = response.data;

                setForm({
                    name: product.name ?? "",
                    category: product.category ?? "",
                    price: product.price ?? "",
                    quantity: product.quantity ?? "",
                    description: product.description ?? "",
                });
                setError("");
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

        const productData = {
            name: form.name.trim(),
            category: form.category.trim(),
            price: Number(form.price),
            quantity: Number(form.quantity),
            description: form.description.trim(),
        };

        if (productData.name.length < 3) {
            setError("Name must be at least 3 characters.");
            return;
        }

        if (!productData.category) {
            setError("Category is required.");
            return;
        }

        if (!Number.isFinite(productData.price) || productData.price <= 0) {
            setError("Price must be greater than 0.");
            return;
        }

        if (!Number.isInteger(productData.quantity) || productData.quantity < 0) {
            setError("Quantity must be a whole number greater than or equal to 0.");
            return;
        }

        if (productData.description.length > 200) {
            setError("Description cannot exceed 200 characters.");
            return;
        }

        setSaving(true);

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

    if (loading) {
        return <p>Loading product...</p>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>{isEditing ? "Edit product" : "Add product"}</h1>

            <label>
                Name
                <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    minLength={3}
                    required
                />
            </label>

            <label>
                Category
                <input
                    name="category"
                    type="text"
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
                    min="0.01"
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

            <label>
                Description
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    maxLength={200}
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