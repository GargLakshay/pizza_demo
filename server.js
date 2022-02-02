require('dotenv').config()
const express=require('express')
const app=express()
const ejs=require('ejs')
const path=require('path')
const expressLayout=require('express-ejs-layouts')
const mongoose=require('mongoose');
const session=require('express-session')
const flash=require('express-flash')
const MongoDbStore=require('connect-mongo')(session)
//Database connection
const url= 'mongodb://localhost/pizza';
mongoose.connect(url,{useNewUrlParser: true}) ;
const connection=mongoose.connection;
connection.once('open',()=>{
  console.log('Database connected..');
});
// .catch ( (err) => {
//   console.log('connection failed..')
// });

//session store
let mongoStore= new MongoDbStore({
  mongooseConnection:connection,
  collection: 'sessions'
})


//session config
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  store: mongoStore,
  saveUninitialized: false,
  cookie: {maxAge: 1000*60*60*24}
}))
app.use(flash())

//Assets
app.use(express.static("public"))

//set template engine
app.use(expressLayout)
app.set('views',path.join(__dirname,"/resources/views"))
app.set('view engine', 'ejs')

require('./routes/web')(app)

const PORT=process.env.PORT||3000;
app.listen(PORT,function(){
  console.log("server is running on port 3000");
})
