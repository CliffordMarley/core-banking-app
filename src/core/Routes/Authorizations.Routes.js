const AuthController = require("../Controllers/Authorizations.Controller")
module.exports = (router, sm)=>{

    router.get('/non-transactional-authorizations-customer', sm.validatePage, new AuthController().RenderCustomerAuth)
    
    router.get('/non-transactional-authorizations-changes', sm.validatePage, new AuthController().RenderChangesAuth)


    router.post('/non-transactional-authorizations', sm.validatePage, new AuthController().
    MemberAuthDecision)
    return router
}