const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 3000;

// database setup
const db = require('./models');
const { raw } = require('mysql2');
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
	return Todo.findAll({ raw: raw, nest: true })
		.then(todos => {
			console.log(todos);
			res.render('index', { todos });
		})
		.catch(err => res.status(422).json(err));
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

app.get('/todos/:id', (req, res) => {
	const id = req.params.id;
	return Todo.findByPk(id, { raw: true })
		.then(todo => {
			res.render('detail', { todo });
		})
		.catch(error => console.log(error));
});

app.listen(PORT, () => {
	console.log(`App is running on http://localhost:${PORT}`);
});
