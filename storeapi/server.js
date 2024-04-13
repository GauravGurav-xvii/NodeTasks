import express from 'express';
const app = express();
const port = process.env.PORT || 4000;
import mysql, { createPool } from 'mysql2/promise';
app.use(express.json());

const pool = mysql.createPool({ 
    host: 'localhost',
    user: 'root', 
    password: '',
    database: 'storedb' 
});

app.get("/api/products", async (req, res) => {

    try {
        const data = await pool.execute("SELECT * FROM products");
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

app.get("/api/products/:id", (req, res) => {
    const id = req.params.id;
    res.status(200).json("product id = " +id );
});

app.post("/api/products", (req, res) => {
    const product = req.body
    res.status(200).json(product);
});

app.put("/api/products/:id", (req, res) => {
    const product = req.body
    const id = req.params.id;
    product.id = id
    res.status(200).json(product);
});

app.delete("/api/products/:id", (req, res) => {
    const id = req.params.id;
    res.status(200).json("Delete product with id = " +id);
});

app.listen(port, () =>
  console.log("> Server is up and running on port : " + port)
);
