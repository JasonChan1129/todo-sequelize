const express = require('express');
const router = express.Router();

const db = require('../../models');
const Todo = db.Todo;

router.get('/new', (req, res) => {
	res.render('new');
});

router.post('/', (req, res) => {
	const UserId = req.user.id;
	const name = req.body.name;
	return Todo.create({ name, UserId })
		.then(() => res.redirect('/'))
		.catch(error => console.log(error));
});

router.get('/todos/:id', (req, res) => {
	const id = req.params.id;
	return Todo.findByPk(id, { raw: true })
		.then(todo => {
			res.render('detail', { todo });
		})
		.catch(error => console.log(error));
});

router.get('/:id/edit', (req, res) => {
	const userId = req.user._id;
	const _id = req.params.id;
	return Todo.findOne({ _id, userId })
		.lean()
		.then(todo => res.render('edit', { todo }))
		.catch(error => console.log(error));
});

router.put('/:id', (req, res) => {
	const userId = req.user._id;
	const _id = req.params.id;
	const { name, isDone } = req.body;
	return Todo.findOne({ _id, userId })
		.then(todo => {
			todo.name = name;
			todo.isDone = isDone === 'on';
			return todo.save();
		})
		.then(() => res.redirect(`/todos/${_id}`))
		.catch(error => console.log(error));
});

router.delete('/:id', (req, res) => {
	const _id = req.params.id;
	const userId = req.user._id;
	return Todo.findOne({ _id, userId })
		.then(todo => todo.remove())
		.then(() => res.redirect('/'))
		.catch(error => console.log(error));
});

module.exports = router;
