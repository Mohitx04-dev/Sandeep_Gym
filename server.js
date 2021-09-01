const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./server/database/connection');
const cors = require("cors");
const passport = require("passport");
const app = express();
dotenv.config( { path : 'config.env'} )
const PORT = process.env.PORT || 5000
const SECRET= process.env.APP_SECRET
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(passport.initialize());
require("./server/middleware/passport")(passport);
connectDB();
app.use(express.urlencoded({ extended : true}))
app.use('/', require('./server/routes/router'))
if ( process.env.NODE_ENV == "production"){
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client','build', 'index.html'));
});
}
app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});
