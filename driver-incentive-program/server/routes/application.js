"use strict";
const db = require('./../config/db');
const express = require("express");
const bcrypt = require('bcrypt');
const saltRounds = 10; // cost factor to determine the computational cost of the hashing

let router = express.Router();

router.post('/apply', (req, res) => {
    // validate user input!!
    let { username, password, firstName, lastName, phoneNumber, address, city, state, zipCode, birthday, securityQuestion, securityAnswer, sponsor } = req.body;
    let user_type = "D";

	let hashedPassword;
	bcrypt.hash(password, saltRounds, (err, hash) => {
		if (err) {
			console.error(err);
		} else {
			hashedPassword = hash;
			db.connect(function(err) {
				let sql = "SELECT username FROM userInfo WHERE username = ?";
				db.query(sql, [username], function (err, result) {
					if (result && result.length > 0) {
						res.send("Username taken.")
					} else {
						sql = "INSERT INTO userInfo (username, password, f_name, l_name, phone_number, address, birthday, user_type, security_question, security_answer, city, state, zip_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
						db.query(sql, [username, hashedPassword, firstName, lastName, phoneNumber, address, birthday, user_type, securityQuestion, securityAnswer, city, state, zipCode], function (err, result) {
							if (err) {
								console.log("Error submitting application.");
								res.send('failure');
							} else {
								// log new application --> add to driverSponsor
								sql = "INSERT INTO driverSponsor (user_id, sponsor_id, status) VALUES ((SELECT user_id FROM userInfo WHERE username=?), ?, 'pending')";
								db.query(sql, [username, sponsor], function (err, result) {
									if (err) {
										console.log("Error logging submitted application.");
										res.send('failure');
									}
									else {res.send('success');}
								});
							}
						});
					}
				});
			});
		}
	});
    
    res.end();
});

// for existing users to apply to additional sponsors
router.post('/existingUserApp', (req, res) => {
	let user_id = req.body.user_id;
	let sponsor_id = req.body.sponsor_id;
	db.connect(function(err) {
		let sql = "SELECT * FROM driverSponsor WHERE user_id=? AND sponsor_id=?"
		db.query(sql, [user_id, sponsor_id], function(err,result) {
			if (err) {
				console.log("Error logging submitted application.");
				res.send('failure');
			}
			else {
				if (result.length>0) {
					sql = "UPDATE driverSponsor SET status='pending' WHERE user_id=? AND sponsor_id=?";}
				else {
					sql = "INSERT INTO driverSponsor(user_id, sponsor_id, status) VALUES (?,?,'pending')";
				}
				db.query(sql, [user_id, sponsor_id], function(err,result) {
					if (err) {
						console.log("Error logging submitted application.");
						res.send('failure');
					}
					else {res.send('success');}
				})
			}
		})
	})
})

// combine all view applications into 1
// ex. sponsor view query string: /view/{userid}?name=John&from=2023-01-01&to=2023-12-12&sponsorOrg=testCo&status=pending
router.get("/view/:userID", (req, res) =>{
	let userID = req.params.userID; // user making request 
	let name = req.query.name; // for admin & sponsors to look up specific drivers	
	let from = req.query.from;
	let to = req.query.to;
	let status = req.query.status; // status of app filter, if applicable
	let sponsor = req.query.sponsor; // driver and admin can filter by sponsor
	let type;
	// get type of user 
	let whereStatement = " WHERE al.logType LIKE 'app%' AND al.logType LIKE CONCAT('%', ds.status)";
	let innerJoinStatement = ""
	let groupByStatement = "";
	let selectStatement = "";
	let orderByStatement = " ORDER BY al.dateTime DESC"; // by default, most recent to least


	if (from && from.length > 0) {
		whereStatement = `${whereStatement} AND '${from}' <= al.dateTime`;
	}
	if (to && to.length > 0) {
		whereStatement = `${whereStatement} AND al.dateTime <= '${to}'`;
	}
	if (status && status.length > 0) {
		whereStatement = `${whereStatement} AND al.logType LIKE '%${status}%'`;
	}

	db.connect(function(err) { 
		let sql = "SELECT user_type FROM userInfo WHERE user_id=?"; 
		db.query(sql, [userID], function (err, result) {
            if (result) { 
		type = result[0].user_type;

		if (sponsor && (type == "D" || type == "A") & sponsor.length > 0) {
	                whereStatement = `${whereStatement} AND al.sponsor_id = (SELECT SponsorID from SponsorOrg WHERE Name='${sponsor}')`;
        	}
        	if (name && (type == "S" || type == "A") && name.length > 0) {
                	whereStatement = `${whereStatement} AND CONCAT(u.f_name, ' ', u.l_name) LIKE '%${name}%'`;
        	}

		switch (type) {
				// if driver, see only their applications 
				case 'D':
					selectStatement = `SELECT al.dateTime AS Date, s.Name AS Sponsor, s.SponsorID AS OrgID, ds.status AS Status, al.description AS Comments, al.user_id AS id
							FROM auditLog AS al `;
					whereStatement = `${whereStatement} AND ds.user_id =${userID} `;
					innerJoinStatement = `INNER JOIN driverSponsor AS ds ON ds.user_id = al.user_id 
							INNER JOIN SponsorOrg AS s ON s.SponsorID = al.sponsor_id `;
					groupByStatement = " GROUP BY s.Name "
					break;
							// if sponsor, only see drivers who completed their application
				case 'S':
					selectStatement = `SELECT al.dateTime AS Date, u.f_name AS FName, u.l_name AS LName, ds.status AS Status, al.description AS Comments,  al.user_id AS id
							FROM auditLog AS al `;
					innerJoinStatement = ` INNER JOIN driverSponsor AS ds ON ds.user_id = al.user_id 
							INNER JOIN sponsors AS s ON s.sponsor_id = al.sponsor_id
							INNER JOIN userInfo AS u ON u.user_id = al.user_id `;
					whereStatement = `${whereStatement} AND al.sponsor_id = (SELECT sponsor_id FROM sponsors WHERE user_id =${userID}) `;
					break;
				// if admin, can see all 
				case "A":
					selectStatement = `SELECT al.dateTime AS Date, u.f_name AS FName, u.l_name AS LName, s.Name AS Sponsor, s.SponsorID AS OrgID, ds.status AS Status, al.description AS Comments,  al.user_id AS id
							FROM auditLog AS al `;
					innerJoinStatement = `INNER JOIN driverSponsor AS ds ON ds.user_id = al.user_id 
							INNER JOIN SponsorOrg AS s ON s.SponsorID = al.sponsor_id
							INNER JOIN userInfo AS u ON u.user_id = al.user_id`;
					break;
			}
			sql = selectStatement + innerJoinStatement + whereStatement +groupByStatement + orderByStatement 
				db.query(sql, function (err, result) {
							res.send(result);
						});
					}
            else { console.log("err: ", err);}
       
		});
	});
});


