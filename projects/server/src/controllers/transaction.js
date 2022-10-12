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
            };

        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: error });

        }
    },
    addTransaction: async (req, res) => {
        try {

            let { user_id, transaction_status, invoice, delivery_option, delivery_charge, province, city, city_id, district, address_detail, total_purchase, transaction_detail } = req.body;


            resOrder = await dbQuery(`INSERT INTO transactions (user_id, transaction_status, invoice, province, city, city_id, district,  address_detail, delivery_option, delivery_charge, total_purchase) VALUES 
            (${dbConf.escape(user_id)},
            ${dbConf.escape(transaction_status)},
            ${dbConf.escape(invoice)},
            ${dbConf.escape(province)},
            ${dbConf.escape(city)},
            ${dbConf.escape(city_id)},
            ${dbConf.escape(district)},
            ${dbConf.escape(address_detail)},
            ${dbConf.escape(delivery_option)},
            ${dbConf.escape(delivery_charge)},
            ${dbConf.escape(total_purchase)});
            `);

            if (resOrder.insertId) {

                let detailValues = transaction_detail.map(item => [
                    resOrder.insertId,
                    item.quantity,
                    item.product_id,
                    item.product_name,
                    item.product_image,
                    item.product_price,
                    item.product_description
                ])

                let transDetailQuery = `INSERT INTO transaction_detail (transaction_id, quantity, product_id, product_name, product_image, product_price, product_description) VALUES ?`
                let resDetail = await dbQuery(transDetailQuery, [detailValues]);

                let reportValues = transaction_detail.map(item => [
                    resOrder.insertId,
                    item.product_id,
                    item.product_name,
                    item.product_image,
                    item.product_price,
                    item.default_unit,
                    item.quantity,
                    'Selling',
                    'Substraction'
                ])

                let reportQuery = `INSERT INTO reports (transaction_id,  product_id, product_name, product_image, product_price, product_unit, quantity, type, note) VALUES ?`
                let resReports = await dbQuery(reportQuery, [reportValues]);

                if (resDetail.insertId && resReports.insertId) {
                    res.status(200).send({
                        success: true,
                        massage: 'Order success'
                    })
                }
            }




        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: error });
        }
    }
}