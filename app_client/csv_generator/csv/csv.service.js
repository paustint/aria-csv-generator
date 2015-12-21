'use strict';

app.service('CsvService', ['$log', function($log) {
	
	/**
	 * Create CSV file from [[]]
	 * @param arrayData (String[][])
	 */ 
	this.createCSV = function(arrayData) {
		var csvContent = "data:text/csv;charset=utf-8,";
		arrayData.foreach(function(currRow, index) {
			var dataString = currRow.join(",");
			
			csvContent += index < arrayData.length ? dataString + "\n" : dataString;
		})
	}
	
}]);
