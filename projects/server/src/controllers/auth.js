const { dbConf, dbQuery } = require('../config/db');
const { hashPassword, createToken } = require('../config/encrypt');
const { transport } = require('../config/nodemailer');

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
        let { username, email, password, phone_number } = req.body;

        try {
            let sqlInsert = await dbQuery(`INSERT INTO users (username, email, password, phone_number) 
            values ('${username}', '${email}',  '${hashPassword(password)}', '${phone_number}');`);

            console.log(sqlInsert);

            res.status(200).send({
                success: true,
                message: 'Register Success'
            })
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }
}