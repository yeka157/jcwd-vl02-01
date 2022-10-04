const { dbConf, dbQuery } = require("../config/db");
const fs = require('fs');

module.exports = {
    updateProfile: async (req, res) => {
        try {
            let data = {};
            if (req.body.fullName) {
                data = {...data,'name' : req.body.name};
                // await dbQuery(`UPDATE users SET name = ${dbConf.escape(req.body.fullName)} WHERE user_id = ${dbConf.escape(req.dataToken.user_id)}`);
            }
            if (req.body.email) {
                data = {...data, 'email' : req.body.email};
            }
            if (req.body.birthdate) {
                data = {...data, 'birthdate' : req.body.birthdate};
            }
            if (req.body.gender) {
                data = {...data, 'gender' : req.body.gender};
            }
            let prop = Object.keys(data);
            console.log(prop);
            let value = Object.values(data);
            console.log(value);
            let dataQuery = prop.map((val,idx) => {
                return `${prop[idx]} = ${dbConf.escape(value[idx])}`
            }).join(', ');
            console.log(dataQuery);
            let update = await dbQuery(`UPDATE users set ${dataQuery} WHERE user_id = ${dbConf.escape(req.dataToken.user_id)}`);
            console.log(update);
            if (update.affectedRows) {
                res.status(200).send({ success: true });
            }
        } catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
    },
    updatePicture: async (req, res) => {

    },
    addAddress: async (req, res) => {

    },
    editAddress: async (req, res) => {

    },
    deleteAddress: async (req, res) => {

    }
}