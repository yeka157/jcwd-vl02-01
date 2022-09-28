const { dbConf, dbQuery } = require('../config/db');
const { hashPassword, createToken } = require('../config/encrypt');
const { transport } = require('../config/nodemailer');
const hbs = require('nodemailer-express-handlebars');
const fs = require('fs');
const path = require('path')

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
                    partialsDir: path.resolve('./template'),
                    defaultLayout: false,
                },
                viewPath: path.resolve('./template'),
                extName: '.handlebars',
            }

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
                        link
                    }
                });

                res.status(200).send({
                    success: true,
                    message: 'Register Success',
                    token
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
                        token
                    })
                }
            }

        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                massage: 'Verification failed'
            })
        }
    },
    verificationRequest: async (req, res) => {

        const handlebarOptions = {
            viewEngine: {
                extName: '.handlebars',
                partialsDir: path.resolve('./template'),
                defaultLayout: false,
            },
            viewPath: path.resolve('./template'),
            extName: '.handlebars',
        }

        transport.use('compile', hbs(handlebarOptions));


        let resGet = await dbQuery(`SELECT user_id, name, username, email, phone_number, role, status from users WHERE user_id = ${dbConf.escape(req.dataToken.user_id)}`);

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
            token
        });
    },
    login: async (req, res) => {
        try {
            const { credential, password } = req.body;

            let resUser = await dbQuery(`SELECT user_id, name, username, email, phone_number, role, status from users 
            WHERE ${credential.includes('@' && '.co') ? `email = ${dbConf.escape(credential)}` : `username = ${dbConf.escape(credential)}`}
            AND password = ${dbConf.escape((hashPassword(password)))};`);

            if (resUser.length > 0) {
                let token = createToken({ ...resUser[0] });

                res.status(200).send({
                    success: true,
                    massage: 'Login success',
                    dataUser: resUser[0],
                    token,
                });

            } else {
                res.status(404).send({
                    success: false,
                    message: 'Login failed'

                });
            }

        } catch (error) {
            console.log(error);
            res.status(500).send({
                succes: false,
                massage: "Login failed"
            })
        }
    },
    keepLogin: async (req, res) => {
        try {

            let resUser = await (`SELECT user_id, name, username, email, phone_number, role, status from users WHERE user_id = ${dbConf.escape(req.dataToken.user_id)};`);

            if (resUser.length > 0) {
                let token = createToken({...resUser[0]});

                res.status(200).send({
                    success: true,
                    massage: 'Keep login success',
                    dataUser: resUser[0],
                    token,
                });
            } 
            
        } catch (error) {
            console.log(error);
            res.status(500).send({
                succes: false,
                massage: "Login failed"
            })
        }
    }
}