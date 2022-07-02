const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 3000;

// view engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// routes
app.get('/', (req, res) => {
	res.send('hello world');
});

app.listen(PORT, () => {
	console.log(`App is running on http://localhost:${PORT}`);
});
