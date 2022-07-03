if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const routes = require('./routes/index');
const usePassport = require('./config/passport');
const app = express();
const PORT = 3000;

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
app.use(routes);

app.listen(PORT, () => {
	console.log(`App is running on http://localhost:${PORT}`);
});
