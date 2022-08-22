
module.exports = (router, sm)=>{

    router.get('/workspace',sm.validatePage, (req, res)=>{
        let feedBack = req.flash('message')
        console.log(feedBack)
        res.render('workspace', {
            title:'MX-Core | Home',
            partial:"daily-session",
            session:true,
            userdata:req.session.userdata,
            message:feedBack.length > 0 ? feedBack[0] : ''

        })
    })

    router.get('/login', (req, res)=>{
        res.render('login',{
            title:"MX-Core | Login"
        })
    })

    router.get('/logout', (req, res)=>{
        req.session.userdata = null
        res.redirect('/login')
    })

    return router
}