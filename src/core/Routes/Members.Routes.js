
const MembersController = require('../Controllers/Members.Controller')

module.exports = router=>{
    
    //Create New Member into The System
    router.post('/members', new MembersController().Create)

    //Fetch List Of Members By Filtration
    router.get('/members', new MembersController().Get)

    //Fetch Single Member By ID
    router.get('/members/:member_id', new MembersController().GetOne)

    //Propose Changes to Existing Member Details
    router.put('/members', new MembersController().ProposeUpdate)

    //Approve Proposed Changes To Existing Member Details
    router.put('/members/approve/:change_id', new MembersController().ApproveUpdate)

    //Reject Proposed Changes To Existing Member Details
    router.put('/members/reject/:change_id', new MembersController().RejectUpdate)

    router.post('/members/kyc', new MembersController().UploadKYC)

    router.get('/members/kyc/:member_id', new MembersController().GetKYC)
    
    
    return router
}