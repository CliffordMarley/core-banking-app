const CustomerController = require('../Controllers/Customers.Controller')
module.exports = (router, sm)=>{

    router.get('/customers',  new CustomerController().Search)
    
    router.get('/customer-lookup', sm.validatePage, new CustomerController().RenderLookupPage)

    router.get('/customer-create', sm.validatePage, new CustomerController().RenderCreatePage)

    router.get('/customer-kyc-cdd', sm.validatePage, new CustomerController().RenderKYCPage)

    router.get('/individual-customer-view', sm.validatePage, new CustomerController().RenderIndividualCustomerView)

    return router
}