router.put("/reject", (req, res) => {
    let { user_id, driverID, description, orgID } = req.body;
	let secondParam, type;
    //let sql = "UPDATE driverSponsor SET status='accepted' WHERE user_id=? AND sponsor_id=(SELECT sponsor_id FROM sponsors WHERE user_id=?)";
	let sql = "SELECT user_type FROM userInfo WHERE user_id=?";
    db.connect(function(err) {
        db.query(sql, [user_id], function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
			else {
				type = result[0].user_type;
				if(type=="A") {
					sql = "UPDATE driverSponsor SET status='rejected' WHERE user_id=? AND sponsor_id=?";
					secondParam = orgID;
				}
				if (type=="S") {
					sql = "UPDATE driverSponsor SET status='rejected' WHERE user_id=? AND sponsor_id=(SELECT sponsor_id FROM sponsors WHERE user_id=?)";
					secondParam = user_id;
				}
				db.query(sql, [driverID, secondParam], function (err, result) {
					if (err) {console.log(err);}
					else {
				
						if (description.length > 0) {
							sql = "UPDATE auditLog SET description=? WHERE user_id=? AND sponsor_id=(SELECT sponsor_id FROM sponsors WHERE user_id=?) AND logType='app-rejected' ORDER BY log_id DESC LIMIT 1";
							db.query(sql, [description ,driverID, user_id], function (err, result) {
								if (err) {console.log(err);}
								else {res.send('success');}
							})
						}
						else {
							res.send('success');
						}
					} 
				})

					}
				});
			});
        });



router.put("/accept", (req, res) => {
    let { user_id, driverID, description, orgID } = req.body;
	let secondParam, type;
    //let sql = "UPDATE driverSponsor SET status='accepted' WHERE user_id=? AND sponsor_id=(SELECT sponsor_id FROM sponsors WHERE user_id=?)";
	let sql = "SELECT user_type FROM userInfo WHERE user_id=?";
    db.connect(function(err) {
        db.query(sql, [user_id], function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
			else {
				type = result[0].user_type;
				if(type=="A") {
					sql = "UPDATE driverSponsor SET status='accepted' WHERE user_id=? AND sponsor_id=?";
					secondParam = orgID;
				}
				if (type=="S") {
					sql = "UPDATE driverSponsor SET status='accepted' WHERE user_id=? AND sponsor_id=(SELECT sponsor_id FROM sponsors WHERE user_id=?)";
					secondParam = user_id;
				}
				db.query(sql, [driverID, secondParam], function (err, result) {
					if (err) {console.log(err);}
					else {
				
						if (description.length > 0) {
							sql = "UPDATE auditLog SET description=? WHERE user_id=? AND sponsor_id=(SELECT sponsor_id FROM sponsors WHERE user_id=?) AND logType='app-accepted' ORDER BY log_id DESC LIMIT 1";
							db.query(sql, [description ,driverID, user_id], function (err, result) {
								if (err) {console.log(err);}
								else {res.send('success');}
							})
						}
						else {
							res.send('success');
						}
					} 
				})

					}
				});
			});
        });

module.exports = router;
