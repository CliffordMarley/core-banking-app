require('dotenv').config()
const express = require("express")
const compression = require("compression")
const cors = require("cors")
const exphbs = require("express-handlebars")
const Handlebars = require('handlebars') 
const session = require("express-session")
const path = require("path")

const Autoload = require('./Controllers/autoload')

const app = express()
const router = express.Router()


const sm = require("./Config/Session.Config")

const flash = require('connect-flash')

const MembersRoutes = require("./Routes/Members.Routes")(router, sm)
const DashboardRoutes = require("./Routes/Dashboard.Routes")(router, sm)
const StaffRoutes = require("./Routes/Staff.Routes")(router, sm)
const CustomerRoutes = require('./Routes/Customers.Routes')(router, sm)
const COARoutes = require('./Routes/COA.Routes')(router, sm)
const AuthRoutes = require('./Routes/Authorizations.Routes')(router, sm)
const BranchRoutes = require('./Routes/Branch.Routes')(router, sm)
const AccountsRoutes = require('./Routes/Accounts.Routes')(router, sm)

app.set('port', process.env.PORT || 4000)

app.use(compression())
// Invoke middleware
app.use(express.static(__dirname+'/Public'))
//app.use('/uploads',express.static(path.join(__dirname, '/Public/uploads')))
app.use(express.urlencoded({limit:'50mb'}))
app.use(express.json({limit:'50mb'}))
app.set('trust proxy', 1) // trust first proxy

app.use(flash())

// const whiteList = ["https://chatute.com", "https://ussd.chatute.com", "https://core.chatute.com", undefined]
// app.use(cors({
//     origin:(origin, callback)=>{
        
//         if (whiteList.indexOf(origin) !== -1) {
//             callback(null, true)
//           } else {
//             callback(new Error('Blocked by CORS'))
//         }
//     },
//     optionsSuccessStatus:200
// }))

app.use(session({
  secret: 'ivan123solo321',
  resave: true,
  saveUninitialized: true
}))

//app.use(fileUpload({ safeFileNames: true, preserveExtension: true }))

//Add Compression Middleware
app.use(compression())


app.set("views",path.join(__dirname,'Views'))
app.engine('handlebars',exphbs({
    defaultLayout:'main',
    layoutsDir: __dirname + '/Views/layouts/',
    partialsDir: __dirname + '/Views/partials/'
}))
app.set('view engine','handlebars')

app.use('/', MembersRoutes)
app.use('/', DashboardRoutes)
app.use('/', StaffRoutes)
app.use('/', CustomerRoutes)
app.use('/', COARoutes)
app.use('/', AuthRoutes)
app.use('/', BranchRoutes)
app.use('/', AccountsRoutes)

app.get('/uploads/:file_name', (req, res)=>{
    let file = path.join(__dirname, 'Public/uploads/'+req.params.file_name)
    res.sendFile(file)
})

app.get('/system/configure', new Autoload().Run)

app.get('*', sm.validatePage, function(req, res){
    res.render(
        'workspace',
        {
            title:'404',
            session:true,
            partial:'404',
            userdata:req.session.userdata
        }
    );
});

Handlebars.registerHelper('ifeq', function (a, b, options) {
    if (a == b) { return options.fn(this); }
    return options.inverse(this);
});

Handlebars.registerHelper('grt_than', function (a, b, options) {
    if (a.length > b) { return options.fn(this); }
    return options.inverse(this);
});

Handlebars.registerHelper('each_upto', function(ary, max, options) {
    if(!ary || ary.length == 0)
        return options.inverse(this);

    var result = [ ];
    for(var i = 0; i < max && i < ary.length; ++i)
        result.push(options.fn(ary[i]));
    return result.join('');
});

Handlebars.registerHelper('ifnoteq', function (a, b, options) {
    if (a != b) { return options.fn(this); }
    return options.inverse(this);
});

Handlebars.registerHelper('returnOnlyZeroindex', function (a) {
    return a[0]
 })

 //Run all configurations and data seeding
app.listen(app.get("port"), (e)=>{
    console.log(">>> MX Core Listening On Port %s", app.get('port'))
})

