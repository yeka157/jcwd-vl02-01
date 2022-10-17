const { dbConf, dbQuery } = require('../config/db');
const fs = require('fs');

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
                // Add to transaction detail
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

                // Add to reports
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

                // Delete from cart
                let resCart = await dbQuery(`DELETE from carts WHERE user_id = ${req.dataToken.user_id} AND is_selected = 1`);

                if (resDetail.insertId && resReports.insertId && resCart.affectedRows) {
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
    },
    substractStock: async (req, res) => {
        try {
            let resUpdate = await dbQuery(`UPDATE stock SET product_stock = ${req.body.data} WHERE stock_id = ${req.params.stock_id};`);

            res.status(200).send({
                success: true,
                massage: 'Stocl update success'
            })

        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: error });
        }
    },
    getTransactions: async (req, res) => {
        try {
            const { invoice, transaction_status, order, sort, offset, limit, from, to } = req.query

            let filter = [];

            if (invoice) {
                filter.push(`invoice LIKE '%${invoice}%'`)
            };

            if (transaction_status) {
                filter.push(`transaction_status = ${dbConf.escape(transaction_status)}`)
            };

            if (from && to) {
                filter.push(`order_date BETWEEN '${from}' AND '${to}'`)
            };

            if (req.dataToken.role === 'CUSTOMER') {
                filter.push(`user_id = ${req.dataToken.user_id}`)
            };

            let resTransaction = await dbQuery(`SELECT * from transactions 
            ${filter.length == 0 ? '' : `WHERE ${filter.join(' AND ')}`}
            ${sort == 'Date' ? `ORDER BY order_date ${order}` : ''}
            ${sort == 'Invoice' ? `ORDER BY invoice ${order}` : ''}
            ${limit ? `LIMIT ${limit} OFFSET ${offset}` : ''}
            `);

            let addDetail = [];
            for (let i = 0; i < resTransaction.length; i++) {
                let resDetail = await dbQuery(`SELECT * from transaction_detail 
                WHERE transaction_id = ${dbConf.escape(resTransaction[i].transaction_id)}`);

                addDetail.push({ ...resTransaction[i], transaction_detail: resDetail })
            }

            res.status(200).send({
                success: true,
                transactions: addDetail,
                massage: 'Get data success'
            })


        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: error });
        }
    },
    countTransactionLIst: async (req, res) => {
        try {

            let count = [];

            if (req.dataToken.role == 'CUSTOMER') {
                count = await dbQuery(`SELECT COUNT(*) as count FROM transactions WHERE user_id = ${dbConf.escape(req.dataToken.user_id)};`);
            } else {
                count = await dbQuery(`SELECT COUNT(*) as count FROM transactions;`);
            };

            res.status(200).send({
                success: true,
                total_data: count[0].count,
                massage: 'Get data success'
            })

        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: error });
        }
    }
}