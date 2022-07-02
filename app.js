const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const usePassport = require('./config/passport');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 3000;
const passport = require('passport');

// database setup
const db = require('./models');
const { raw } = require('mysql2');
const Todo = db.Todo;
const User = db.User;

// view engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');

// middleware
app.use(
	session({
		secret: 'ThisIsMySecret',
		resave: false,
		saveUninitialized: true,
	})
);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
usePassport(app);
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.isAuthenticated();
	res.locals.user = req.user;
	next();
});

// routes
app.get('/', (req, res) => {
	return Todo.findAll({ raw: raw, nest: true })
		.then(todos => {
			res.render('index', { todos });
		})
		.catch(err => res.status(422).json(err));
});

app.get('/users/login', (req, res) => {
	res.render('login');
});

app.post(
	'/users/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/users/login',
	})
);

app.get('/users/register', (req, res) => {
	res.render('register');
});

app.post('/users/register', async (req, res) => {
	const { name, email, password, confirmPassword } = req.body;
	User.findOne({ where: { email } }).then(user => {
		if (user) {
			console.log('User already exists');
			return res.render('register', {
				name,
				email,
				password,
				confirmPassword,
			});
		}
		return bcrypt
			.genSalt(10)
			.then(salt => bcrypt.hash(password, salt))
			.then(hash =>
				User.create({
					name,
					email,
					password: hash,
				})
			)
			.then(() => res.redirect('/'))
			.catch(err => console.log(err));
	});
});

app.get('/users/logout', (req, res) => {
	req.logout();
	res.redirect('/users/login');
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
