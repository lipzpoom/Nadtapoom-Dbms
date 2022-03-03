const express = require('express');
const path = require('path');
const body = require('body-parser');
//const app = express();
const mysql = require('mysql');

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('key.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};
const app = express();

var httpsServer = https.createServer(credentials, app);

app.use(body());
app.use(express.static(path.resolve(__dirname, '..', 'build')));

const db = mysql.createConnection({
    host: '172.31.224.1',
    user: 'poom',
    password: '1234',
    database: 'testing'
});
// show data
app.get('/data', function(req,res){
    console.log("Hello in /data ");
    let sql = 'SELECT * FROM `users` JOIN `province` ON users.id_province = province.provinceId JOIN `district` ON users.id_district = district.districtId JOIN `subdistrict` ON users.id_subdistrict = subdistrict.subdistrictId JOIN `village` ON users.id_village = village.villageId ORDER BY `users`.`id` ASC;';
    db.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        res.json(result);
    });
    console.log("after query");
});

//show province
app.get('/province',function(req,res) {
    let sql = 'SELECT * FROM province'
    db.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        res.json(result);
    });
})

//show district
app.get('/district',function(req,res) {
    let sql = `SELECT * FROM district WHERE provinceId = ?`
    db.query(sql, [req.query.provinceId],(err, result)=>{
        if(err) throw err;
        console.log(result);
        res.json(result);
    });
})

//show sub district
app.get('/subdistrict',function(req,res) {
    let sql = 'SELECT * FROM subdistrict WHERE districtId = ?'
    db.query(sql, [req.query.districtId],(err, result)=>{
        if(err) throw err;
        console.log(result);
        res.json(result);
    });
})

//show village
app.get('/village',function(req,res) {
    let sql = 'SELECT * FROM village WHERE subdistrictId = ?'
    db.query(sql, [req.query.subdistrictId], (err, result)=>{
        if(err) throw err;
        console.log(result);
        res.json(result);
    });
})

//delete
app.put('/delete', function(req, res) {
    var sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql,[req.body.idkey],function (error, results) {
        if(error) throw error;
        res.send(JSON.stringify(results));
    });
});

//edit
app.put('/data', function(req, res) {
    var sql = 'UPDATE users SET firstname= ? , lastname = ?, id_province = ?, id_district = ?, id_subdistrict = ?, id_village = ? WHERE id = ?';
    db.query(sql,[
        req.body.firstname,
        req.body.lastname,
        req.body.id_province,
        req.body.id_district,
        req.body.id_subdistrict,
        req.body.id_village,
        req.body.idkey
    ],function (error, results) {
        if(error) throw error;
        res.send(JSON.stringify(results));
    });
});

//insert
app.post('/data', function(req, res){
    console.log(req.body);
    let data = {
        id:req.body.idkey,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email,
        id_province:req.body.id_province,
        id_district:req.body.id_district,
        id_subdistrict:req.body.id_subdistrict,
        id_village:req.body.id_village
    };
    let sql = 'INSERT INTO users SET ?';
    db.query(sql, data, (err, result)=>{
        if(err){
            console.log(err);
            console.log("ID is Primarykey!!!!!");
            console.log("Enter the id again..");
        }else{
            console.log(result);
        }
    });
});


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});




//module.exports = app;
module.exports = httpsServer;
