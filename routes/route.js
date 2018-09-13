const express = require('express');
const router = express.Router();
//const bcrypt = require('bcrypt');

//get ipam schema model
const ipam = require('../models/ipam');
const User = require('../models/user');

function allocateIP(network, count) {
	/*
	enter CIDR logic here
	*/
	//extract the first two sets of the ip xxx.xxx.
	var networkPrefix = network.network_id.match(/\b\d{1,3}\.\d{1,3}\.\b/)[0];

	var availableIps = [];

	//iterate through all possible ips in the current network_id sequentially
	for (var i = 0; i < 256; i++) {
		for (var j = 1; j < 256; j++) {
			var ipAvailableFlag = true;
			//check if ip is taken
			for (ipObj of network.ip_pool) {
				if (ipObj.ipaddress == (networkPrefix + i + '.' + j)) {
					ipAvailableFlag = false;
					break;
				}
			}
			//if ip is not already present in pool, store it
			if (ipAvailableFlag) {
				if (availableIps.length < count) {
					availableIps.push(networkPrefix + i + '.' + j);
				} else {
					return availableIps;
				}
			}
		}
	}
}

//fetch the user and his ips
router.get('/fetchUser', function (req, res) {
	User.findOne({
		owner: req.query.username
	}, function (err, result) {
		if (err)
			throw err;
		else
			res.json(result);
		result.pool.forEach(pool => {
			console.log(pool.ipaddress);
		});

	});
});

//allocate new ips to current user
router.post('/allocate', function (req, res) {
	ipam.findOne({
		network_id: req.body.network_id
	}, function (err, result) {
		if (err) throw err;
		else {
			//get available ip list
			var allocated_ips = allocateIP(result, req.body.count);
			for (allocated_ip of allocated_ips) {
				var ipamObj = {
					ipaddress: allocated_ip,
					hostname: "",
					owner: req.body.username,
					assigned: true
				}

				var userObj = {
					ipaddress: allocated_ip,
					network_id: result.network_id,
					subnet_mask: result.subnet_mask,
					gateway: result.gateway,
					dns: result.dns,
					domain: result.domain
				}

				//push the ips to current network document
				ipam.updateOne({
					network_id: req.body.network_id
				}, {
					$push: {
						ip_pool: ipamObj
					}
				}, function (err, result) {
					if (err) throw err;
				});

				User.updateOne({
					owner: req.body.username
				}, {
					$push: {
						pool: userObj
					}
				}, function (err, result) {
					if (err) throw err;
				});
			}

		}
	})
});

module.exports = router;