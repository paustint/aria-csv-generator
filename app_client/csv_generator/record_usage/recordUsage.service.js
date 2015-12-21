'use strict';

app.service('RecordUsageService', ['$http', '$log', '$filter', '$q', function($http, $log, $filter, $q) {
	
	this.getPlans = function(tenantId, callback) {
		return $http.get('/api/plans', {
			params: {
				tenantId: tenantId
			}
		}).then(function(response) {
			callback(response.data.plans);
		}, function(err) {
			$log.error(err);
			return(err);
		});
	};
	
	this.getAcctPlans = function(tenantId, acctNo, callback) {
		return $http.get('/api/account/' + acctNo + '/plans', {
			params: {
				tenantId: tenantId
			}
		}).then(function(response) {
			callback(response.data.acctPlans);
		}, function(err) {
			$log.error(err);
			return(err);
		});
	};
	
	this.getAcctPlansAndUsageTypes = function(tenantId, acctNo, callback, errCallback) {
		return $http.get('/api/account/' + acctNo + '/plans/usageTypes', {
			params: {
				tenantId: tenantId
			}
		}).then(function(response) {
			callback(response.data.accountPlanServices);
		}, function(err) {
			$log.error(err);
			return(err);
		});
	};
			
	this.getUsageTypes = function(tenantId, planNo, callback) {
		return $http.get('/api/plans/' + planNo + '/usageTypes', {
			params: {
				tenantId: tenantId
			}
		}).then(function(response) {
			callback(response.data.planServices);
		}, function(err) {
			$log.error(err);
			return(err);
		});
	};

	
	this.checkApiError = function(data, successCb, errorCb) {
		if (data.error_code === 0) {
			successCb();
		} else {
			$log.error('error with data:');
			$log.error(data)
			errorCb({ error: 'Api call was not successful', errorCode: data.error_code, errorMessage: data.error_msg })
		}
	};
	/**
	 * Create CSV from data
	 * @param accounts (int[] or String[]?)
	 * @param usageTypes (String[])
	 * @param records (int)
	 * @param units (int)
	 * @param values ([{fieldName: 'name', value: *mixed}])
	 * @param callback (function())
	 */
	this.createCsvGlobal = function(accounts, usageTypes, records, units, values, callback) {
		// for each account, create x number of records per usage type
		// e = element, i = index, a = array
		var data = [];
		var header = ['acct_no', 'usage_type_code', 'usage_units']; // init header
		values.forEach(function(e1, i1, a1) {
			header.push(e1.fieldName); // add additional header fields
		});
		data.push(header); // add header to data
		$log.info('header:');
		$log.info(header);
		// Creating context to pass in to the forEach loops as 'this' keyword
		var context = {
			data: data,
			createUsageTypeRow: this.createUsageTypeRow
		}
		if (accounts.length > 0) {
			angular.forEach(accounts, function(account) {
				angular.forEach(usageTypes, function(usageType) {
					$log.info('adding row');
					this.data.push(this.createUsageTypeRow(account, usageType.usage_type_code, units, header, values));
				}, this)
			}, context)
		} else {
			angular.forEach(usageTypes, function(usageType) {
				$log.info('adding row');
				this.data.push(this.createUsageTypeRow('', usageType.usage_type_code, units, header, values));
			}, context)
		}
		
		var dataStr = '';
		data.forEach(function(currRow, index) {
			var rowStr = currRow.join(",");
			dataStr += index < data.length ? rowStr + "\n" : rowStr;
		})
		
		callback(data, dataStr);
	}
	
	this.createUsageTypeRow = function(acctNo, usageType, units, fieldHeaders, fieldValues) {
		var row = [];
		angular.forEach(fieldHeaders, function(header) {
			$log.info('starting new iteration of header. Curr row state:');
			$log.info(row);
			var found = false;
			if (header === 'acct_no') {
				row.push(acctNo);
				found = true;
			} else if (header === 'usage_type_code') {
				row.push(usageType);
				found = true;
			} else if (header === 'usage_units') {
				row.push(units);
				found = true;
			} else {
				angular.forEach(fieldValues, function(fieldValue) {
					if(fieldValue.fieldName === header) {
						$log.info('match! fieldName: ' + fieldValue.fieldName + ' header: ' + header)
						found = true;
						if (fieldValue.value instanceof Date) {
							$log.info('Item was date, converting format');
							var dateStr = $filter('date')(fieldValue.value, 'yyyy-MM-dd');
							row.push(dateStr);	
							$log.info('Date str: ' + dateStr);
						} else {
							row.push(fieldValue.value);	
						}
					}
				}) 
			}
			if (!found) {
				row.push('');
				$log.info('row header not found, adding blank value');
			}
		})
		$log.info('Done!  Row:');
		$log.info(row);
		return row;
	};
	
}]);
