const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

//-------------GENRAL CONFIGURATION----------
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.use('/public', express.static('public'));
// app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
//-------------------------------------------
app.set('views', path.join(__dirname, '/views'));

//------------ROUTERS------------------------
const indexRoutes = require('./routes/index');
//---------------------------------------------

app.use('/', indexRoutes);

const port = 3000;
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`app listening on port ${port}!`));
