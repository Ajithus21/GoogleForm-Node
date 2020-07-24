const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoClient = require('mongodb');
const bcrypt = require('bcrypt');
const app = express();
const url = 'mongodb+srv://dbuser:dbuser@cluster0.ujhbr.mongodb.net/<dbname>?retryWrites=true&w=majority';

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//@Form-post
app.post('/', (req, res) => {
	mongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
		let db = client.db('form');
		db.collection('userForm').insertOne(req.body, (err, data) => {
			if (err) throw err;
			client.close();
			res.json({
				message: 'Form Submitted'
			});
		});
	});
});

//@Admin's Form Creaation
app.post('/adminForm', (req, res) => {
	mongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
		let db = client.db('form');
		db.collection('adminForm').insertOne(req.body, (err, data) => {
			if (err) throw err;
			client.close();
			res.json({
				message: 'Form Submitted'
			});
		});
	});
});

//@ Admin Login
app.post('/login', (req, res) => {
	//console.log('hello')
	mongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
		if (err) throw err;
		const userData = {
			username: req.body.username,
			password: req.body.password
		};
		console.log(userData);
		var db = client.db('form');

		db.collection('Admin').findOne({ username: userData.username }, (err, data) => {
			console.log(data);
			if (err) throw err;
			if (data) {
				if (userData.password == data.password) {
					client.close();
					res.json({
						message: 'Logged In'
					});
				} else {
					client.close();
					res.json({
						message: 'login failed'
					});
				}
			} else {
				client.close();
				res.json({
					message: 'login failed'
				});
			}
		});
	});
});

// @ Admin Form Details
app.get('/forms', (req, res) => {
	mongoClient.connect(url, (err, client) => {
		var db = client.db('form');
		db.collection('userForm').find().toArray((er, data) => {
			if (err) throw err;
			client.close();
			if (data) {
				res.json(data);
				console.log(data);
			} else {
				res.json({
					message: 'No Forms Found'
				});
			}
		});
	});
});

app.get('/adminForms', (req, res) => {
	mongoClient.connect(url, (err, client) => {
		var db = client.db('form');
		db.collection('adminForm').find().toArray((er, data) => {
			if (err) throw err;
			client.close();
			if (data) {
				res.json(data);
				console.log(data);
			} else {
				res.json({
					message: 'No Forms Found'
				});
			}
		});
	});
});

//@Port
app.listen(3000, () => {
	console.log('App listening on port 3000!');
});
