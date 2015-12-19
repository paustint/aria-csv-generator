var Tenant = require('../models/tenant');

module.exports.getTenants = function(req, res) {
	Tenant.find({}, function(err, tenants) {
		if (err) {
			res.json({
				error: "Tenants could not be retreived",
				errorMessage: err.message,
				errorName: err.name
			});
		} else {
			console.log(tenants);
			res.json(tenants)
		}
	});
};

module.exports.getTenantByClientNo = function(req, res) {
	Tenant.find({ clientNo: req.params.clientNo }, function(err, tenant) {
		if (err) {
			res.json({
				error: "Tenant could not be retreived",
				errorMessage: err.message,
				errorName: err.name
			});
		} else {
			console.log(tenant);
			res.json(tenant)
		}
	});
};

module.exports.getTenantById = function(req, res) {
	Tenant.findById(req.params.id, function(err, tenant) {
		if (err) {
			res.json({
				error: "Tenant could not be retreived",
				errorMessage: err.message,
				errorName: err.name
			});
		} else {
			console.log(tenant);
			res.json(tenant)
		}
	});
};

module.exports.createTenant = function(req, res) {
	var tenant = new Tenant({
		clientNo: req.body.clientNo,
		authKey: req.body.authKey,
		name: req.body.name,
	});
	
	tenant.save(function(err) {
		if (err) {
			res.json({
				error: "Tenant could not be saved",
				errorMessage: err.message,
				errorName: err.name,
				err: err
			});
		} else {
			console.log('Tenant saved successfully');
			res.json(tenant);
		}
	});
};

module.exports.updateTenant = function(req, res) {
	Tenant.findByIdAndUpdate(req.params.id, req.body.tenant, function(err, tenant) {
		if (err) {
			res.json({
				error: "Tenant could not be updated",
				errorMessage: err.message,
				errorName: err.name
			});
		} else {
			res.json(tenant);
		}
	});
};

module.exports.deleteTenant = function(req, res) {
	Tenant.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.json({
				error: "Tenant could not be deleted",
				errorMessage: err.message,
				errorName: err.name
			});
		} else {
			res.json({ message: "Tenant " + req.params.id + " deleted" })
		}
	})
};