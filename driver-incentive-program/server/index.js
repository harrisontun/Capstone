const express = require('express');
const db = require('./config/db');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10; 

const applicationRoute = require("./routes/application");
const passwordRoute = require("./routes/password");
const driverRoute = require("./routes/driver");
const sponsorRoute = require("./routes/sponsor");
const adminRoute = require("./routes/admin");
const userRoute = require("./routes/user");
const purchaseHistoryRoute = require("./routes/purchaseHistory");

const bodyParser = require('body-parser');
const PORT = 8000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application
app.use(cors());
app.use('/application', applicationRoute)
app.use('/password', passwordRoute)
app.use('/driver', driverRoute)
app.use('/sponsor', sponsorRoute)
app.use('/admin', adminRoute)
app.use('/user', userRoute)
app.use('/purchaseHistory', purchaseHistoryRoute)

// query table for about page
app.get('/about', function (req, res) {
        db.connect(function(err) {
                var sql = "SELECT * FROM about";
		if (err) {console.log("error in db connection", err);}
                db.query(sql, function (err, result) {
		if (err) {console.log("error in db query", err);}
                console.log(result);
		res.send(result);
        }); });

});


app.post('/signin', (req, res) => {
	let username = req.body.username ? req.body.username : '';
	let password = req.body.password ? req.body.password : '';
	let logMsg, logType, user_id;
	db.connect(function (err) {
		var sql = "SELECT * FROM userInfo WHERE username = ? AND user_type!='I'";
		db.query(sql, [username], function (err, result) {
			if (err) {
				console.log(err);
				res.send({ message: "Err!" });
			}
			else {
				if (result.length > 0) {
					user_id = result[0].user_id;
					let storedHashedPassword = result[0].password;
					bcrypt.compare(password, storedHashedPassword, (err, result1) => {
						if (err) {
							console.error(err);
						} else {
							if (result1) {
								logMsg = ''
								logType = 'login-s'
								res.send(result)
								// Allow access
							} else {
								logMsg = 'incorrect password';
								logType = 'login-f'
								res.send({ message: "Wrong Username/Password combination!" });
							}
						}
						let sql = 'INSERT INTO auditLog (user_id, logType, description) VALUES (?, ?, ?)';
						db.query(sql, [user_id, logType, logMsg], function (err, result) {
							if (err) { console.log(err); }
						})
					});
				}
				else {
					user_id = -1;
					logMsg = 'no user id associated w/ username ' + username;
					logType = 'login-f'

					res.send({ message: "No user associated w/ username!" });
					let sql = 'INSERT INTO auditLog (user_id, logType, description) VALUES (?, ?, ?)';
					db.query(sql, [user_id, logType, logMsg], function (err, result) {
						if (err) { console.log(err); }
					})
				}


			}
		});
	});

});

app.post('/signin2',(req, res) => {
	let username = req.body.username ? req.body.username : '';
    let password = req.body.password ? req.body.password : '';
	db.connect(function(err) {
        var sql = "SELECT * FROM userInfo WHERE username = ? && password = ?";
        db.query(sql, [username, password], function (err, result) {
        if(err){
			console.log(err);
			}
		else{
			if(result.length > 0){
				res.send(result);
				sql= "SELECT handle_login(?, ?)";
				db.query(sql, [username, password], function (err, result) {});
				}
			else{
				res.send({message: "Wrong Username/Password combination!"});
				sql= "SELECT handle_login(?, ?)";
				db.query(sql, [username, password], function (err, result) {});
				}
			}
         });
	});
});

app.post('/modPoints',(req, res) => {
	let PointsAmt = req.body.PointsAmt ? req.body.PointsAmt : '';
	let user_id = req.body.user_id ? req.body.user_id : '';
	db.connect(function(err) {
		var sql = "UPDATE userInfo SET points = points + ? WHERE user_id = ?";
		db.query(sql, [PointsAmt, user_id], function (err, result) {
			if(err){
				console.log(err);
			}
			else{
				sql = "SELECT points FROM userInfo WHERE user_id = ?"
				db.query(sql, [user_id], function (err, result){
				res.send(result)});
				}
		});
	});
});

app.post('/modPoints2',(req, res) => {
	let PointsAmt = req.body.PointsAmt ? req.body.PointsAmt : '';
	let user_id = req.body.user_id ? req.body.user_id : '';
	let sponsor_id = req.body.sponsor_id ? req.body.sponsor_id : '';
	db.connect(function(err) {
		var sql = "UPDATE driverSponsor SET points = points + ? WHERE user_id = ? && sponsor_id = ?";
		db.query(sql, [PointsAmt, user_id, sponsor_id], function (err, result) {
			if(err){
				console.log(err);
			}
			else{
				sql = "SELECT points FROM driverSponsor WHERE user_id = ? && sponsor_id = ?"
				db.query(sql, [user_id, sponsor_id], function (err, result){
				res.send(result)});
				}
		});
	});
});

