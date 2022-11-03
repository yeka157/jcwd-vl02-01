const { dbConf, dbQuery } = require('../config/db');
const fs = require('fs');
const path = require('path');
const { transport } = require('../config/nodemailer');
const hbs = require('nodemailer-express-handlebars');

module.exports = {
	addCustomTransaction: async (req, res) => {
		try {
			let { user_id, transaction_status, invoice, delivery_option, delivery_charge, province, city, city_id, district, address_detail, receiver } = JSON.parse(req.body.data);
			let prescription = `/imgPrescription/${req.files[0].filename}`;

			let resInsert =
				await dbQuery(`INSERT INTO transactions (user_id, transaction_status, invoice, province, city, city_id, district,  address_detail, doctor_prescription, delivery_option, delivery_charge, receiver) VALUES 
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
            ${dbConf.escape(delivery_charge)},
			${dbConf.escape(receiver)});`);

			if (resInsert.insertId) {
				res.status(200).send({
					success: true,
					massage: 'Prescription Uploaded',
				});
			}
		} catch (error) {
			console.log(error);
			res.status(500).send({ success: false, message: error });
		}
	},
	addTransaction: async (req, res) => {
		try {
			let { user_id, transaction_status, invoice, delivery_option, delivery_charge, province, city, city_id, district, address_detail, total_purchase, transaction_detail, receiver } = req.body;

			let resOrder = await dbQuery(`INSERT INTO transactions (user_id, transaction_status, invoice, province, city, city_id, district,  address_detail, delivery_option, delivery_charge, total_purchase, receiver) VALUES 
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
            ${dbConf.escape(total_purchase)},
			${dbConf.escape(receiver)});
            `);

			// Add to transaction detail
			if (resOrder.insertId) {
				let detailValues = transaction_detail.map(item => [
					resOrder.insertId,
					item.quantity,
					item.product_id,
					item.product_name,
					item.product_image,
					item.product_price,
					item.product_description,
					item.default_unit
				])

				let transDetailQuery = `INSERT INTO transaction_detail (transaction_id, quantity, product_id, product_name, product_image, product_price, product_description, product_unit) VALUES ?`
				let resDetail = await dbQuery(transDetailQuery, [detailValues]);

				// Add to reports
				let reportValues = transaction_detail.map(item => [
					resOrder.insertId,
					item.product_id,
					item.product_name,
					item.product_image,
					item.default_unit,
					item.quantity,
					'Selling',
					'Substraction'
				])

				let reportQuery = `INSERT INTO reports (transaction_id,  product_id, product_name, product_image, product_unit, quantity, type, note) VALUES ?`
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
				massage: 'Stock update success'
			})

		} catch (error) {
			console.log(error);
			res.status(500).send({ success: false, message: error });
		}
	},
	stockRecovery: async (req, res) => {
		try {
			const { quantity, product_id, transaction_id, product_name, product_image, product_unit } = req.body.data

			if (product_unit == 'Kapsul' || product_unit == 'Mililiter' || product_unit == 'Tablet') {
				await dbQuery(`UPDATE stock s SET product_conversion_stock = s.product_conversion_stock + ${quantity} WHERE s.product_id = ${product_id};`);
			} else {
				await dbQuery(`UPDATE stock s SET product_stock = s.product_stock + ${quantity} WHERE s.product_id = ${product_id};`);
			};

			await dbQuery(`INSERT INTO reports (transaction_id,  product_id, product_name, product_image, product_unit, quantity, type, note)
                VALUES (
                ${dbConf.escape(transaction_id)}, 
                ${dbConf.escape(product_id)}, 
                ${dbConf.escape(product_name)}, 
                ${dbConf.escape(product_image)}, 
                ${dbConf.escape(product_unit)},
                ${quantity},
                'Stock recovery',
                'Addition'
                );`)

			res.status(200).send({
				success: true,
				massage: 'Stock update success'
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
				filter.push(`order_date >= '${from}' AND order_date <= '${to + ' 23:59:59'}'`)
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

				addDetail.push({ ...resTransaction[i], transaction_detail: resDetail });
			}

			const resCount = await dbQuery(`SELECT COUNT(*) as count from transactions 
        ${filter.length == 0 ? '' : `WHERE ${filter.join(' AND ')}`};`);

			res.status(200).send({
				success: true,
				transactions: addDetail,
				count: resCount[0].count,
				massage: 'Get data success',
			});
			
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
			}

			res.status(200).send({
				success: true,
				total_data: count[0].count,
				massage: 'Get data success',
			});
		} catch (error) {
			console.log(error);
			res.status(500).send({ success: false, message: error });
		}
	},
	getTransactionDetail: async (req, res) => {
		try {
			let resData = await dbQuery(`SELECT * from transactions
            WHERE transaction_id = ${req.params.transaction_id}`);

			let transDetail = await dbQuery(`SELECT * from transaction_detail
            WHERE transaction_id = ${req.params.transaction_id}`);

			res.status(200).send({
				...resData[0],
				detail: transDetail,
				success: true,
			});
		} catch (error) {
			console.log(error);
			res.status(500).send({ success: false, message: error });
		}
	},
	updateStatus: async (req, res) => {
		try {
			let resUpdate = await dbQuery(`UPDATE transactions SET transaction_status = ${dbConf.escape(req.body.newStatus)} WHERE transaction_id = ${req.params.transaction_id};`);

			if (resUpdate.affectedRows) {
				res.status(200).send({
					success: true,
					message: 'Status updated',
				});
			}
		} catch (error) {
			console.log(error);
			res.status(500).send({ success: false, message: error });
		}
	},
	uploadPAymentProof: async (req, res) => {
		try {
			let images = `/imgPayment/${req.files[0].filename}`;

			let resUpoad = await dbQuery(`UPDATE transactions SET payment_proof = ${dbConf.escape(images)} WHERE transaction_id = ${req.params.transaction_id};`);

			res.status(200).send({
				success: true,
				massage: 'Payent Proof Uploaded',
			});
		} catch (error) {
			console.log(error);
		}
	},
	handleDoctorPrescription: async (req, res) => {
		try {
			const product_id = req.params.product_id;
			let { ingredients, productDetails, transactionDetails } = req.body;
			let { quantity, product_unit, isConversion, total_purchase } = ingredients;

			if (req.dataToken.role !== 'ADMIN') {
				res.status(401).send({ success: false, message: 'You not authorized for this activity' });
				return;
			}

			let productStock = await dbQuery(`SELECT * FROM stock WHERE product_id = ${dbConf.escape(product_id)}`);
			if (productStock.length === 0) {
				res.status(404).send({ success: false, message: 'Stock not found' });
				return;
			}
			productStock = productStock[0];

			let newProductStock;
			let productPrice;
			if (!isConversion) {
				newProductStock = productStock.product_stock - quantity;
				productPrice = productDetails.product_price;
				// UPDATE STOCK
				await dbQuery(`UPDATE stock SET product_stock=${newProductStock} WHERE product_id=${dbConf.escape(product_id)};`);

				// // POST TRANSACTION DETAIL
				await dbQuery(`INSERT INTO transaction_detail (transaction_id, quantity, product_id, product_name, product_image, product_price, product_description, product_unit) VALUES
					(
						${dbConf.escape(transactionDetails.transaction_id)},
						${dbConf.escape(quantity)},
						${dbConf.escape(product_id)},
						${dbConf.escape(productDetails.product_name)},
						${dbConf.escape(productDetails.product_image)},
						${dbConf.escape(productPrice)},
						${dbConf.escape(productDetails.product_description)},
						${dbConf.escape(product_unit)}
					);
				`);

				// POST REPORTS: SUBSTRACT DEFAULT UNIT
				await dbQuery(`INSERT INTO reports (transaction_id, product_id, quantity, type, note, product_name, product_image, product_unit) VALUES
					(
						${dbConf.escape(transactionDetails.transaction_id)},
						${dbConf.escape(product_id)},
						${dbConf.escape(quantity)},
						${dbConf.escape('Selling')},
						${dbConf.escape('Substraction')},
						${dbConf.escape(productDetails.product_name)},
						${dbConf.escape(productDetails.product_image)},
						${dbConf.escape(product_unit)}
					);
				`);

				// RUBAH STATUS -> AWAITING PAYMENT
				await dbQuery(`UPDATE transactions SET transaction_status = ${dbConf.escape('Awaiting Payment')} WHERE transaction_id = ${dbConf.escape(transactionDetails.transaction_id)};`);
				res.status(200).send({ success: true });
				return;
			}

			// let product_stock = productStock.product_stock;
			// let stockAmount = productStock.product_stock * productStock.product_netto + productStock.product_conversion_stock;
			let productStockSubstractAmount = productStock.product_conversion_stock - quantity >= 0 ? 0 : Math.ceil((quantity - productStock.product_conversion_stock) / productStock.product_netto);
			newProductStock = productStock.product_stock - productStockSubstractAmount;
			let conversionStockAdditionAmount = productStockSubstractAmount * productStock.product_netto;
			let conversionStockSubstractAmount = quantity;
			let conversionStock = productStock.product_conversion_stock + conversionStockAdditionAmount;
			let newConversionStock = conversionStock - quantity;
			productPrice = productDetails.product_price / productStock.product_netto;
			// UPDATE STOCK
			await dbQuery(`UPDATE stock SET product_stock=${newProductStock}, product_conversion_stock=${newConversionStock} WHERE product_id=${dbConf.escape(product_id)};`);

			// // POST TRANSACTION DETAIL
			await dbQuery(`INSERT INTO transaction_detail (transaction_id, quantity, product_id, product_name, product_image, product_price, product_description, product_unit) VALUES
				(
					${dbConf.escape(transactionDetails.transaction_id)},
					${dbConf.escape(quantity)},
					${dbConf.escape(product_id)},
					${dbConf.escape(productDetails.product_name)},
					${dbConf.escape(productDetails.product_image)},
					${dbConf.escape(productPrice)},
					${dbConf.escape(productDetails.product_description)},
					${dbConf.escape(product_unit)}
				);
			`);

			// SUBSTRACT DEFAULT UNIT IF NEED CONVERSION
			if (productStockSubstractAmount) {
				await dbQuery(`INSERT INTO reports (transaction_id, product_id, quantity, type, note, product_name, product_image, product_unit) VALUES
					(
						${dbConf.escape(transactionDetails.transaction_id)},
						${dbConf.escape(product_id)},
						${dbConf.escape(productStockSubstractAmount)},
						${dbConf.escape('Unit Conversion')},
						${dbConf.escape('Substraction')},
						${dbConf.escape(productDetails.product_name)},
						${dbConf.escape(productDetails.product_image)},
						${dbConf.escape(productDetails.default_unit)}
					);
				`);
			}

			// ADD CONVERSION UNIT
			if (conversionStockAdditionAmount) {
				await dbQuery(`INSERT INTO reports (transaction_id, product_id, quantity, type, note, product_name, product_image, product_unit) VALUES
					(
						${dbConf.escape(transactionDetails.transaction_id)},
						${dbConf.escape(product_id)},
						${dbConf.escape(conversionStockAdditionAmount)},
						${dbConf.escape('Unit Conversion')},
						${dbConf.escape('Addition')},
						${dbConf.escape(productDetails.product_name)},
						${dbConf.escape(productDetails.product_image)},
						${dbConf.escape(productStock.product_conversion)}
					);
				`);
			}

			// SUBSTRACT CONVERSION UNIT
			await dbQuery(`INSERT INTO reports (transaction_id, product_id, quantity, type, note, product_name, product_image, product_unit) VALUES
				(
					${dbConf.escape(transactionDetails.transaction_id)},
					${dbConf.escape(product_id)},
					${dbConf.escape(conversionStockSubstractAmount)},
					${dbConf.escape('Selling')},
					${dbConf.escape('Substraction')},
					${dbConf.escape(productDetails.product_name)},
					${dbConf.escape(productDetails.product_image)},
					${dbConf.escape(productStock.product_conversion)}
				);
			`);

			// RUBAH STATUS -> AWAITING PAYMENT
			await dbQuery(`UPDATE transactions SET transaction_status = ${dbConf.escape('Awaiting Payment')} WHERE transaction_id = ${dbConf.escape(transactionDetails.transaction_id)};`);
			res.status(200).send({ success: true });
		} catch (error) {
			console.log(error);
			res.status(500).send({ message: error });
		}
	},
	updateTotalPurchase: async (req, res) => {
		try {
			let transaction_id = req.params.transaction_id;
			let { total_purchase } = req.body;
			let transaction = await dbQuery(`SELECT * from transactions WHERE transaction_id = ${dbConf.escape(transaction_id)}`);
			if (transaction.length > 0) {
				await dbQuery(`UPDATE transactions SET total_purchase = ${dbConf.escape(total_purchase + transaction[0].delivery_charge)} WHERE transaction_id = ${dbConf.escape(transaction_id)};`);
				res.status(200).send({ success: true });
			}
		} catch (error) {
			console.log(error);
			res.status(500).send({ message: error });
		}
	},
	sendEmailNotification: async (req, res) => {
		try {
			let { invoice, transaction_status } = req.body;

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

			let getUser = await dbQuery(`SELECT user_id, username, email, phone_number from users WHERE user_id =${req.params.id}`);
			transport.sendMail({
				from: 'Sehat Bos <sehatbos@shop.com>',
				to: getUser[0].email,
				subject: 'Email Notification',
				template: 'emailNotification',
				context: {
					transaction_status,
					invoice
				},
			});

			res.status(200).send({
				success: true,
				message: 'Email has been sent!'
			});
		} catch (error) {
			console.log(error);
			res.status(500).send(error);
		}
	}
};
