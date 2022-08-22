const AccountsController = require('../Controllers/Accounts.Controller')

module.exports = (router, sm)=>{

    router.get('/account-create', sm.validatePage, new AccountsController().RenderCreatePage)

    router.get('/transact-deposit',sm.validatePage, (req, res)=>{
        res.render('workspace',{
            title:'MX-Core | Deposit',
            partial:'transact-deposit',
            session:true,
            userdata:req.session.userdata
        })
    })

    router.get('/transact-withdrawal',sm.validatePage, (req, res)=>{
        res.render('workspace',{
            title:'MX-Core | Deposit',
            partial:'transact-withdrawal',
            session:true,
            userdata:req.session.userdata
        })
    })

    return router
}