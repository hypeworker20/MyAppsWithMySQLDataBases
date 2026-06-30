// Import required modules
const express = require('express');

// Create an Express application
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.static('css'));
const mysql = require('mysql2'); 


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '29112008',
    database: 'c237_supermarketapp'
});

connection.connect((err) => { 
    if (err) { 
        console.error('Error connecting to MySQL:', err); 
        return; 
    } 
    console.log('Connected to MySQL database'); 
}); 

// Define routes
app.get('/', (req, res) => {
  const sql = 'SELECT * FROM products';
  // Fetch data from MySQL
  connection.query( sql , (error, results) => {
    if (error) {
      console.error('Database query error:', error.message); 
      return res.send('Error Retrieving products'); 
    }
   // Render HTML page with data
   res.render('index', { products: results });
  });
});

app.get('/product', (req, res) => {
  const sql = 'SELECT * FROM products';
  // Fetch data from MySQL
  connection.query( sql , (error, results) => {
    if (error) {
      console.error('Database query error:', error.message); 
      return res.send('Error Retrieving products'); 
    }
   // Render HTML page with data
   res.render('product', { products: results });
  });
});


//L16
app.get('/product/:id', (req, res) => {
  const productID = req.params.id
  const sql = 'SELECT * FROM products WHERE productID = ?';
  // Fetch data from MySQL
  connection.query( sql , [productID], (error, results) => {
    if (error) {
      console.error('Database query error:', error.message); 
      return res.send('Error Retrieving products'); 
    }
    const result = results[0]
   // Render HTML page with data
   res.render('product', { product: result });
  }); 
});

app.get('/addProduct', (req, res) => {
    res.render('addProduct')
});

app.post('/addProduct', (req, res) => {
    const {name, quantity, price, image} = req.body;
    const sql = 'INSERT INTO products (productName, quantity, price, image) VALUES(?,?,?,?)'; // the insert into here is the column name, not the name of the html form field
  connection.query( sql , [name, quantity, price, image], (error, results) => {
    if (error) {
      console.error("Error adding product:", error);
      res.send('Error adding product');
    } else {
      res.redirect('/');
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});