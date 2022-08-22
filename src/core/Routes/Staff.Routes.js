const StaffController = require('../Controllers/Staff.Controller')
module.exports = (router, sm)=>{

    router.post('/staff/login', new StaffController().Authenticate)

    router.get('/staff/branches/:staff_id', new StaffController().FetchBranch)

    return router
}