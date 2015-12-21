var express = require('express');
var router = express.Router();
var csvGeneratorController = require('../controllers/csvGenerator');
var ariaController = require('../controllers/ariaController');
var tenantController = require('../controllers/tenantController');

// if tenant is a query string, lookup tenant info from db and add to req object, throw error if not found
router.use(function(req, res, next) {
	if(req.query.tenantNo) {
		// lookup tenant, add tenant object to req object
		next();
		// if tenant not found, respond with error
	} else {
		next();
	}
});

/** CSV GENERATOR **/

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



/** ARIA API RETREIVAL **/

/* GET plans from an Aria tenant */
router.get('/plans', ariaController.getPlans);

/* GET usage types for a plan from an Aria tenant */
router.get('/plans/:planNo/usageTypes', ariaController.getUsageTypes);

/* GET plans for an account from an Aria tenant */
router.get('/account/:acctNo/plans', ariaController.getAcctPlans);

router.get('/account/:acctNo/plans/usageTypes', ariaController.getAcctPlanUsageTypes);

/* GET accounts from an Aria tenant */
router.get('/accounts', ariaController.getAccounts);



/** TENANTS **/

/* GET teants */
router.get('/tenant', tenantController.getTenants);

/* GET tenant by id */
router.get('/tenant/:id', tenantController.getTenantById);

/* GET tenant by client no */
router.get('/tenant/clientNo/:clientNo', tenantController.getTenantByClientNo);

/* CREATE tenant */
router.post('/tenant', tenantController.createTenant);

/* UPDATE tenant */
router.put('/tenant/:id', tenantController.updateTenant);

/* DELETE tenant */
router.delete('/tenant/:id', tenantController.deleteTenant);



module.exports = router;
