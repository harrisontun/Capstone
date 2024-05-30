const db = require('./../config/db');
const express = require("express");
let router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10; // cost factor to determine the computational cost of the hashing


// sponsors to see their sponsor org
router.get('/:userID', (req, res) => {
    let user_id = req.params.userID;
    // get the name of sponsor org sponsor works for
    let sql = `SELECT s.SponsorID, s.Name FROM SponsorOrg AS s 
    INNER JOIN sponsors ON sponsors.sponsor_id=s.SponsorID
    WHERE sponsors.user_id=?`;
    db.connect(function(err){
        db.query(sql, [user_id] ,function (err, result) {
            if (err) {console.log(err);}
            else {
                res.send(result); 
            }
        })
    })
});

// drivers in a specific org. 
router.get('/drivers/:org_id', (req, res) => {
    let org_id = req.params.org_id;
	let searchTerm = req.query.searchTerm;
    // get the name of sponsor org sponsor works for
    let sql = `SELECT u.user_id, u.f_name, u.l_name, u.username, u.user_type FROM userInfo
    INNER JOIN driverSponsor AS ds ON ds.user_id=u.user_id
    WHERE ds.sponsor_id=? AND CONCAT(u.f_name, ' ', u.l_name) LIKE CONCAT('%',?,'%') AND ds.status='accepted'`;
    db.connect(function(err){
        db.query(sql, [org_id, searchTerm] ,function (err, result) {
            if (err) {console.log(err);}
            else {
                res.send(result); 
            }
        })
    })
});

// sponsors in a specific org. 
router.get('/org/:org_id', (req, res) => {
    let org_id = req.params.org_id;
    let searchTerm = req.query.searchTerm;
    // get the name of sponsor org sponsor works for
    let sql = `SELECT u.user_id, u.f_name, u.l_name, u.username,  FROM userInfo
    INNER JOIN sponsors AS s ON s.user_id=u.user_id
    WHERE s.sponsor_id=? AND username LIKE CONCAT('%',?,'%')` ;
    db.connect(function(err){
        db.query(sql, [org_id, searchTerm] ,function (err, result) {
            if (err) {console.log(err);}
            else {
                res.send(result); 
            }
        })
    })
});


// see all sponsor users
router.post('/viewAll', (req, res) => {
	let searchTerm = req.body.searchTerm ? req.body.searchTerm : '';
    let sql = `SELECT user_id, username, f_name, l_name FROM userInfo 
    WHERE CONCAT(f_name, ' ', l_name) LIKE CONCAT('%',?,'%') AND user_type='S'`;
	db.connect(function(err) {
		db.query(sql, [searchTerm], function (err, result) {
			if(err){
				console.log(err);
                res.send(err);
			}
			else{
				res.send(result);
				}
		});
	});
});

// see all sponsors who are assigned an org
router.post('/viewAllCurrent', (req, res) => {
	let searchTerm = req.body.searchTerm ? req.body.searchTerm : '';
    let sql = `SELECT user_id, username, f_name, l_name FROM userInfo 
    WHERE CONCAT(f_name, ' ', l_name) LIKE CONCAT('%',?,'%') AND user_type='S' AND user_id IN (SELECT user_id FROM sponsors)`;
	db.connect(function(err) {
		db.query(sql, [searchTerm], function (err, result) {
			if(err){
				console.log(err);
                res.send(err);
			}
			else{
				res.send(result);
				}
		});
	});
});

// sponsors that are not a part of an org
router.post('/noOrg', (req, res) => {
    let searchTerm = req.body.searchTerm ? req.body.searchTerm : '';
    let sql = `SELECT user_id, username, f_name, l_name FROM userInfo 
    WHERE CONCAT(f_name, ' ', l_name) LIKE CONCAT('%',?,'%') AND user_type='S' AND user_id NOT IN (SELECT user_id FROM sponsors)`;
        db.connect(function(err) {
		db.query(sql, [searchTerm], function (err, result) {
			if(err){
				console.log(err);
                res.send(err);
			}
			else{
				res.send(result);
				}
		});
	});
});

