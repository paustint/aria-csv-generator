var express = require('express');
var router = express.Router();
var csvGeneratorController = require('../controllers/csvGenerator');
var ariaController = require('../controllers/ariaController');

// if tenant is a query string, lookup tenant info from db and add to req object, throw error if not found
router.use(function(req, res, next) {
	if(req.query.clientNo) {
		// lookup tenant, add tenant object to req object
		next();
		// if tenant not found, respond with error
	} else {
		next();
	}
});

/* GET home page. */
router.get('/', csvGeneratorController.apiList);

/* GET api list page. */
router.get('/csvGenerator', csvGeneratorController.apiList);

/* GET api details page. */
router.get('/csvGenerator/:api', csvGeneratorController.apiOptions);

/* POST api to get CSV. */
router.post('/csvGenerator/:api', csvGeneratorController.confirm);

/* POST api to get CSV. */
router.post('/csvGenerator/:api/csv', csvGeneratorController.genCsv);

/* GET plans from an Aria client */
router.get('/getPlans', ariaController.getPlans);

/* GET usage types for a plan from an Aria client */
router.get('/getUsageTypes/:planNo', ariaController.getUsageTypes);

/* GET plans for an account from an Aria client */
router.get('/getAcctPlans/:acctNo', ariaController.getAcctPlans);

/* GET accounts frm an Aria client */
router.get('/getAccts', ariaController.getAccounts);

module.exports = router;
