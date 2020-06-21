const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');

// load validations
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// load user model
const User = require('../../models/User');
const { token } = require('morgan');

// @routes POST api/users/register
// @desc Register User
// @access Public
router.post("/register", (req, res) => {
	// validate form
	const { errors, isValid } = validateRegisterInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	User.findOne({ email: req.body.email }).then(user => {
		if (user) {
			return res.status(400).json({
				email: "Email already exists!"
			});
		} else {
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				password: req.body.password
			});

			// hash password
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) {
						throw err;
					}

					newUser.password = hash;

					newUser
						.save()
						.then(user => res.json(user))
						.catch(err => console.log(err));
				});
			});
		}
	});
});


// @routes POST api/users/login
// @desc Login User
// @access Public
router.post("/login", (req, res) => {
	// form validation
	const { errors, isValid } = validateLoginInput(req.body);

	const email = req.body.email;
	const password = req.body.password;

	// Find user by email
	User.findOne({ email }).then(user => {
		// if user exists
		if (!user) {
			return res.status(404).json({ emailnotfound: "Email not found!" });
		}

		// check password
		bcrypt.compare(password, user.password).then(isMatch => {
			if (isMatch) {
				// user matched
				// create JWT payload 
				const payload = {
					id: user.id,
					name: user.name
				};

				// sign token
				jwt.sign(
					payload,
					process.env.SECRET,
					{
						expiresIn: 10800 // 3 hours
					},
					(err, token) => {
						res.json({
							success: true,
							token: `Bearer: ${token}`
						});
					}
				);
			} else {
				return res
					.status(400)
					.json({ passwordincorrect: "Password Incorrect!" });
			}
		});
	});
});

module.exports = router;