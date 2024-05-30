"use strict";
const db = require('./../config/db');
const express = require("express");
let router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10; // cost factor to determine the computational cost of the hashing

router.get("/reset/:username", (req, res) => {
	let username = req.params.username;
	db.connect(function(err) {
		let sql = "SELECT security_question FROM userInfo WHERE username=?"; 
		db.query(sql, [username], function (err, result) {
			res.send(result);
		});
	})})

router.put("/reset", (req, res) => {
	let username = req.body.username;
	let answer = req.body.answer;
	let newPassword = req.body.password;
	let hashedPassword;
	bcrypt.hash(newPassword, saltRounds, (err, hash) => {
		if (err) {
			console.log(err);
			res.send('failed')
		} else {
			hashedPassword = hash;
			db.connect(function(err) {

				let sql = "UPDATE userInfo SET password = ? WHERE username = ? AND security_answer = ?"; 
				db.query(sql, [hashedPassword, username, answer], function (err, result) {
					// if no rows affected, inform user the provided info was incorrect
					if(result.includes("0 rows affected")) {
						res.send("Password change failed. Please check the username and security answer provided");
					}
					// if a row was affected, inform user the operation was successful
					else {
						res.send("Password change successful.");
					}
				});
			});
		}
	})
})

module.exports = router;
