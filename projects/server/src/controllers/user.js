const { dbConf, dbQuery } = require("../config/db");
const fs = require('fs');

module.exports = {
    updateProfile : async (req,res) => {
        try {
            let data = [];
            let dataQuery = [];
            if (fullName) {
                data.push(`name = ${dbConf.escape(req.body.fullName)}`);
            }
            if (email) {
                data.push(`email = ${dbConf.escape(req.body.email)}`);
            }
            if (birthDate) {
                data.push(`birthdate = ${dbConf.escape(req.body.birthDate)}`);
            }
            if (gender) {
                data.push(`gender = ${dbConf.escape(req.body.gender)}`);
            }
            let update = await dbQuery(`UPDATE users set ${data.join(', ')}`);
            res.status(200).send({success : true})
        } catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
    },
    updatePicture : async(req,res) => {

    },
    addAddress : async (req,res) => {

    },
    editAddress : async(req,res) => {

    },
    deleteAddress : async(req,res) => {

    }
}