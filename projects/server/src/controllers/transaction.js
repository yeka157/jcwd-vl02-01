const { dbConf, dbQuery } = require('../config/db');

module.exports = {
    addCustomTransaction: async (req, res) => {
        try {
            let { user_id, transaction_status, invoice, delivery_option, delivery_charge, province, city, city_id, district, address_detail } = JSON.parse(req.body.data);
            let prescription = `/imgPrescription/${req.files[0].filename}`

            let resInsert = await dbQuery(`INSERT INTO transactions (user_id, transaction_status, invoice, province, city, city_id, district,  address_detail, doctor_prescription, delivery_option, delivery_charge) VALUES 
            (${dbConf.escape(user_id)},
            ${dbConf.escape(transaction_status)},
            ${dbConf.escape(invoice)},
            ${dbConf.escape(province)},
            ${dbConf.escape(city)},
            ${dbConf.escape(city_id)},
            ${dbConf.escape(district)},
            ${dbConf.escape(address_detail)},
            ${dbConf.escape(prescription)},
            ${dbConf.escape(delivery_option)},
            ${dbConf.escape(delivery_charge)});`);

            if (resInsert.insertId) {
                res.status(200).send({
                    success: true,
                    massage: 'Prescription Uploaded'
                })
            }

        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: error });

        }
    }
}