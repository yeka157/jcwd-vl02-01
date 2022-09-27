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
                let name = getUser[0].email;

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
    }
}