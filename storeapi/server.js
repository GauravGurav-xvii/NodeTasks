import express from "express";
const app = express();
const port = process.env.PORT || 4000;
import mysql, { createPool } from "mysql2/promise";
app.use(express.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "storedb",
});

// to get all products-----------------------------------------------------------------------------------------------
app.get("/api/products", async (req, res) => {
  try {
    const data = await pool.execute("SELECT * FROM products");
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//to get products as per ID ----------------------------------------------------------------------
app.get("/api/products/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await pool.execute("SELECT * FROM products WHERE id = ?", [
      id,
    ]);
    const rows = data[0];
    if (rows.length === 0) {
      res.status(400).json();
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//function to check all data entered or not---------------------------------------------
function isValidProduct(product) {
  let hasError = false;
  const errors = {};

  if (!product.name) {
    errors.name = "The name is required";
    hasError = true;
  }

  if (!product.brand) {
    errors.brand = "The brand is required";
    hasError = true;
  }

  if (!product.category) {
    errors.category = "The category is required";
    hasError = true;
  }

  if (!product.price || isNaN(product.price)) {
    errors.price = "The price is not valid";
    hasError = true;
  }

  if (!product.description) {
    errors.description = "The description is required";
    hasError = true;
  }
  return {hasError , errors}
}

//to post data------------------------------------------------------------------------------
app.post("/api/products", async(req, res) => {
  const product = req.body;
  
  try {
    const result = isValidProduct(product);
    if (result.hasError) {
        res.status(400).json(result.errors);
        return
    }
    const created_at = new Date().toISOString();
    let sql = "INSERT INTO products (name, brand, category, price, description, created_at) VALUES (?,?,?,?,?,?)";
    let values = [product.name, product.brand, product.category, product.price, product.description, created_at];
    let data = await pool.execute(sql , values);

    const id = data[0].insertId;
    data = await pool.execute("SELECT * FROM products WHERE id= ?", [id]);
    res.status(201).json(data[0][0]);

  } catch (error) {
    res.status(500).json({ message: error })
  }
});

app.put("/api/products/:id", async(req, res) => {
  const product = req.body;
  const id = req.params.id;

  try {
    const result = isValidProduct(product);
    if (result.hasError) {
        res.status(400).json(result.errors); 
        return
    }

    let sql = 'UPDATE products SET name=?, brand=?, category=?, price=?, description=? WHERE id=? ';
    let values = [product.name, product.brand, product.category, product.price, product.description, id];
    let data = await pool.execute(sql, values);

    if( data[0].affectedRows === 0){
        res.status(400).json();
        return
    }
    data = await pool.execute("SELECT * FROM products WHERE id=?", [id]);
    res.status(200).json(data[0][0]);

  } catch(error) {
    res.status(500).json({ message:error });
  }

});

app.delete("/api/products/:id", async(req, res) => {
  const id = req.params.id;
  
    try {
        const data = await pool.execute("DELETE FROM products WHERE id=?", [id]);

        if (data[0].affectedRows === 0) {
          res.status(400).json();
          return
        }
        res.status(200).json();

    } catch (error) {
      res.status(500).json({ message:error });
    }

});

app.listen(port, () =>
  console.log("> Server is up and running on port : " + port)
);
