'use strict';

servicesModule.service('TenantService', ['$log', '$http', function($log, $http) {
	
	this.tenants = null;
	
	this.getTenants = function(callback) { 
		$http.get('/api/tenant').then(function(response) {
			callback(response.data);
		}, function(err) {
			console.log(err);
			return(err);
		});
	}
	
	this.deleteTenant = function(id, callback) { 
		$http.delete('/api/tenant/' + id).then(function(response) {
			callback(response.data);
		}, function(err) {
			console.log(err);
			return(err);
		});
	}
	
	this.createTenant = function(tenant, callback) { 
		$http.post('/api/tenant/', tenant).then(function(response) {
			callback(response.data);
		}, function(err) {
			console.log(err);
			return(err);
		});
	}
	
	this.updateTenant = function(tenant, callback) { 
		console.log(tenant);
		$http.put('/api/tenant/' + tenant._id, { tenant: tenant }).then(function(response) {
			callback(response.data);
		}, function(err) {
			console.log(err);
			return(err);
		});
	}
	
		
}]);