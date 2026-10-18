require("dotenv").config();
const dns = require("dns");
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
const productRoutes = require("./routes/productRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);

// JSON response for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

const startServer = async () => {
  try {
    await connectDb();

    app.listen(PORT, () => {
      console.log(`Backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Could not start server:", error.message);
    process.exit(1);
  }
};

startServer();