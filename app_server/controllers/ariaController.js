var aria = require('../lib/aria_connector/ariaCon');

// TODO -> Write middleware to get tenant number from request query string (res.query.clientNo) and lookup tenant information
// use router middleware to solve this 

module.exports.getPlans = function(req, res) {
	aria.call('core', 0, '---', 'get_client_plans_basic', {}, function(statusCode, data) {
		res.json({
		plans: data
	});
	}, true);	
};

module.exports.getUsageTypes = function(req, res) {
	aria.call('core', 0, '---', 'get_client_plan_services', {plan_no: req.params.planNo}, function(statusCode, data) {
		res.json({
		plans: data
	});
	}, true);	
};

module.exports.getAcctPlans = function(req, res) {
	aria.call('core', 0, '---', 'get_acct_plans', {acct_no: req.params.acctNo}, function(statusCode, data) {
		res.json({
		plans: data
	});
	}, true);	
};

module.exports.getAccounts = function(req, res) {
	aria.call('object', 0, '---', 'get_account_details', {query_string: 'acct_no is not null'}, function(statusCode, data) {
		res.json({
		plans: data
	});
	}, true);	
};