app.post('/changeAddress',(req, res) => {
	let NewAddress = req.body.NewAddress ? req.body.NewAddress : '';
	let user_id = req.body.user_id ? req.body.user_id : '';
	db.connect(function(err) {
		var sql = "UPDATE userInfo SET address = ? WHERE user_id = ?";
		db.query(sql, [NewAddress, user_id], function (err, result) {
			if(err){
				console.log(err);
			}
			else{
				sql = "SELECT address FROM userInfo WHERE user_id = ?"
				db.query(sql, [user_id], function (err, result){
				res.send(result)});
				}
		});
	});
});

app.post('/changePhoneNumber',(req, res) => {
	let NewPhoneNumber = req.body.NewPhoneNumber ? req.body.NewPhoneNumber : '';
	let user_id = req.body.user_id ? req.body.user_id : '';
	db.connect(function(err) {
		var sql = "UPDATE userInfo SET phone_number = ? WHERE user_id = ?";
		db.query(sql, [NewPhoneNumber, user_id], function (err, result) {
			if(err){
				console.log(err);
			}
			else{
				sql = "SELECT phone_number FROM userInfo WHERE user_id = ?"
				db.query(sql, [user_id], function (err, result){
				res.send(result)});
				}
		});
	});
});

app.post('/changeBirthday',(req, res) => {
	let NewBirthday = req.body.NewBirthday ? req.body.NewBirthday : '';
	let user_id = req.body.user_id ? req.body.user_id : '';
	db.connect(function(err) {
		var sql = "UPDATE userInfo SET birthday = ? WHERE user_id = ?";
		db.query(sql, [NewBirthday, user_id], function (err, result) {
			if(err){
				console.log(err);
			}
			else{
				sql = "SELECT birthday FROM userInfo WHERE user_id = ?"
				db.query(sql, [user_id], function (err, result){
				res.send(result)});
				}
		});
	});
});

app.post('/changeUsername',(req, res) => {
	let NewUser = req.body.NewUser ? req.body.NewUser : '';
	let user_id = req.body.user_id ? req.body.user_id : '';
	db.connect(function(err) {
		var sql = "UPDATE userInfo SET username = ? WHERE user_id = ?";
		db.query(sql, [NewUser, user_id], function (err, result) {
			if(err){
				console.log(err);
			}
			else{
				sql = "SELECT username FROM userInfo WHERE user_id = ?"
				db.query(sql, [user_id], function (err, result){
				res.send(result)});
				}
		});
	});
});

app.post('/changeFirst',(req, res) => {
	let NewFirst = req.body.NewFirst ? req.body.NewFirst : '';
	let user_id = req.body.user_id ? req.body.user_id : '';
	db.connect(function(err) {
		var sql = "UPDATE userInfo SET f_name = ? WHERE user_id = ?";
		db.query(sql, [NewFirst, user_id], function (err, result) {
			if(err){
				console.log(err);
			}
			else{
				sql = "SELECT f_name FROM userInfo WHERE user_id = ?"
				db.query(sql, [user_id], function (err, result){
				res.send(result)});
				}
		});
	});
});

app.post('/changeLast',(req, res) => {
	let NewLast = req.body.NewLast ? req.body.NewLast : '';
	let user_id = req.body.user_id ? req.body.user_id : '';
	db.connect(function(err) {
		var sql = "UPDATE userInfo SET l_name = ? WHERE user_id = ?";
		db.query(sql, [NewLast, user_id], function (err, result) {
			if(err){
				console.log(err);
			}
			else{
				sql = "SELECT l_name FROM userInfo WHERE user_id = ?"
				db.query(sql, [user_id], function (err, result){
				res.send(result)});
				}
		});
	});
});

app.post('/changeCity',(req, res) => {
	let NewCity = req.body.NewCity ? req.body.NewCity : '';
	let user_id = req.body.user_id ? req.body.user_id : '';
	db.connect(function(err) {
		var sql = "UPDATE userInfo SET city = ? WHERE user_id = ?";
		db.query(sql, [NewCity, user_id], function (err, result) {
			if(err){
				console.log(err);
			}
			else{
				sql = "SELECT City FROM userInfo WHERE user_id = ?"
				db.query(sql, [user_id], function (err, result){
				res.send(result)});
				}
		});
	});
});

app.post('/changeState',(req, res) => {
	let NewState = req.body.NewState ? req.body.NewState : '';
	let user_id = req.body.user_id ? req.body.user_id : '';
	db.connect(function(err) {
		var sql = "UPDATE userInfo SET state = ? WHERE user_id = ?";
		db.query(sql, [NewState, user_id], function (err, result) {
			if(err){
				console.log(err);
			}
			else{
				sql = "SELECT state FROM userInfo WHERE user_id = ?"
				db.query(sql, [user_id], function (err, result){
				res.send(result)});
				}
		});
	});
});

