"use strict";
const db = require('./../config/db');
const express = require("express");
let router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10; // cost factor to determine the computational cost of the hashing

// see all admin
router.get('/viewAll',(req, res) => {
	let searchTerm = req.body.searchTerm ? req.body.searchTerm : '';
	db.connect(function(err) {
		var sql = `SELECT user_id, username, f_name, l_name FROM userInfo 
        WHERE username LIKE CONCAT('%',?,'%') AND user_type='A'`;
		db.query(sql, [searchTerm], function (err, result) {
			if(err){
				console.log(err);
			}
			else{
				res.send(result);
				}
		});
	});
});

// admin to add admin users 
router.post('/add', (req, res) => {
    let username = req.body.username;
    let user_id= req.body.user_id; // user adding new admin
    let pass = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz0123456789@#$!';
 
    for (let i = 1; i <= 8; i++) {
        let char = Math.floor(Math.random()
            * str.length + 1);
 
        pass += str.charAt(char)
    }
    let hashedPassword;
    bcrypt.hash(pass, saltRounds, (err, hash) => {
        if (err) {console.log(err); res.send('failed');}
        else {
            hashedPassword = hash;
            db.connect(function(err){
                // check they are admin
                let sql = "SELECT user_type FROM userInfo WHERE user_id=?";
                db.query(sql, [user_id], function (err, result) {
                    if (err) {console.log(err);}
                    else {
                        let type = result[0].user_type;
                        if (type=="A") {
                            // check username available
                            let sql = "SELECT username FROM userInfo WHERE username=?";
                            db.query(sql, [username], function (err, result) {
                            if (result && result.length>0) {
                                res.send("failed- Username taken.");
                            }
                            else {
                                sql = "INSERT INTO userInfo (username, user_type, password) VALUES (?,'A', ?)";
                                db.query(sql, [username, hashedPassword], function (err, result) {
                                    if (err) {console.log(err); res.send('failed');}
                                    else {console.log(pass);res.send(pass);}
                                })
                            }
                            })
                        }
                    }
                })
            })
        }
    })

})

// admin to remove admin 
router.put('/remove', (req, res) => {
    let user_id = req.body.user_id; // user removing other user
    let user_to_remove = req.body.user_to_remove; //user being removed
    db.connect(function(err){
        // check they are admin 
        let sql = "SELECT user_type FROM userInfo WHERE user_id=?";
        db.query(sql, [user_id], function (err, result) {
            if (err) {console.log(err); res.send('failure');}
            else {
                let type = result[0].user_type;
                if (type=="A") {
                        sql = "UPDATE userInfo SET user_type='I' WHERE user_id=?";
                        db.query(sql, [user_to_remove], function (err, result) {
                                    if (err) {console.log(err);res.send('failure');}
                                    else {res.send('success');}
                                })
                    }
                 }
            }
        )

        
    })
})
module.exports= router;
