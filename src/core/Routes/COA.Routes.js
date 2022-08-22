const COAController = require('../Controllers/COA.Controller');
module.exports = (router, sm)=>{

    router.get('/chart-of-accounts', sm.validatePage, new COAController().RenderIndexPage)

    router.post('/chart-of-accounts', sm.validatePage, new COAController().Create)
    
    return router
}