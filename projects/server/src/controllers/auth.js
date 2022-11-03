const { dbConf, dbQuery } = require('../config/db');
const { hashPassword, createToken } = require('../config/encrypt');
const { transport } = require('../config/nodemailer');
const hbs = require('nodemailer-express-handlebars');
const fs = require('fs');
const path = require('path');

module.exports = {
	getUsers: async (req, res) => {
		try {
			let resUsers = await dbQuery('SELECT username, email, phone_number from users');

			res.status(200).send(resUsers);
		} catch (error) {
			console.log(error);
			res.status(500).send(error);
		}
	},
	register: async (req, res) => {
		try {
			let { username, email, password, phone_number } = req.body;

			const handlebarOptions = {
				viewEngine: {
					extName: '.handlebars',
					partialsDir: path.resolve('./src/template'),
					defaultLayout: false,
				},
				viewPath: path.resolve('./src/template'),
				extName: '.handlebars',
			};

			transport.use('compile', hbs(handlebarOptions));

			let sqlInsert = await dbQuery(`INSERT INTO users (username, email, password, phone_number) 
            values ('${username}', '${email}',  '${hashPassword(password)}', '${phone_number}');`);

			if (sqlInsert.insertId) {
				let getUser = await dbQuery(`SELECT user_id, username, email, phone_number from users WHERE user_id =${sqlInsert.insertId}`);

				let token = createToken({ ...getUser[0] }, '2h');

				let link = `http://localhost:3000/verification/${token}`;
				let name = getUser[0].username;

				transport.sendMail({
					from: 'Sehat Bos <sehatbos@shop.com>',
					to: getUser[0].email,
					subject: 'Verification Email Account',
					template: 'emailVerification',
					context: {
						name,
						link,
					},
				});

				res.status(200).send({
					success: true,
					message: 'Register Success',
					token,
				});
			}
		} catch (error) {
			console.log(error);
			res.status(500).send(error);
		}
	},
	verify: async (req, res) => {
		try {
			if (req.dataToken.user_id) {
				await dbQuery(`UPDATE users SET status = 'VERIFIED' WHERE user_id = ${dbConf.escape(req.dataToken.user_id)}`);

				let resUser = await dbQuery(`SELECT user_id, name, username, email, phone_number, role, status from users WHERE user_id = ${dbConf.escape(req.dataToken.user_id)}`);

				if (resUser.length > 0) {
					let token = createToken({ ...resUser[0] });

					res.status(200).send({
						success: true,
						message: 'Verify success',
						dataUser: resUser[0],
						token,
					});
				}
			}
		} catch (error) {
			console.log(error);
			res.status(500).send({
				success: false,
				massage: 'Verification failed',
			});
		}
	},
	verificationRequest: async (req, res) => {
		try {
			const handlebarOptions = {
				viewEngine: {
					extName: '.handlebars',
					partialsDir: path.resolve('./src/template'),
					defaultLayout: false,
				},
				viewPath: path.resolve('./src//template'),
				extName: '.handlebars',
			};

			transport.use('compile', hbs(handlebarOptions));

			let resGet = await dbQuery(`SELECT user_id, name, username, email, phone_number, role, status from users WHERE user_id = ${dbConf.escape(req.dataToken.user_id)}`);

            if (resGet.length > 0) {
                let token = createToken({ ...resGet[0] });
                let link = `http://localhost:3000/verification/${token}`;
                let name = resGet[0].name;
                
                transport.sendMail({
                    from: 'Sehat Bos <sehatbos@shop.com>',
                    to: resGet[0].email,
                    subject: 'Verification Email Account',
                    template: 'emailVerification',
                    context: {
                        name,
                        link
                    }
                });

				res.status(200).send({
					success: true,
					message: 'Verification sent',
					token,
				});
			}
		} catch (error) {
			console.log(error);
			res.status(500).send({
				success: false,
				massage: 'Verification failed',
			});
		}
	},
	login: async (req, res) => {
		try {
			const { credential, password } = req.body;

			let resUser = await dbQuery(`SELECT user_id, name, username, email, phone_number, role, profile_picture, status, birthdate, gender from users 
            WHERE ${credential.includes('@' && '.co') ? `email = ${dbConf.escape(credential)}` : `username = ${dbConf.escape(credential)}`}
            AND password = ${dbConf.escape(hashPassword(password))};`);

			let cartUser =
				await dbQuery(`SELECT c.cart_id, p.default_unit, c.product_id, p.product_name, p.product_price, p.product_image, s.product_stock, p.product_description, c.is_selected, c.quantity from carts c
            JOIN products p ON p.product_id = c.product_id
            JOIN stock s ON s.product_id = c.product_id
            WHERE c.user_id = ${resUser[0].user_id};`);

			let getAdress = await dbQuery(`Select * from address WHERE user_id = ${dbConf.escape(resUser[0].user_id)};`);

			if (resUser.length > 0) {
				let token = createToken({ ...resUser[0] });

				res.status(200).send({
					success: true,
					massage: 'Login success',
					dataUser: resUser[0],
					cart: cartUser,
					address: getAdress,
					token,
				});
			} else {
				res.status(200).send({
					success: false,
					message: 'Login failed',
				});
			}
		} catch (error) {
			console.log(error);
			res.status(500).send({
				succes: false,
				massage: 'Login failed',
			});
		}
	},
	keepLogin: async (req, res) => {
		try {
			let resUser = await dbQuery(
				`SELECT user_id, name, username, email, phone_number, role, status, birthdate, gender, profile_picture from users WHERE user_id = ${dbConf.escape(req.dataToken.user_id)};`
			);
			let cartUser =
				await dbQuery(`SELECT c.cart_id, p.default_unit, c.product_id, p.product_name, p.product_price, p.product_image, s.product_stock, p.product_description, c.is_selected, c.quantity from carts c
            JOIN products p ON p.product_id = c.product_id
            JOIN stock s ON s.product_id = c.product_id
            WHERE c.user_id = ${req.dataToken.user_id};`);

			if (resUser.length > 0) {
				let token = createToken({ ...resUser[0] });

				res.status(200).send({
					success: true,
					massage: 'Keep login success',
					dataUser: resUser[0],
					cart: cartUser,
					token,
				});
			}
		} catch (error) {
			res.status(500).send({
				succes: false,
				massage: 'Login failed',
			});
		}
	},
	sendResetPassword: async (req, res) => {
		try {
			const handlebarOptions = {
				viewEngine: {
					extName: '.handlebars',
					partialsDir: path.resolve('./src/template'),
					defaultLayout: false,
				},
				viewPath: path.resolve('./src/template'),
				extName: '.handlebars',
			};

			transport.use('compile', hbs(handlebarOptions));

			let resGet = await dbQuery(`SELECT user_id, name, username, email, phone_number, role, status from users WHERE email = ${dbConf.escape(req.body.email)}`);

			let token = createToken({ ...resGet[0] });
			let link = `http://localhost:3000/reset_password/${token}`;
			let name = resGet[0].name;

			transport.sendMail({
				from: 'Sehat Bos <sehatbos@shop.com>',
				to: resGet[0].email,
				subject: 'Password Recovery',
				template: 'passwordRecovery',
				context: {
					name,
					link,
				},
			});

			res.status(200).send({
				success: true,
				message: 'Password recovery sent',
				token,
			});
		} catch (error) {
			console.log(error);
			res.status(500).send({
				succes: false,
				massage: 'Recovery failed',
			});
		}
	},
	resetPassword: async (req, res) => {
		try {
			if (req.dataToken.user_id) {
				let resUser = await dbQuery(`UPDATE users SET password = ${dbConf.escape(hashPassword(req.body.password))} WHERE user_id = ${dbConf.escape(req.dataToken.user_id)}`);

				res.status(200).send({
					success: true,
					message: 'Reset password success',
				});
			}
		} catch (error) {
			console.log(error);
			res.status(500).send({
				succes: false,
				massage: 'Reset password failed',
			});
		}
	},
	changePasswordRequest: async (req, res) => {
		try {
			const handlebarOptions = {
				viewEngine: {
					extName: '.handlebars',
					partialsDir: path.resolve('./src/template'),
					defaultLayout: false,
				},
				viewPath: path.resolve('./src/template'),
				extName: '.handlebars',
			};

			transport.use('compile', hbs(handlebarOptions));

			let resGet = await dbQuery(`SELECT user_id, name, username, email, phone_number, role, status from users WHERE user_id = ${dbConf.escape(req.dataToken.user_id)}`);

			if (resGet.length > 0) {
				let token = createToken({ ...resGet[0] });
				let link = `http://localhost:3000/change_password/${token}`;
				let name = resGet[0].username;

				transport.sendMail({
					from: 'Sehat Bos <sehatbos@shop.com>',
					to: resGet[0].email,
					subject: 'Change Password',
					template: 'changePassword',
					context: {
						name,
						link,
					},
				});

				res.status(200).send({
					success: true,
					message: 'Verification sent',
					token,
				});
			}
		} catch (error) {
			console.log(error);
			res.status(500).send({
				success: false,
				massage: 'Request failed',
			});
		}
	},
	changePassword: async (req, res) => {
		try {
			let resUser = await dbQuery(`SELECT user_id, name, username, email, phone_number, role, status from users 
            WHERE email = ${dbConf.escape(req.dataToken.email)} AND password = ${dbConf.escape(hashPassword(req.body.oldPassword))};`);

			if (resUser.length > 0) {
				await dbQuery(`UPDATE users SET password = ${dbConf.escape(hashPassword(req.body.password))} WHERE user_id = ${dbConf.escape(req.dataToken.user_id)}`);
				res.status(200).send({
					success: true,
					message: 'Change password success',
				});
			} else {
				res.status(200).send({
					success: false,
					message: 'Change password fail',
				});
			}
		} catch (error) {
			res.status(500).send({
				success: false,
				massage: 'Request failed',
			});
		}
	},
};