// admin and sponsors to remove sponsors from sponsor org
router.put('/remove', (req, res) => {
    let user_id = req.body.user_id; // user trying to remove sponsor
    let user_to_remove = req.body.user_to_remove;
    db.connect(function(err){
        // check they are admin or sponsor
        let sql = "SELECT user_type FROM userInfo WHERE user_id=?";
        db.query(sql, [user_id], function (err, result) {
            if (err) {console.log(err); res.send('failure'); }
            else {
                let type = result[0].user_type;
                if (type=="A" || type=="S") {
                    if(type=="S") {
                        // ensure sponsor is in this sponsor's org
                        sql= "SELECT user_id FROM sponsors WHERE user_id=? AND sponsor_id=(SELECT sponsor_id FROM sponsors WHERE user_id=?)";
                        db.query(sql, [user_to_remove, user_id], function (err, result) {
                            if (err) {console.log(err);res.send('failure'); }
                            else if (result[0].user_id==user_to_remove){
                                sql = "DELETE FROM sponsors WHERE user_id=?";
                                db.query(sql, [user_to_remove], function (err, result) {
                                    if (err) {console.log(err);res.send('failure'); }
                                    else {res.send('success');}
                                })
                            }
                        })
                    }
                    else {
                        sql = "DELETE FROM sponsors WHERE user_id=?";
                        db.query(sql, [user_to_remove], function (err, result) {
                                    if (err) {console.log(err);res.send('failure'); }
                                    else {res.send('success');}
                                })
                    }

                 }
            }
        })  
    })
})



// admin and sponsors to add sponsors to sponsor org
// CREATES USER
router.post('/add', (req, res) => {
    let username = req.body.username;
    let user_id= req.body.user_id; // user adding new sponsor
    let sponsor_id = req.body.sponsor_id; // sponsor org for sponsor to be added to

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
                // check they are admin or sponsor
                let sql = "SELECT user_type FROM userInfo WHERE user_id=?";
                db.query(sql, [user_id], function (err, result) {
                    if (err) {console.log(err); res.send('failed');}
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
                                sql = "INSERT INTO userInfo (username, user_type, password) VALUES (?,'S', ?)";
                                db.query(sql, [username, hashedPassword], function (err, result) {
                                    if (err) {console.log(err);res.send('failed');}
                                    else {
                                        sql = "INSERT INTO sponsors (user_id, sponsor_id) VALUES ((SELECT user_id FROM userInfo WHERE username=?),?)";
                                        db.query(sql, [username, sponsor_id], function (err, result) {
                                            if (err) {console.log(err);res.send('failed');}
                                            else {res.send(pass);}
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

// admin and sponsors to add sponsors to sponsor org
router.post('/addExisting', (req, res) => {
    let user_id= req.body.user_id; // user adding sponsor
    let org_id = req.body.org_id; //  org for sponsor to be added to
    let sponsor_id = req.body.sponsor_id; // sponsor to add

    db.connect(function(err){
        // check they are admin or sponsor
        let sql = "SELECT user_type FROM userInfo WHERE user_id=?";
        db.query(sql, [user_id], function (err, result) {
            if (err) {console.log(err);}
            else {
                let type = result[0].user_type;
                if (type=="A" || type=="S") {
                    sql = "SELECT * FROM sponsors WHERE user_id=?"
                    db.query(sql, [sponsor_id], function(err,result1) {
                        if (err) {
                            console.log("Error logging submitted application.");
                            res.send('failure');
                        }
                        else {
                            if (result1.length>0) {
                                sql = "UPDATE sponsors SET sponsor_id=? WHERE user_id=?";}
                            else {
                                sql = "INSERT INTO sponsors(sponsor_id, user_id) VALUES (?,?)";
                            }
                                db.query(sql, [org_id, sponsor_id], function(err,result) {
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

// admin and sponsors to add sponsors to sponsor org
router.post('/addExisting', (req, res) => {
    let user_id= req.body.user_id; // user adding sponsor
    let org_id = req.body.org_id; //  org for sponsor to be added to
    let sponsor_id = req.body.sponsor_id; // sponsor to add

    db.connect(function(err){
        // check they are admin or sponsor
        let sql = "SELECT user_type FROM userInfo WHERE user_id=?";
        db.query(sql, [user_id], function (err, result) {
            if (err) {console.log(err);}
            else {
                let type = result[0].user_type;
                if (type=="A" || type=="S") {
                    sql = "SELECT * FROM sponsors WHERE user_id=?"
                    db.query(sql, [sponsor_id], function(err,result1) {
                        if (err) {
                            console.log("Error logging submitted application.");
                            res.send('failure');
                        }
                        else {
                            if (result1.length>0) {
                                sql = "UPDATE sponsors SET sponsor_id=? WHERE user_id=?";}
                            else {
                                sql = "INSERT INTO sponsors(sponsor_id, user_id) VALUES (?,?)";
                            }
                                db.query(sql, [org_id, sponsor_id], function(err,result) {
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
