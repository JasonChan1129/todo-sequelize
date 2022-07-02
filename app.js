const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 3000;

// database setup
const db = require('./models');
const Todo = db.Todo;
const User = db.User;

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

app.get('/users/login', (req, res) => {
	res.render('login');
});

app.post('/users/login', (req, res) => {
	res.send('login');
});

app.get('/users/register', (req, res) => {
	res.render('register');
});

app.post('/users/register', async (req, res) => {
	const { name, email, password, confirmPassword } = req.body;
	const user = await User.create({ name, email, password });
	return res.redirect('/');
});

app.get('/users/logout', (req, res) => {
	res.send('logout');
});

app.listen(PORT, () => {
	console.log(`App is running on http://localhost:${PORT}`);
});
