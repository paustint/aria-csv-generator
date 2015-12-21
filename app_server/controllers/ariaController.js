var aria = require('../lib/aria_connector/ariaCon');
var Tenant = require('../models/tenant');
var RSVP = require('rsvp');

// TODO -> Write middleware to get tenant number from request query string (res.query.clientNo) and lookup tenant information
// use router middleware to solve this 

var buildQuery = function(req) {
	var query = {};
	if (req.query.clientNo === undefined) {
		if (req.query.tenantId !== undefined) {
			query._id = req.query.tenantId;
		}
	} else {
		query.clientNo = req.query.clientNo;
	}
	return query;	
};


module.exports.getPlans = function(req, res) {
	var query = buildQuery(req);
	
	if (Object.keys(query).length > 0) {
		Tenant.findOne(query, function(err, tenant) {
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
	var query = buildQuery(req);
	
	if (Object.keys(query).length > 0) {
		Tenant.findOne(query, function(err, tenant) {
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

module.exports.getAcctPlanUsageTypes = function(req, res) {
	var query = buildQuery(req);
	var promises = [];
	if (Object.keys(query).length > 0) {
		Tenant.findOne(query, function(err, tenant) {
			if (err) {
				res.json({
					error: "Tenant could not be retreived",
					errorMessage: err.message,
					errorName: err.name
				});
			} else {
				if (tenant) {
					aria.call('core', tenant.clientNo, tenant.authKey, 'get_acct_plans', {acct_no: req.params.acctNo}, function(statusCode, planData) {
						var errors = [];
						if(planData.error_code === 0) {
							var planServices = [];
							var planServicesHash = {};
							planData.acct_plans.forEach(function(plan, index, array){
								promises.push(new RSVP.Promise(function(resolve, reject){
									aria.call('core', tenant.clientNo, tenant.authKey, 'get_client_plan_services', {plan_no: plan.plan_no}, function(statusCode, serviceData) {
										if(serviceData.error_code === 0) {
											serviceData.plan_services.forEach(function(planService, index, array) {
												if (!planServicesHash.hasOwnProperty(planService.usage_type_code)){
													planServicesHash[planService.usage_type_code] = true;
													planServices.push(planService);
												}
											});
											resolve(serviceData.plan_services);
										} else {
											errors.push('Error calling get_client_plan_services for plan ' + planData.plan_no + ', ' + planData.error_msg);
											reject('Error calling get_client_plan_services for plan ' + planData.plan_no + ', ' + planData.error_msg);
										}
									});
								}));
							});
							// Wait for all async requests to finish and then return planServices
							RSVP.all(promises).then(function(results) {
							// posts contains an array of results for the given promises
								res.json({
									accountPlanServices: planServices,
									errors: errors
								});
							}).catch(function(reason){
								res.json({
									accountPlanServices: null,
									errors: errors,
									reason: reason
								});
							});
						} else {
							errors.push('Could not call get_acct_plans, ' + planData.error_msg);
							res.json({
								accountPlanServices: null,
								errors: errors
							});
						}
					});
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
	var query = buildQuery(req);
	
	if (Object.keys(query).length > 0) {
		Tenant.findOne(query, function(err, tenant) {
			if (err) {
				res.json({
					error: "Tenant could not be retreived",
					errorMessage: err.message,
					errorName: err.name
				});
			} else {
				if (tenant) {
					aria.call('core', tenant.clientNo, tenant.authKey, 'get_acct_plans', {acct_no: req.params.acctNo}, function(statusCode, data) {
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
	var query = buildQuery(req);
	
	if (Object.keys(query).length > 0) {
		Tenant.findOne(query, function(err, tenant) {
			if (err) {
				res.json({
					error: "Tenant could not be retreived",
					errorMessage: err.message,
					errorName: err.name
				});
			} else {
				if (tenant) {
					aria.call('core', tenant.clientNo, tenant.authKey, 'get_account_details', {query_string: 'acct_no is not null'}, function(statusCode, data) {
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