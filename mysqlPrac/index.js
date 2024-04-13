import { con } from "./connection.js";
import express from "express";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ifError } from "assert";
import { connect } from "http2";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname+'/register.html');
//   res.sendFile(__dirname+'/style.css');
});

app.post('/' , (req , res)=>{
  const name = req.body.name;
  const email = req.body.email;
  const mno = req.body.mno;
  con.connect(function(err){
    if(err) throw err;

     const sql = "INSERT INTO student (name, email, mno) VALUES (?,?,?)";
      con.query(sql,[name,email,mno],function(err, result){
        if(err) throw err;
        // res.send('data submitted!' +result.insertId);
        res.redirect('/students');
      })
  }); 
});

app.get('/students' , (req , res)=>{
  con.connect((err)=>{
    if(err) throw err;

    const sql = "SELECT * FROM student";
    con.query(sql,(err, result)=>{
      if(err) throw err;
      // console.log(result);
      res.render(__dirname+'/students',{
        students: result
      });
    })
  })
})

app.get("/delete-student", (req, res) => {
  con.connect((err)=>{
    if(err) throw err;

    const sql = "DELETE FROM student WHERE id=?";
    const id = req.query.id;

    con.query(sql,[id],(err, result)=>{
      if(err) throw err;
      res.redirect('/students');
    })
  })
});

app.get("/update-student", (req, res) => {
  con.connect((err)=>{
    if(err) throw err;

    const sql = "SELECT * FROM student WHERE id=?";
    const id = req.query.id;

    con.query(sql,[id],(err, result)=>{
      if(err) throw err;
      res.render(__dirname+'/update-student',{
        student: result
      });
    })
  })
});

app.post("/update-student", (req, res) => {

   const name = req.body.name; const email = req.body.email; const mno = req.body.mno ; const id = req.body.id;

  con.connect((err)=>{
    if(err) throw err;

    const sql = "UPDATE student SET name=? , email=?, mno=? WHERE id=?";
    con.query(sql,[name, email, mno , id],(err, result)=>{
      if(err) throw err;
      res.redirect('/students');
    })
  })
  
});


app.get("/search-student", (req, res) => {
  
  con.connect((err)=>{
    if(err) throw err;

    const sql = "SELECT * FROM student";
    con.query(sql,(err, result)=>{
      if(err) throw err;
      // console.log(result);
      res.render(__dirname+'/search-student',{
        students: result
      });
    })
  })

});

app.get("/search", (req, res) => {

    const name = req.query.name;
    const email = req.query.email;
    const mno = req.query.mno;

    con.connect((err)=>{
      if(err) throw err;
      const sql = "SELECT * FROM student WHERE name LIKE '%"+name+"%' AND email LIKE '%"+email+"%' AND mno LIKE '%"+mno+"%'";

      con.query(sql, (err ,result)=>{
        if(err) throw err;
        res.render(__dirname+"/search-student", {students:result })
      })

    })

});

app.listen(7000, () =>
  console.log("> Server is up and running on port : " +7000)
);
