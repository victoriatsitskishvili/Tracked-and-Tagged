const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  // Your MySQL username,
  user: 'root',
  // Your MySQL password
  password: 'password',
  database: 'employee_db'
});

db.connect(err => {
    if(err) throw err
    console.log('connected')
})

module.exports = db;
