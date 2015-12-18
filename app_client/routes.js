'use strict';

// ROUTES
app.config(function ($routeProvider) {
	
	$routeProvider
	
	.when('/', {
		templateUrl: '/csv_generator/apiList.view.html',
		controller: 'ApiListController'
	})
	
	.when('/api-list', {
		templateUrl: '/csv_generator/_api-list.html',
		controller: 'apiList'
	})
	
	.when('/api-list/:api', {
		templateUrl: '/assets/angular/tenants/_tenants.html',
		controller: 'TenantController'
	})
	
	.otherwise({redirectTo: '/'});
	
});