app.post('/changeZip',(req, res) => {
	let NewZip = req.body.NewZip ? req.body.NewZip : '';
	let user_id = req.body.user_id ? req.body.user_id : '';
	db.connect(function(err) {
		var sql = "UPDATE userInfo SET zip_code = ? WHERE user_id = ?";
		db.query(sql, [NewZip, user_id], function (err, result) {
			if(err){
				console.log(err);
			}
			else{
				sql = "SELECT zip_code FROM userInfo WHERE user_id = ?"
				db.query(sql, [user_id], function (err, result){
				res.send(result)});
				}
		});
	});
});

app.post('/getUserInfo',(req, res) => {
	let user_id = req.body.user_id ? req.body.user_id : '';
	db.connect(function(err) {
		var sql = "SELECT * from userInfo WHERE user_id = ?";
		db.query(sql, [user_id], function (err, result) {
			if(err){
				console.log(err);
			}
			else{
				res.send(result);
				}
		});
	});
});


// get a list of sponsors
app.get('/sponsors', function (req, res) {
	db.connect(function(err) {
			var sql = "SELECT * FROM SponsorOrg";
			db.query(sql, function (err, result) {
				if (err) {console.log("error in db query", err);}
			else {res.send(result);}
	}); });

});

app.post('/searchDrivers',(req, res) => {
	let searchTerm = req.body.searchTerm ? req.body.searchTerm : '';
	db.connect(function(err) {
		var sql = "SELECT * FROM userInfo WHERE username LIKE CONCAT('%',?,'%')";
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

app.post('/getSponsorID',(req, res) => {
	let user_id = req.body.user_id ? req.body.user_id : '';
	db.connect(function(err) {
		var sql = "SELECT sponsor_id FROM sponsors WHERE user_id = ?";
		db.query(sql, [user_id], function (err, result) {
			if(err){
				console.log(err);
			}
			else{
				res.send(result);
				}
		});
	});
});

app.post('/getSponsorDrivers',(req, res) => {
	let sponsor_id = req.body.sponsor_id ? req.body.sponsor_id : '';
	db.connect(function(err) {
		var sql = "SELECT * from userInfo AS t1 INNER JOIN driverSponsor AS t2 ON t1.user_id = t2.user_id WHERE t2.sponsor_id = ?";
		db.query(sql, [sponsor_id], function (err, result) {
			if(err){
				console.log(err);
			}
			else{
				res.send(result);
				}
		});
	});
});

//Get the auditlog
app.get('/getAuditLogData', function (req, res) {
	db.connect(function(err) {
			var sql = "SELECT * FROM auditLog";
			db.query(sql, function (err, result) {
				if (err) {console.log("error in db query", err);}
			else {res.send(result);}
	}); });

});

app.post('/getDriverInfo',(req, res) => {
	let user_id = req.body.user_id ? req.body.user_id : '';
	db.connect(function(err) {
        var sql = "SELECT * FROM driverSponsor WHERE user_id = ?";
        db.query(sql, [user_id], function (err, result) {
        if(err){
			console.log(err);
			}
		else{
			res.send(result);
			}
         });
	});
});

app.post('/getSponsorName',(req, res) => {
	let sponsor_id = req.body.sponsor_id ? req.body.sponsor_id : '';
	db.connect(function(err) {
        var sql = "SELECT Name FROM sponsorOrg WHERE sponsor_id = ?";
        db.query(sql, [sponsor_id], function (err, result) {
        if(err){
			console.log(err);
			}
		else{
			res.send(result);
			}
         });
	});
});

app.post('/getQuestion',(req, res) => {
	let username = req.body.username ? req.body.username : '';
	db.connect(function(err) {
        var sql = "SELECT security_question FROM userInfo WHERE username = ?";
        db.query(sql, [username], function (err, result) {
        if(err){
			console.log(err);
			}
		else{
			res.send(result);
			}
         });
	});
});
app.post('/PasswordReset',(req, res) => {
        let username = req.body.username ? req.body.username : '';
    let answer = req.body.answer ? req.body.answer : '';
        let NewPassword = req.body.NewPassword ? req.body.NewPassword : '';
        let  hashedPassword;
        res.send(NewPassword);
        bcrypt.hash(NewPassword, saltRounds, (err, hash) => {
                if (err) {
                        console.log(err);
                        res.send('failed')
                } else {
                        hashedPassword = hash;
        db.connect(function(err) {
        var sql = "UPDATE userInfo SET password = ? WHERE username = ? && security_answer = ?";
        db.query(sql, [hashedPassword, username, answer], function (err, result) {
        if(err){
                        console.log(err);
                        }
                else{
                                sql = "SELECT password FROM userInfo WHERE username = ?"
                                db.query(sql, [username], function(err, result){
                                        res.send(result);
                                })
                        }
         });
        });
}
})
});

app.listen(PORT, function(err) {
	if (err) {console.log("error in server set up", err);}
        else {console.log(`Server listening on ${PORT}`);}
});

