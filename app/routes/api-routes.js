const express = require("express");
const router = express.Router();

router
	.route("/move")
	.get((req, res) => {
		res.json(['tester']);
	})
	.post((req, res) => {

	});

module.exports = router;