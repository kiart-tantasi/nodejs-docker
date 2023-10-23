require("dotenv").config();
const express = require("express");
const app = express();
const mysql = require('mysql2');

// [MySQL setup]
// connect MySQL on random DB
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: 'root',
    password: 'password',
    database: 'random'
});
// create table
connection.connect((err) => {
    if (err) return console.log(err);
    const sql1 = 'DROP TABLE IF EXISTS note';
    connection.query(sql1, (err, result) => {
        if (err) return console.log(err);
    });
    const sql2 = 'CREATE TABLE note (id int auto_increment NOT NULL, note varchar(500) NOT NULL, writer varchar(100) DEFAULT "NO WRITER", PRIMARY KEY (id))';
    connection.query(sql2, (err, result) => {
        if (err) return console.log(err);
        return console.log("Table note was successfully created.")
    });
});

app.get('/', (req, res) => {
    const sql = 'SELECT * FROM note';
    return connection.query(sql, (err, result) => {
        if (err) return res.status(500).json({message: err});
        return res.json(result);
    });
});

app.get('/add-note/:text', (req, res) => {
    let text = req.params.text;
    let writer = req.query.writer || 'NO WRITER';
    if (typeof(text) !== 'string' || typeof(writer) !== 'string') return res.sendStatus(400);
    text = text.substring(0, 500);
    writer = writer.substring(0, 100);
    if (text === 'delete') {
        const deleteSql = 'DROP TABLE IF EXISTS note';
        let deleteError = '';
        connection.query(deleteSql, (err) => {
            if (err) deleteError = err;
        });
        if (deleteError) return res.status(500).json({message: deleteError});
        const createSql = 'CREATE TABLE note (id int auto_increment NOT NULL, note varchar(500) NOT NULL, writer varchar(100) DEFAULT "NO WRITER", PRIMARY KEY (id))';
        let createTableError = '';
        connection.query(createSql, (err) => {
            if (err) createTableError = err;
        });
        if (createTableError) return res.status(500).json({message: createTableError});
        return res.status(200).json({message: "Table note was successfully deleted."});
    };
    const sql = 'INSERT INTO note (note, writer) VALUES (?, ?)';
    connection.query(sql, [text, writer], (err, result) => {
        if (err) return res.status(500).json({message: err});
        return res.status(201).json({message: "successfully saved a note"})
    });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("RUNNING ON PORT", port));
