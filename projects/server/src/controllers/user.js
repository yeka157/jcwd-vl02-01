const { dbConf, dbQuery } = require("../config/db");
const fs = require('fs');
const { Axios } = require("axios");

module.exports = {
    updateProfile: async (req, res) => {
        try {
            let data = {};
            if (req.body.name) {
                data = { ...data, 'name': req.body.name };
            }
            if (req.body.email) {
                data = { ...data, 'email': req.body.email };
            }
            if (req.body.birthdate) {
                data = { ...data, 'birthdate': req.body.birthdate };
            }
            if (req.body.gender) {
                data = { ...data, 'gender': req.body.gender };
            }
            let prop = Object.keys(data);
            console.log(prop);
            let value = Object.values(data);
            console.log(value);
            let dataQuery = prop.map((val, idx) => {
                return `${prop[idx]} = ${dbConf.escape(value[idx])}`
            }).join(', ');
            console.log(dataQuery);
            let update = await dbQuery(`UPDATE users set ${dataQuery} WHERE user_id = ${dbConf.escape(req.dataToken.user_id)};`);
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
        try {
            console.log(req.files);
            let update = await dbQuery(`UPDATE users set profile_picture = ${dbConf.escape(`/imgProfile/${req.files[0].filename}`)};`);
            if (update.affectedRows) {
                res.status(200).send({ success: true });
            } else {
                res.status(400).send({ success: false });
            }
        } catch (error) {
            fs.unlinkSync(`../public/imgProfile/${req.files[0].filename}`)
            console.log(error);
            res.status(500).send(error);
        }
    },
    addAddress: async (req, res) => {
        try {
            let getData = await dbQuery(`Select * from address WHERE user_id = ${dbConf.escape(req.dataToken.user_id)};`);
            if (getData.length > 0) {
                let addData = await dbQuery(`INSERT INTO address (user_id, province, city, city_id, address_detail, district, main_address) VALUES 
                (${dbConf.escape(req.dataToken.user_id)}, ${dbConf.escape(req.body.province)}, ${dbConf.escape(req.body.city)}, ${dbConf.escape(req.body.city_id)}, ${dbConf.escape(req.body.address_detail)}, 
                ${dbConf.escape(req.body.district)}, 0)`);
                if (addData.insertId) {
                    res.status(200).send({ success: true });
                } else {
                    res.status(500).send({ success: false });
                }
            } else {
                let addData = await dbQuery(`INSERT INTO address (user_id, province, city, city_id, address_detail, district, main_address) VALUES 
                (${dbConf.escape(req.dataToken.user_id)}, ${dbConf.escape(req.body.province)}, ${dbConf.escape(req.body.city)}, ${dbConf.escape(req.body.city_id)}, ${dbConf.escape(req.body.address_detail)}, 
                ${dbConf.escape(req.body.district)}, 1)`);
                if (addData.insertId) {
                    res.status(200).send({ success: true });
                } else {
                    res.status(500).send({ success: false });
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    editAddress: async (req, res) => {
        try {
            let update = await dbQuery(`UPDATE address set province=${dbConf.escape(req.body.province)}, city=${dbConf.escape(req.body.city)},
            city_id=${dbConf.escape(req.body.city_id)}, address_detail=${dbConf.escape(req.body.address_detail)}, 
            district=${dbConf.escape(req.body.district)} WHERE address_id=${req.params.id};`);
            if (update.affectedRows) {
                let getData = await dbQuery(`Select * from address WHERE user_id = ${dbConf.escape(req.dataToken.user_id)};`);
                res.status(200).send(getData);
            } else {
                res.status(500).send({ success: false });
            }
        } catch (error) {
            console.log(error);
            res.status(200).send(error);
        }
    },
    deleteAddress: async (req, res) => {
        try {
            let delete_address = await dbQuery(`DELETE from address WHERE address_id = ${req.params.id};`);
            if (delete_address.affectedRows) {
                let getData = await dbQuery(`Select * from address WHERE user_id = ${dbConf.escape(req.dataToken.user_id)};`);
                res.status(200).send(getData);
            } else {
                res.status(500).send({ success: false });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    getAddress: async (req, res) => {
        try {
            let getData = await dbQuery(`Select * from address WHERE user_id = ${dbConf.escape(req.dataToken.user_id)};`);
            res.status(200).send(getData);
            console.log(getData);
        } catch (error) {
            console.log(error);
            res.status(200).send(error);
        }
    },
    changeMainAddress: async (req, res) => {
        try {
            //buat semua address jadi 0
            let change = await dbQuery(`UPDATE address set main_address=0 WHERE user_id = ${dbConf.escape(req.dataToken.user_id)};`);
            //buat address selected jadi 1
            if (change.affectedRows) {
                let update = await dbQuery(`UPDATE address set main_address=1 WHERE address_id=${req.params.id};`);
                if (update.affectedRows) {
                    let getData = await dbQuery(`Select * from address WHERE user_id = ${dbConf.escape(req.dataToken.user_id)};`);
                    res.status(200).send(getData);
                } else {
                    res.status(500).send({ success: false });
                }
            } else {
                res.status(500).send({ success: false });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }, // Vikri: APKG1-32
    getMainAddress: async (req, res) => {
        try {
            let resAddress = await dbQuery(`SELECT * from address WHERE user_id = ${req.dataToken.user_id} AND main_address = 1;`);

            console.log('ini data address', resAddress);
            res.status(200).send({
                success: true,
                address: resAddress[0]
            })

        } catch (error) {
            res.status(500).send({
                success: false,
                massage: "Failed"
            })
        }
    }
}