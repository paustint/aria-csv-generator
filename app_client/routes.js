'use strict';

// ROUTES
app.config(function ($routeProvider, $locationProvider) {
	$routeProvider
	
	.when('/', {
		templateUrl: '/csv_generator/api_list/apiList.view.html',
		controller: 'ApiListController'
	})
	
	.when('/api-list', {
		templateUrl: '/csv_generator/api_list/apiList.view.html',
		controller: 'ApiListController'
	})
	
	.when('/tenant', {
		templateUrl: '/tenant/tenant.view.html',
		controller: 'TenantController'
	})
	
	.when('/csv-gen/record_usage', {
		templateUrl: '/csv_generator/record_usage/recordUsage.view.html',
		controller: 'RecordUsageController'
	})
	
	.otherwise({redirectTo: '/'});
	$locationProvider.html5Mode( true );
});