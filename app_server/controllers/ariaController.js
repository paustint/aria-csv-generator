var aria = require('../lib/aria_connector/ariaCon');
var Tenant = require('../models/tenant');

// TODO -> Write middleware to get tenant number from request query string (res.query.clientNo) and lookup tenant information
// use router middleware to solve this 

module.exports.getPlans = function(req, res) {
	if (req.query.clientNo !== undefined ) {
		Tenant.findOne( { clientNo: req.query.clientNo }, function(err, tenant) {
			if (err) {
				res.json({
					error: "Tenant could not be retreived",
					errorMessage: err.message,
					errorName: err.name
				});
			} else {
				if (tenant) {
					aria.call('core', tenant.clientNo, tenant.authKey, 'get_client_plans_basic', {}, function(statusCode, data) {
						res.json({
							plans: data
						});	
					}, true);
				} else {
					res.json({
						error: 'Tenant not found'
					});
				}
			}
		});
	} else {
		res.json({
			error: 'Client number must be provided'
		});
	}	
};

module.exports.getUsageTypes = function(req, res) {
		if (req.query.clientNo !== undefined ) {
		Tenant.findOne( { clientNo: req.query.clientNo }, function(err, tenant) {
			if (err) {
				res.json({
					error: "Tenant could not be retreived",
					errorMessage: err.message,
					errorName: err.name
				});
			} else {
				if (tenant) {
					aria.call('core', tenant.clientNo, tenant.authKey, 'get_client_plan_services', {plan_no: req.params.planNo}, function(statusCode, data) {
						res.json({
							planServices: data
						});	
					}, true);
				} else {
					res.json({
						error: 'Tenant not found'
					});
				}
			}
		});
	} else {
		res.json({
			error: 'Client number must be provided'
		});
	}
};

module.exports.getAcctPlans = function(req, res) {
		if (req.query.clientNo !== undefined ) {
		Tenant.findOne( { clientNo: req.query.clientNo }, function(err, tenant) {
			if (err) {
				res.json({
					error: "Tenant could not be retreived",
					errorMessage: err.message,
					errorName: err.name
				});
			} else {
				if (tenant) {
					aria.call('core', tenant.clientNo, 'get_acct_plans', {acct_no: req.params.acctNo}, function(statusCode, data) {
						res.json({
							acctPlans: data
						});	
					}, true);
				} else {
					res.json({
						error: 'Tenant not found'
					});
				}
			}
		});
	} else {
		res.json({
			error: 'Client number must be provided'
		});
	}	
};

module.exports.getAccounts = function(req, res) {
		if (req.query.clientNo !== undefined ) {
		Tenant.findOne( { clientNo: req.query.clientNo }, function(err, tenant) {
			if (err) {
				res.json({
					error: "Tenant could not be retreived",
					errorMessage: err.message,
					errorName: err.name
				});
			} else {
				if (tenant) {
					aria.call('core', tenant.clientNo, 'get_account_details', {query_string: 'acct_no is not null'}, function(statusCode, data) {
						res.json({
							acctDetails: data
						});	
					}, true);
				} else {
					res.json({
						error: 'Tenant not found'
					});
				}
			}
		});
	} else {
		res.json({
			error: 'Client number must be provided'
		});
	}
};