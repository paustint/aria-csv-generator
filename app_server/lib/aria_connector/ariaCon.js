var https = require("https");

var ariaEndPoints = {
	core: {
		host: 'secure.future.stage.ariasystems.net',
		path: '/api/ws/api_ws_class_dispatcher.php?output_format=json',
		method: 'POST',
		port: 443,
	},
	object:	{
		host: 'secure.future.stage.ariasystems.net',
		path: '/api/AriaQuery/objects.php?output_format=json',
		method: 'POST',
		port: 443,
	},	
	admintools: {
		host: 'admintools.future.stage.ariasystems.net',
		path: '/AdminTools.php/Dispatcher?output_format=json',
		method: 'POST',
		port: 443,
	}	
}

/**
 * Call Aria API
 * @param type: 'core', 'object', 'admintools'. If no match or null, defaults to core
 * @param clientNo: Aria client number
 * @param authKey: Aria authentication key
 * @param restCall: Aria api call name
 * @param params: Aria parameters object. If none, can be {} or null
 * @param onResult: Callback function (statusCode, responseObject)
 * @param debug (optional): turns on debug logging, defaults to false
 */
module.exports.call = function(type, clientNo, authKey, restCall, params, onResult, debug)
{
	if ( debug !== true) debug = false;
	// Setup parameters
	if (params === null) params = {};
	params.client_no = clientNo;
	params.auth_key = authKey;
	params.rest_call = restCall;
	params.output_format = 'json';
	var postData = JSON.stringify(params);
	if (debug) { console.log('Parameters: ' + postData); };
	
	// get http options
	var options = ariaEndPoints[type.toLowerCase()] || ariaEndPoints.core;
	
	options.headers = { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) };
	if (debug) { console.log('Endpoint details: ' + options); };
	
	// make request
	var req = https.request(options, function(res) {
		if (debug) 
		{
			console.log('status: ' + res.statusCode);
			console.log('headers: ' + JSON.stringify(res.headers));
		}
		res.setEncoding('utf8');
		
		var output = '';
		// Add chunk of data to output
		res.on('data', function (chunk) {
			output += chunk;
		});	
		// Done getting objects, call callback
		res.on('end', function() {
			if (debug) { 
				console.log('request finished: ' + new Date());
				console.log('response: ' + output);
			};
			var obj = JSON.parse(output);
			onResult(res.statusCode, obj);
		});
	});
	
	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
	// Trigger request
	if (debug) { console.log('starting request... time: ' + new Date()) };
	req.write(postData);
	// Close object
	req.end();
}
