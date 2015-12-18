var aria = require('../lib/aria_connector/ariaCon');


module.exports.apiList = function(req, res) {
	aria.call('core', 6000033, 'fWSTQQB934p6AVh7Fnb5gm6wCcGyCCmM', 'authenticate_caller', {}, function(statusCode, data) {
		res.json({
		data: data,
		apis: [
			'record_usage',
			'create_acct_complete',
			'create_acct_complete_m'
		]
	});
	}, true);	
};

module.exports.apiOptions = function(req, res) {
	res.json({
		options: {
			
		},
		fields: [
			
		]
	});
};

module.exports.confirm = function(req, res) {
	res.render('csv-generator/index', { title: 'Confirm' });
};

module.exports.genCsv = function(req, res) {
	res.render('csv-generator/index', { title: 'Generate CSV' });
};