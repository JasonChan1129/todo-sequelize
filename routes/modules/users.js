const express = require('express');
const router = express.Router();
const passport = require('passport');

const db = require('../../models');
const User = db.User;

router.get('/login', (req, res) => {
	res.render('login');
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/users/login',
	})
);

router.get('/register', (req, res) => {
	res.render('register');
});

router.post('/register', async (req, res) => {
	const { name, email, password, confirmPassword } = req.body;
	const errors = [];
	if (!name || !email || !password || !confirmPassword) {
		errors.push({ message: 'All fields are required' });
	}
	if (password !== confirmPassword) {
		errors.push({ message: 'Password not match!' });
	}
	if (errors.length) {
		return res.render('register', { name, email, password, confirmPassword, errors });
	}
	User.findOne({ where: { email } }).then(user => {
		if (user) {
			errors.push({ message: 'That email has been registered!' });
			return res.render('register', {
				name,
				email,
				password,
				confirmPassword,
				errors,
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

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'Logged out successfully!');
	res.redirect('/users/login');
});

module.exports = router;
