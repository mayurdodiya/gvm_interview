const express = require('express')
var bodyParser = require('body-parser')

var app = express();

app.use(bodyParser.json());

const db = require('./app/models');
// db.sequelize.sync();

require('./app/routes/auth.routes')(app)
require('./app/routes/movies.routes')(app)
require('./app/routes/user/auth.routes')(app)
require('./app/routes/user/movies.routes')(app)

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.listen(3000, () => {
    console.log('server is running on PORT : http://localhost:3000');
})
