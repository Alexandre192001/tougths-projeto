const express = require("express")
const exphbs = require('express-handlebars')
const session = require("express-session")
const FileStore = require('session-file-store')(session)
const flash = require("express-flash")
const porta = 3000
const conn = require("./db/conn")
const server = express()
const toughtsRouter = require("./routers/toughtsRouter")
const ToughtController = require("./controllers/ToughtsController")
const AuthRoutes = require("./routers/authRouter")

server.use(express.static("public"))
server.use(express.urlencoded({extended:true}))
server.use(express.json())
server.engine("handlebars", exphbs.engine())
server.set("view engine",'handlebars')
server.use(flash())
server.use(
    session({
        name:'session', 
        secret:"secret", 
        resave:false, 
        saveUninitialized:false,
        store: new FileStore({
            logFn: function(){},path: require("path")
            .join(require('os').tmpdir(),'session')
        }),
        cookie:{
            secure:false,
            maxAge:360000,
            expires: new Date(Date.now()+ 360000),
            httpOnly:true
        }}))
        
server.use((req,res,next)=>{
    if(req.session.userid){
        res.locals.session = req.session
    }
    next()
})
server.use('/toughts', toughtsRouter)
server.use("/", AuthRoutes)
server.get('/', ToughtController.showToughts)

conn.sync().then(()=>{
    server.listen(porta)
}).catch((err)=>{
    console.log(err)
})









