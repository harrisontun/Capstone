"use strict";
const db = require('./../config/db');
const express = require("express");
let router = express.Router();


router.post('/viewAll',(req, res) => {
	// let searchTerm = req.query.searchTerm;
    let searchTerm = req.body.searchTerm ? req.body.searchTerm : '';
	db.connect(function(err) {
		let sql = "SELECT * FROM userInfo WHERE CONCAT(f_name, ' ', l_name) LIKE CONCAT('%',?,'%') AND user_type='D'";
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

// drivers in a sponsor org
router.post('/viewAllCurrent',(req, res) => {
	// let searchTerm = req.query.searchTerm;
    let searchTerm = req.body.searchTerm ? req.body.searchTerm : '';
	db.connect(function(err) {
		let sql = "SELECT * FROM userInfo WHERE CONCAT(f_name, ' ', l_name) LIKE CONCAT('%',?,'%') AND user_type='D' AND user_id IN (SELECT user_id FROM driverSponsor)";
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


router.get('/currentSponsors/:user_id', (req, res) => {
    let user_id = req.params.user_id;
    db.connect(function() {
        let sql= `SELECT s.Name, s.SponsorID FROM SponsorOrg AS s 
        INNER JOIN driverSponsor AS ds ON ds.sponsor_id=s.SponsorID
        WHERE ds.user_id=? AND ds.status='accepted'`;
        db.query(sql, [user_id], function(err, result) {
            if (err) {console.log(err);res.send('failure');}
            else {res.send(result);}
        })
    })
})

// to show in list of additional sponsors to apply to
router.get('/notAcceptedOrPending/:user_id', (req, res) => {
    let user_id = req.params.user_id;
    db.connect(function() {
        let sql= `SELECT s.Name, s.SponsorID FROM SponsorOrg AS s 
        WHERE s.SponsorID NOT IN (SELECT ds.sponsor_id FROM driverSponsor AS ds WHERE ds.user_id = ?)
        OR s.SponsorID NOT IN (SELECT ds.sponsor_id FROM driverSponsor AS ds WHERE ds.status IN ('accepted', 'pending'))`;
        db.query(sql, [user_id], function(err, result) {
            if (err) {console.log(err);res.send('failure');}
            else {res.send(result);}
        })
    })
})

// for admin to add drivers to other sponsors
router.get('/notAccepted/:user_id', (req, res) => {
    let user_id = req.params.user_id;
    db.connect(function() {
        let sql=`SELECT s.Name, s.SponsorID FROM SponsorOrg AS s 
        LEFT JOIN driverSponsor AS ds ON ds.sponsor_id=s.SponsorID AND ds.user_id=?
        WHERE ds.sponsor_id IS NULL OR ds.status!='accepted'`
        db.query(sql, [user_id], function(err, result) {
            if (err) {console.log(err);res.send('failure');}
            else {res.send(result);}
        })
    })
})

router.get('/points/:user_id/:sponsor_id', (req,res) => {
    let user_id=req.params.user_id;
    let sponsor_id=req.params.sponsor_id; // sponsor company to get points for
    db.connect(function() {
        let sql= "SELECT points FROM driverSponsor WHERE user_id=? AND sponsor_id=?";
        db.query(sql, [user_id, sponsor_id], function(err, result) {
            if (err) {console.log(err);res.send('failure');}
            else {res.send(result);}
        })
    })
})

// admin and sponsors to remove drivers from sponsor org
router.put('/remove', (req, res) => {
    let user_id = req.body.user_id
    let sponsor_id = req.body.sponsor_id; // sponsor org for driver to be removed from
    let driver_id = req.body.driver_id;
    db.connect(function(err){
        // check they are admin or sponsor
        let sql = "SELECT user_type FROM userInfo WHERE user_id=?";
        db.query(sql, [user_id], function (err, result) {
            if (err) {console.log(err);res.send('failure');}
            else {
                let type = result[0].user_type;
                if (type=="A" || type=="S") {
                    if(type=="S") {
                        sql= "UPDATE driverSponsor SET status='former' WHERE user_id=? AND sponsor_id=(SELECT sponsor_id FROM sponsors WHERE user_id=?)";
                        db.query(sql, [driver_id, user_id], function (err, result) {
                            if (err) {console.log(err);res.send('failure');}
                            else  {
                                res.send('successfully removed driver');
                            }
                        })
                    }
                    else {
                        sql= "UPDATE driverSponsor SET status='former' WHERE user_id=? AND sponsor_id=?";
                        db.query(sql, [driver_id, sponsor_id], function (err, result) {
                            if (err) {console.log(err); res.send('failure');}
                            else {res.send('successfully removed driver');}
                            })
                    }
                 }
            }
        })
    })
})

// admin and sponsors to add drivers to sponsor org
router.post('/add', (req, res) => {
    let user_id= req.body.user_id; // user adding new driver
    let sponsor_id = req.body.sponsor_id; // sponsor org for driver to be added to
    let username = req.body.username;
    let pass = '';
    let hashedPassword;
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz0123456789@#$!';
    for (let i = 1; i <= 8; i++) {
        let char = Math.floor(Math.random()
                * str.length + 1);
     
            pass += str.charAt(char)
        }
    bcrypt.hash(pass, saltRounds, (err, hash) => {
        if (err) {console.log(err); res.send('failed');}
        else {
            hashedPassword=hash;
            db.connect(function(err){
                // check they are admin or sponsor
                let sql = "SELECT user_type FROM userInfo WHERE user_id=?";
                db.query(sql, [user_id], function (err, result) {
                    if (err) {console.log(err);res.send('failed');}
                    else {
                        let type = result[0].user_type;
                        if (type=="A" || type=="S") {
        
                            // check username available
                            let sql = "SELECT username FROM userInfo WHERE username=?";
                            db.query(sql, [username], function (err, result) {
                            if (result && result.length>0) {
                                res.send("failed- Username taken.");
                            }
                            else {
                                sql = "INSERT INTO userInfo (username, user_type, password) VALUES (?,'D', ?)";
                                db.query(sql, [username, hashedPassword], function (err, result) {
                                    if (err) {console.log(err); res.send('failed');}
                                    else {
                                        sql = "INSERT INTO driverSponsor (user_id, sponsor_id, status) VALUES ((SELECT user_id FROM userInfo WHERE username=?), ?, 'accepted') "
                                        db.query(sql, [username, sponsor_id], function (err, result) {
                                        if (err) {console.log(err); res.send('failed');}
                                        else {res.send(pass)}
                                            })  
                                        }
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
// admin and sponsors to add drivers to sponsor org
router.post('/addExisting', (req, res) => {
    let user_id= req.body.user_id; // user adding  driver
    let sponsor_id = req.body.sponsor_id; // sponsor org for driver to be added to
    let driver_id = req.body.driver_id;

    db.connect(function(err){
        // check they are admin or sponsor
        let sql = "SELECT user_type FROM userInfo WHERE user_id=?";
        db.query(sql, [user_id], function (err, result) {
            if (err) {console.log(err);}
            else {
                let type = result[0].user_type;
                if (type=="A" || type=="S") {
                    sql = "SELECT * FROM driverSponsor WHERE user_id=? AND sponsor_id=?"
                    db.query(sql, [driver_id, sponsor_id], function(err,result1) {
                        if (err) {
                            console.log("Error logging submitted application.");
                            res.send('failure');
                        }
                        else {
                            if (result1.length>0) {
                                sql = "UPDATE driverSponsor SET status='accepted' WHERE user_id=? AND sponsor_id=?";}
                            else {
                                sql = "INSERT INTO driverSponsor(user_id, sponsor_id, status) VALUES (?,?,'accepted')";
                            }
                                db.query(sql, [driver_id, sponsor_id], function(err,result) {
                                    if (err) {
                                        console.log("Error logging submitted application.");
                                        res.send('failure');
                                    }
                                    else {res.send('success');}
                            })
                        }
                    })
                }
            }
        })
    })
})
module.exports = router;

