const BranchController = require("../Controllers/Branch.Controller");
module.exports = (router, sm)=>{

    router.get('/branch-management', sm.validatePage, new BranchController().RenderIndex)
    router.get('/branch-create', sm.validatePage, new BranchController().RenderCreatePage)
    router.get('/branch-view', sm.validatePage, new BranchController().RenderViewPage)

    router.post('/branches', new BranchController().Create)

    return router
}