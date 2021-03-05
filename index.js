const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

let mysqltConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'EmployeeDB',
    multipleStatements: true,
})

mysqltConnection.connect((err) => {
    if(!err) console.log('DB connection succeded.');
    else console.log('DB connection failed \n Error: ' + JSON.stringify(err, undefined,2));
})

app.listen(5000, ()=> {
    console.log('Server is running at port no: 5000');
})


//get all employees
app.get('/employees', (req,res)=>{
    mysqltConnection.query('SELECT * FROM Employee', (err, rows, fields) => {
        if(!err) res.send(JSON.stringify(rows));
        else console.log(err);
    })
})
//get an employees
app.get('/employees/:id', (req,res)=>{
    mysqltConnection.query('SELECT * FROM Employee WHERE EmpID = ?',[req.params.id] ,(err, rows, fields) => {
        if(!err) res.send(rows);
        else console.log(err);
    })
})
//delete an employees
app.delete('/employees/:id', (req,res)=>{
    mysqltConnection.query('DELETE FROM Employee WHERE EmpID = ?',[req.params.id] ,(err, rows, fields) => {
        if(!err) res.send('Deleted successfully.');
        else console.log(err);
    })
})
//Insert an employees
app.post('/employees', (req,res)=>{
    let emp = req.body;
    let sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
    mysqltConnection.query(sql,[emp.EmpID, emp.Name, emp.EmpCode, emp.Salary],(err, rows, fields) => {
        if(!err) rows.forEach(element => {
            if(element.constructor == Array) res.send('Inserted employee id: ' +element[0].EmpID);
        })
        else console.log(err);
    })
})
//Update an employees
app.put('/employees', (req,res)=>{
    let emp = req.body;
    let sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
    mysqltConnection.query(sql,[emp.EmpID, emp.Name, emp.EmpCode, emp.Salary],(err, rows, fields) => {
        if(!err) 
            res.send('Updated successfully!')
        else console.log(err);
    })
})

