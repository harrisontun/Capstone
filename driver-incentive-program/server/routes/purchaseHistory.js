"use strict";
const db = require('./../config/db');
const express = require("express");
let router = express.Router();

router.get('/orderHistory/:user_id', (req, res) => {
    let user_id = req.params.user_id;
    db.connect(function() {
        let sql= `SELECT order_id, day_ordered, ordered_at, num_points, quantity, item FROM Orders WHERE user_id=?`;
        db.query(sql, [user_id], function(err, result) {
            if (err) {console.log(err);res.send('failure');}
            else {res.send(result);}
        })
    })
})

router.post('/order', (req, res) => {
    let { user_id, PointsAmt, quantityAmt, item } = req.body;
		if (err) {
			console.error(err);
		} else {
			db.connect(function(err) {
		    sql = "INSERT INTO Orders (user_id, num_points, quantity, item) VALUES (?, ?, ?, ?)";
			db.query(sql, [user_id, PointsAmt, quantityAmt, item], function (err, result) {
				if (err) {
					console.log("Error submitting application.");
					res.send('failure');
				} else {
					res.send('success');
		    	}});
		    });
        }
    res.end();
});

module.exports= router;