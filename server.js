const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT;
const HOST = process.env.HOST; 
const USERNAME = process.env.USERNAME; 
const PASSWORD = process.env.PASSWORD; 
const DATABASE = process.env.DATABASE; 


app.use(express.json());

const connection = mysql.createConnection({
    host: HOST,
    user: USERNAME,
    password: PASSWORD,
    database: DATABASE
});


connection.connect(err => {
    if (err) {
        console.log("ERROR CONNECTING!");
        return; 
    }
    console.log("Connection established!");
});


app.get('/cab', (req, res) => {
    connection.query('select * from cab', (err, results) => {
        if (err) 
            return res.status(500).send({ message: 'Error!' });
        if (results.length === 0)
            return res.status(204).send("NO CONTENT");
        res.status(200).send(results);
    });
});


app.get('/cab/:id', (req, res) => {
    const id = req.params.id;

    connection.query('SELECT * FROM cab WHERE id = ?', [id], (err, results) => {
        if (err)
            return res.status(500).send({ message: 'Internal server error' }); 

        if (results.length === 0)
            return res.status(404).send({ error: `Cab with ID ${id} not found` });
        
        res.status(200).send(results[0]);
    });
});



app.post('/cab', (req, res) => {
    const {model, brand, year, color, license_plate, driver_name, driver_contact, capacity, is_available} = req.body; 

    connection.query('insert into cab (model, brand, year, color, license_plate, driver_name, driver_contact, capacity, is_available) values (?, ?, ?, ?, ?, ?, ?, ?, ?)', [model, brand, year, color, license_plate, driver_name, driver_contact, capacity, is_available], (err, _) => {
        if (err) 
            return res.status(400).json({ message: 'ERROR!' });
        
        res.status(201).json({ message: 'CREATED SUCCESSFULLY!' }); 
    });
});



app.put('/cab/:id', (req, res) => {
    const {id, model, brand, year, color, license_plate, driver_name, driver_contact, capacity, is_available} = req.body; 

    connection.query('UPDATE cab SET model = ?, brand = ?, year = ?, color = ?, license_plate = ?, driver_name = ?, driver_contact = ?, capacity = ?, is_available = ? WHERE id = ?', [model, brand, year, color, license_plate, driver_name, driver_contact, capacity, is_available, id], (err, _) => {
        if (err) 
            return res.status(400).send({ message: "ERROR" });
        res.status(204).send({ message: 'Updated Successfully' });
    });
});


app.delete('/cab/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM cab WHERE id = ?', [id], (err, results) => {
        if (err) 
            return res.status(500).json({ message: 'Internal server error' });
        if (results.affectedRows === 0) 
            return res.status(404).json({ message: `Cab with ID ${id} not found` });
        
        res.status(200).json({ message: `Deleted Cab with ID ${id}!` });
    });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
});