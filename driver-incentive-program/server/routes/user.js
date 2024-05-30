"use strict";
const db = require('./../config/db');
const express = require("express");
let router = express.Router();


// drivers to see sponsors
router.get('/sponsors/:userID', (req, res) => {
    // get names of current sponsors of username
    let sql = `SELECT s.Name FROM SponsorOrg AS s 
    INNER JOIN driverSponsor AS ds 
    ON ds.sponsor_id=s.SponsorID 
    WHERE ds.status LIKE '%current%'
    AND ds.user_id=${userID}`;
    db.connect(function(err){
        db.query(sql,function (err, result) {
            if (err) {console.log(err);}
            else {
                res.send(result); 
            }
        })
    })
})


// admin delete driver or sponsor accts
router.put('/delete', (req, res) => {
    let user_id = req.body.user_id; // user making request to delete
    let userToDelete = req.body.userToDelete;
    db.connect(function(err){ 
        let sql = "SELECT user_type FROM userInfo WHERE user_id=?";
        db.query(sql, [user_id], function (err, result) {
            if (err) {console.log(err);res.send('failed');}
            else {
                let type = result[0].user_type;
                // check they are admin OR if it is a user deleting their own acct
                if (type=="A" || user_id==userToDelete) {
                     sql = "UPDATE userInfo SET user_type='I' WHERE user_id=? ";
                     db.query(sql, [userToDelete], function (err, result) {
                                    if (err) {console.log(err);res.send('failed');}
                                    else {res.send('user successfully deleted')}
                                })
                 }
                 else {res.send('unauthorized to perform action. failed');}
            }
        })

    })
})

// admin to change user type 
router.put('/updateRole', (req,res) => {
    let user_id = req.body.user_id; // user trying to change the role of the other user
    let newRole = req.body.newRole;
    let userToChange = req.body.userToChange; // user whose role is being updated

    db.connect(function(err) {
        let sql = "SELECT user_type FROM userInfo WHERE user_id=?";
        db.query(sql, [user_id], function (err, result) {
            if (err) {console.log(err);}
            else {
                let type = result[0].user_type;
                // check they are admin
                if (type=="A") {
                     sql = "UPDATE userInfo SET user_type=? WHERE user_id=? ";
                     db.query(sql, [newRole, userToChange], function (err, result) {
                                    if (err) {console.log(err); res.send('failure');}
                                    else {res.send('success');}
                                })
                 }
                 else {res.send('unauthorized access --> fail!!');}
                 
            }
        })
    })
})


router.post('/viewAll',(req, res) => {
	let searchTerm = req.body.searchTerm ? req.body.searchTerm : '';
	db.connect(function(err) {
		var sql = "SELECT * FROM userInfo WHERE username LIKE CONCAT('%',?,'%') AND user_type!='I'";
		db.query(sql, [searchTerm], function (err, result) {
			if(err){
				console.log(err);
                res.send('failed');
			}
			else{
				res.send(result);
				}
		});
	});
});

router.get('/type:user_id',(req, res) => {
    let user_id = req.params.user_id;
	db.connect(function(err) {
		var sql = "SELECT user_type FROM userInfo WHERE user_id=?";
		db.query(sql, [user_id], function (err, result) {
			if(err){
				console.log(err);
                res.send('failed');
			}
			else{
				res.send(result);
				}
		});
	});
});


module.exports = router;