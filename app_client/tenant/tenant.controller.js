'use strict';

app.controller('TenantController', ['$scope', '$log', '$mdDialog', 'TenantService', 'Page', function($scope, $log, $mdDialog, TenantService, Page) {
	
	Page.setTitle('Tenants');
	
	$scope.tenants = TenantService.tenants;
	
	$scope.tenant = null;
	$scope.selectedTenant = null;
	
	$scope.getTenants = function() {
		TenantService.getTenants(function(data) {
			$scope.tenants = data;
			$scope.tenant = null;
			$scope.selectedTenant = null;
		});
	};
	$scope.getTenants();
	
	
	$scope.deleteTenant = function(tenant) {
		console.log(tenant);
		TenantService.deleteTenant(tenant._id, function(data) {
			$scope.getTenants();
		});
	};
	
	$scope.showConfirmDelete = function(tenant, ev) {
		var confirm = $mdDialog.confirm()
				.title('Confirmation')
				.textContent('Are you sure you want to delete this tenant?')
				.ariaLabel('Lucky Day')
				.targetEvent(ev)
				.ok('Yes, Delete this tenant')
				.cancel('No, do not delete');
		$mdDialog.show(confirm).then(function() {
			$scope.deleteTenant(tenant);
		}, function() {
			
		});
			
	};
	
	$scope.editTenant = function(tenant) {
		$scope.tenant = tenant;
		$scope.selectedTenant = $scope.tenant;
	};
	
	$scope.saveTenant = function(tenant) {
		if(tenant._id) {
			TenantService.updateTenant(tenant, function(data) {
				console.log('updated...');
				$scope.getTenants();
			});
		} else {
			TenantService.createTenant(tenant, function(data) {
				console.log('saved...');
				$scope.getTenants();
			});
		}
	};
	
	$scope.clearTenantText = function() {
		$scope.getTenants();
	};
	
		
}]);


