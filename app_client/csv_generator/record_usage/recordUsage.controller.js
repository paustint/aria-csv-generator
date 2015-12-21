'use strict';

app.controller('RecordUsageController', ['$scope', '$log', '$mdToast', '$mdDialog', 'TenantService', 'RecordUsageService', 'Page',
							function($scope, $log, $mdToast, $mdDialog, TenantService, RecordUsageService, Page) {
	
	Page.setTitle('Record Usage');
	
	$scope.tenants = null;
	$scope.tenant = null;
	$scope.plans = null;
	$scope.plan = null;
	$scope.usageTypes = null;
	$scope.showUsageTypes = false;
	$scope.selectedUsageTypes = [];
	$scope.usagetypeLoading = false;
	$scope.isCsvProcessing = false;
	$scope.genCsvButtonDisabled = true;
	$scope.url = null;
	$scope.fileName = 'record_usage.csv';
	
	// Will want to move fields to server DB instead of client
	// Implement way to have variable dates or other fields
	$scope.usageTypeOptions = {
		recordsPerType: 10,
		unitsPerRecord: 1000,
		accountNumbers: [],
		allowNoAccounts: false,
		showAllowNoAccounts: true,
		showFields: false,
		selectAllFields: true,
		fields: [
			{fieldName: 'usage_date', value: new Date(), isSelected: true},
			{fieldName: 'billable_units', value: '', isSelected: true},
			{fieldName: 'amt', value: '', isSelected: true},
			{fieldName: 'rate', value: '', isSelected: true},
			{fieldName: 'telco_from', value: '', isSelected: true},
			{fieldName: 'telco_to', value: '', isSelected: true},
			{fieldName: 'comments', value: '', isSelected: true},
			{fieldName: 'qualifier_1', value: '', isSelected: true},
			{fieldName: 'qualifier_2', value: '', isSelected: true},
			{fieldName: 'qualifier_3', value: '', isSelected: true},
			{fieldName: 'qualifier_4', value: '', isSelected: true},
			{fieldName: 'parent_usage_rec_no', value: '', isSelected: true},
			{fieldName: 'client_record_id', value: '', isSelected: true},
			{fieldName: 'caller_id', value: '', isSelected: true},
			{fieldName: 'client_receipt_id', value: '', isSelected: true},
		]
	};
		
	$scope.acctOrPlan = 'plan';
	$scope.acctOrPlanRadioData = [
		{value: 'plan', label: 'By Plan'},
		{value: 'account', label: 'By Account'}
	];
	
	$scope.globalOrIndividual = 'global';
	$scope.globalOrIndividualRadioData = [
		{value: 'global', label: 'Global Options'},
		{value: 'individual', label: 'Individual Options', isDisabled: true}
	];
	
	$scope.getTenants = function() {
		TenantService.getTenants(function(tenants) {
			$scope.tenants = tenants;
		});
	};
	
	$scope.loadPlans = function(tenantId) {

		if ($scope.plans === null) {
			return RecordUsageService.getPlans(tenantId, function(plans) {
				RecordUsageService.checkApiError(plans, function() {
					$scope.plans = plans.plans_basic;
				}, function(err) {
					$log.error(err);
					$scope.showToast(err.error + ' - ' + err.errorMessage);
				});
			});	
		}
	};
	
	$scope.loadUsageTypes = function(tenantId, planNo) {
		$scope.usageTypes = null;
		$scope.usagetypeLoading = true;
		RecordUsageService.getUsageTypes(tenantId, planNo, function(usageTypes) {
			$scope.usageTypes = usageTypes.plan_services;
			$scope.usagetypeLoading = false;
		});
	};
	
	$scope.loadAcctPlans = function(tenantId, acctNo) {
		$scope.usageTypeOptions.accountNumbers = [];
		$scope.usageTypes = null;
		$scope.plan = null;
		$scope.showUsageTypes = true;
		$scope.usagetypeLoading = true;
		RecordUsageService.getAcctPlansAndUsageTypes(tenantId, acctNo, function(usageTypes){
			$scope.usageTypeOptions.accountNumbers.push(acctNo);
			$scope.usageTypes = usageTypes;
			$scope.usagetypeLoading = false;
		}, function(err){
			
		});
	};
	
	$scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
      };
	  
	$scope.toggle = function (item, list) {
		var idx = list.indexOf(item);
		if (idx > -1) list.splice(idx, 1);
		else list.push(item);
	};
	
	$scope.toggleAll = function (list, selectedList, model) {
		// Function runs prior to model changing values from click
		if (model) {
			selectedList.length = 0;
		} else {
			selectedList.length = 0;
			angular.forEach(list, function(value) {
				selectedList.push(value);
			})
		}
	};
	
	$scope.toggleSelectAll = function(list) {
		angular.forEach(list, function(value, key) {
			value.isSelected = !$scope.usageTypeOptions.selectAllFields;
		});
	}
		
	$scope.checkAcctOrPlan = function(str) {
		return $scope.acctOrPlan === str;
	};
	
	$scope.isDate = function(value) {
		return value.endsWith('date');
	};
	
	$scope.generateCsv = function(ev) {
		//TODO!!!! Check for at least one selected usage type!
		$scope.url = null;
		//ensure account number is selected
		var dataViolation = false;
		var dataViolationMsg = '';
		if ($scope.selectedUsageTypes.length === 0) {
			dataViolation = true;
			dataViolationMsg += 'You must select at least one usage type.\n';
		} 
		if (!$scope.usageTypeOptions.allowNoAccounts) {
			dataViolation = true;
			dataViolationMsg += 'You must enter at least one account number or select "Allow Creation without account numbers".';
		}
		
		if (dataViolation) {
			$scope.showAlert(
				'Data Validation Error', 
				dataViolationMsg, 
				ev);
		} else {
			$scope.getCsvArray($scope.createFile);	
		}
	};
	
	$scope.createFile = function(dataStr) {
		var blob = new Blob([ dataStr ], { type : 'text/csv' });
		$scope.url = (window.URL || window.webkitURL).createObjectURL( blob );
	}
	
	$scope.getCsvArray = function(cb) {
	/**
	 * Create CSV from data
	 * @param accounts (int[] or String[]?)
	 * @param usageTypes (String[])
	 * @param records (int)
	 * @param units (int)
	 * @param values ([{fieldName: 'name', value: *mixed}])
	 * @param callback (function())
	 */
		var selectedFields = [];
		$scope.isCsvProcessing = true;
		$scope.genCsvButtonDisabled = true;
		angular.forEach($scope.usageTypeOptions.fields, function(value) {
			if (value.isSelected) {
				selectedFields.push({ fieldName: value.fieldName, value: value.value });
				
			}
		});
		
		$log.info('sel fields');
		$log.info(selectedFields);
		RecordUsageService.createCsvGlobal(
				$scope.usageTypeOptions.accountNumbers,
				$scope.selectedUsageTypes,
				$scope.usageTypeOptions.recordsPerType,
				$scope.usageTypeOptions.unitsPerRecord,
				selectedFields,
				function(data, dataStr) {
					$log.info('array possibly created :)');
					$log.info(data);
					$scope.isCsvProcessing = false;
					$scope.genCsvButtonDisabled = false;
					cb(dataStr);
				});
	};
	
	
	$scope.clearPlans = function() {
		$scope.plans = null;
		$scope.plan = null;
		$scope.showUsageTypes = false;
		$scope.showUsageTypes = false;
		$scope.selectedUsageTypes = [];
		$scope.usagetypeLoading = false;
		$scope.usageTypeOptions.showFields = false;
	};
	
	$scope.showAlert = function(title, content, ev) {
		var alert = $mdDialog.confirm()
				.title(title)
				.textContent(content)
				.ariaLabel(title)
				.targetEvent(ev)
				.ok('Close')
			$mdDialog
				.show(alert)
				.finally(function() {
					alert = undefined;
				})
	}
	
	$scope.$watchCollection('usageTypeOptions.accountNumbers', function(newVals, oldVals) {
		// Added or removed an account from list
		if (newVals.length === 0) {
			$scope.usageTypeOptions.allowNoAccounts = false;
			$scope.usageTypeOptions.showAllowNoAccounts = true;
		} else {
			$scope.usageTypeOptions.allowNoAccounts = true;
			$scope.usageTypeOptions.showAllowNoAccounts = false;
		}
	});
	
	$scope.$watch('plan', function(newVal, oldVal) {
		if ($scope.plan) {
			$scope.showUsageTypes = true;
			$scope.loadUsageTypes($scope.tenant, $scope.plan.plan_no);
			
		} else {

		}
	});
	
	$scope.$watch('tenant', function(newVal, oldVal) {
		$scope.plans = null;
		$scope.plan = null;
		$scope.usageTypes = null;
		$scope.showUsageTypes = false;
		$scope.selectedUsageTypes = [];
		$scope.usagetypeLoading = false;		
	});
	
	$scope.showToast = function(message) {
		$mdToast.show(
		$mdToast.simple()
			.textContent(message)
			.position('top left')
			.hideDelay(3000)
		);
	};
	
	$scope.getTenants();
	
}]);