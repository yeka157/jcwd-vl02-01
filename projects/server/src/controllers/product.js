const { dbConf, dbQuery } = require('../config/db');

module.exports = {
	countProduct: async (req, res) => {
		try {
			let count = await dbQuery(`SELECT COUNT(*) as count FROM products`);
			res.status(200).send({ success: true, total_data: count[0].count });
		} catch (error) {
			res.status(500).send({ success: false, message: error });
			console.log(error);
		}
	},
	getProduct: async (req, res) => {
		try {
			const order = req.query.order;
			const sort = req.query.sort;

			const offset = req.query.offset;
			const limit = req.query.limit;

			const productName = req.query.product_name;
			const categoryName = req.query.category_name;

			const products = await dbQuery(
				`SELECT * FROM products p 
				JOIN categories c ON p.category_id = c.category_id
				${productName && !categoryName ? `WHERE product_name LIKE "${productName}%"` : ''}
				${categoryName && !productName ? `WHERE category_name LIKE "${categoryName}%"` : ''}
				${categoryName && productName ? `WHERE product_name LIKE "${productName}%" AND category_name LIKE "${categoryName}%"` : ''}
				${sort ? 'ORDER BY product_' + sort + ' ' + order : ''} 
				${limit ? 'LIMIT ' + limit + ' OFFSET ' + offset : ''}
			`
			);

			if (products.length > 0) {
				res.status(200).send({ success: true, products });
				return;
			}

			res.status(200).send({ success: true, products: [] });
		} catch (error) {
			res.status(500).send({ success: false, message: error });
			console.log(error);
		}
	},
	addProduct: async (req, res) => {
		try {
			if (req.dataToken.role !== 'ADMIN') {
				res.status(401).send({ success: false, message: 'You not authorized for this activity' });
				return;
			}

			const product_image = `imgProduct/${req.files[0]?.filename}`;

			let { category_id, product_name, product_price, product_description, product_usage, default_unit, product_stock, product_netto, product_conversion } = JSON.parse(req.body.data);

			let product = await dbQuery(`SELECT * FROM products WHERE product_name=${dbConf.escape(product_name)};`);

			if (product.length > 0) {
				res.status(200).send({ success: false, message: 'Product already exists.' });
				return;
			}

			await dbQuery(`INSERT INTO products 
				(category_id, product_name, product_price, product_image, product_description, product_usage, default_unit) VALUES 
				(${dbConf.escape(category_id)},
				${dbConf.escape(product_name)},
				${dbConf.escape(product_price)},
				${dbConf.escape(product_image)},
				${dbConf.escape(product_description)},
				${dbConf.escape(product_usage)},
				${dbConf.escape(default_unit)});
			`);

			const insertedProduct = await dbQuery(`SELECT * FROM products WHERE product_name = ${dbConf.escape(product_name)};`);
			// console.log(insertedProduct)

			if (insertedProduct.length > 0) {
				let stock = await dbQuery(
					`INSERT INTO stock (product_id, product_stock, product_unit, product_netto, product_conversion) VALUES
					(${dbConf.escape(insertedProduct[0].product_id)},
					${dbConf.escape(product_stock)},
					${dbConf.escape(default_unit)},
					${dbConf.escape(product_netto)},
					${dbConf.escape(product_conversion)});
				`
				);

				if (stock.length === 0) {
					res.status(400).send({ success: false, message: 'New product has been added ✅' });
					return;
				}

				res.status(200).send({ success: true, message: 'New product has been added ✅' });
			}
		} catch (error) {
			res.status(500).send({ success: false, message: error });
			console.log(error);
		}
	},
	updateProduct: async (req, res) => {
		try {
			if (req.dataToken.role !== 'ADMIN') {
				res.status(401).send({ success: false, message: 'You not authorized for this activity' });
				return;
			}

			let product_image;
			if (req.files[0]?.filename) {
				product_image = `imgProduct/${req.files[0]?.filename}`;
			}

			let newData = [];

			Object.keys(JSON.parse(req.body.data)).forEach((val) => {
				if (JSON.parse(req.body.data)[val]) {
					newData.push(`${val}=${dbConf.escape(JSON.parse(req.body.data)[val])}`);
				}
			});

			product_image ? newData.push(`product_image=${dbConf.escape(product_image)}`) : '';

			await dbQuery(`UPDATE products SET ${newData.join(', ')} WHERE product_id=${req.params.id}`);
			res.status(200).send({ success: true, message: 'Product has been updated ✅' });
		} catch (error) {
			res.status(500).send({ success: false, message: error });
			console.log(error);
		}
	},
	deleteProduct: async (req, res) => {
		try {
			if (req.dataToken.role !== 'ADMIN') {
				res.status(401).send({ success: false, message: 'You not authorized for this activity' });
				return;
			}

			let id = req.params.id;
			const product = await dbQuery(`SELECT * FROM products WHERE product_id = ${dbConf.escape(id)};`);

			if (product.length === 0) {
				res.status(400).send({ success: false, message: 'Product not found ❌' });
				return;
			}

			await dbQuery(`DELETE FROM products WHERE product_id = ${dbConf.escape(id)};`);
			await dbQuery(`DELETE FROM stock WHERE product_id = ${dbConf.escape(id)};`);

			res.status(200).send({ success: true, message: 'Product has been deleted ✅' });
		} catch (error) {
			res.status(500).send({ success: false, message: error });
			console.log(error);
		}
	},
	getProductStock: async (req, res) => {
		try {
			let productStock = await dbQuery(`SELECT * FROM stock WHERE product_id = ${dbConf.escape(req.params?.id)}`);

			if (productStock.length > 0) {
				res.status(200).send({ success: true, stock: productStock });
				return;
			}

			res.status(200).send({ success: false, stock: [], message: 'Empty product stock!' });
		} catch (error) {
			res.status(500).send({ success: false, message: error });
			console.log(error);
		}
	},
	addProductStock: async (req, res) => {
		try {
			if (req.dataToken.role !== 'ADMIN') {
				res.status(401).send({ success: false, message: 'You not authorized for this activity' });
				return;
			}

			let { product_id, product_stock, product_unit, product_netto, product_conversion } = req.body;

			let stock = await dbQuery(`SELECT * FROM stock WHERE product_id=${dbConf.escape(product_id)} AND product_unit=${dbConf.escape(product_unit)};`);
			if (stock.length > 0) {
				res.status(400).send({ success: false, message: 'Stock already exists!' });
				return;
			}

			await dbQuery(
				`INSERT INTO stock (product_id, product_stock, product_unit, product_netto, product_conversion) VALUES
				(${dbConf.escape(product_id)},
				${dbConf.escape(product_stock)},
				${dbConf.escape(product_unit)},
				${dbConf.escape(product_netto)},
				${dbConf.escape(product_conversion)});
			`
			);

			res.status(200).send({ success: true, message: 'New stock has been added! ✅' });
		} catch (error) {
			res.status(500).send({ success: false, message: error });
			console.log(error);
		}
	},
	updateProductStock: async (req, res) => {
		try {
			if (req.dataToken.role !== 'ADMIN') {
				res.status(401).send({ success: false, message: 'You not authorized for this activity' });
				return;
			}

			let product_id = req.params?.id;
			let productStock = await dbQuery(`SELECT * FROM stock WHERE product_id = ${dbConf.escape(req.params?.id)}`);
			productStock = productStock[0];
			let productDetails = await dbQuery(`SELECT * FROM products WHERE product_id = ${dbConf.escape(req.params?.id)}`);
			productDetails = productDetails[0];

			if (productStock.length === 0) {
				let { product_id, product_stock, product_unit, product_netto, product_conversion } = req.body;

				let stock = await dbQuery(`SELECT * FROM stock WHERE product_id=${dbConf.escape(product_id)} AND product_unit=${dbConf.escape(product_unit)};`);
				if (stock.length === 0) {
					await dbQuery(
						`INSERT INTO stock (product_id, product_stock, product_unit, product_netto, product_conversion) VALUES
							(${dbConf.escape(product_id)},
							${dbConf.escape(product_stock)},
							${dbConf.escape(product_unit)},
							${dbConf.escape(product_netto)},
							${dbConf.escape(product_conversion)}
						);`
					);
					await dbQuery(`INSERT INTO reports (transaction_id, product_id, quantity, type, note, product_name, product_image, product_unit) VALUES
						(
							${dbConf.escape(0)},
							${dbConf.escape(product_id)},
							${dbConf.escape(productStock.product_stock > req.body.product_stock ? productStock.product_stock - req.body.product_stock : req.body.product_stock - productStock.product_stock)},
							${dbConf.escape('Stock Update')},
							${dbConf.escape('Addition')},
							${dbConf.escape(productDetails.product_name)},
							${dbConf.escape(productDetails.product_image)},
							${dbConf.escape(productStock.product_unit)}
						);
					`);
					res.status(200).send({ success: true, message: 'Stock has been updated ✅' });
					return;
				}
			}

			let newData = [];

			Object.keys(req.body).forEach((val) => {
				if (req.body[val]) {
					newData.push(`${val}=${dbConf.escape(req.body[val])}`);
				}
			});
			// console.log(newData.join(', '));

			await dbQuery(`UPDATE stock SET ${newData.join(', ')} WHERE product_id=${req.params.id}`);

			await dbQuery(`INSERT INTO reports (transaction_id, product_id, quantity, type, note, product_name, product_image, product_unit) VALUES
				(
					${dbConf.escape(0)},
					${dbConf.escape(product_id)},
					${dbConf.escape(productStock.product_stock > req.body.product_stock ? productStock.product_stock - req.body.product_stock : req.body.product_stock - productStock.product_stock)},
					${dbConf.escape('Stock Update')},
					${dbConf.escape(productStock.product_stock > req.body.product_stock ? 'Substraction' : 'Addition')},
					${dbConf.escape(productDetails.product_name)},
					${dbConf.escape(productDetails.product_image)},
					${dbConf.escape(productStock.product_unit)}
				);
			`);
			res.status(200).send({ success: true, message: 'Stock has been updated ✅' });
		} catch (error) {
			res.status(500).send({ success: false, message: error });
			console.log(error);
		}
	},
	deleteProductStock: async (req, res) => {
		try {
			if (req.dataToken.role !== 'ADMIN') {
				res.status(401).send({ success: false, message: 'You not authorized for this activity' });
				return;
			}

			let id = req.params.id;
			const product = await dbQuery(`SELECT * FROM stock WHERE product_id=${dbConf.escape(id)};`);

			if (product.length === 0) {
				res.status(400).send({ success: false, message: 'Stock not found ❌' });
				return;
			}

			await dbQuery(`DELETE FROM stock WHERE product_id = ${dbConf.escape(id)};`);
			res.status(200).send({ success: true, message: 'Stock has been deleted ✅' });
		} catch (error) {
			res.status(500).send({ success: false, message: error });
			console.log(error);
		}
	},
	selectProduct: async (req, res) => {
		try {
			let result = await dbQuery(`Select * from products WHERE product_id = ${req.params.id};`);
			if (result.length > 0) {
				res.status(200).send(result);
				return;
			}
			res.status(200).send([]);
		} catch (error) {
			console.log(error);
			res.status(500).send(error);
		}
	},
	selectRandomProduct: async (req, res) => {
		try {
			let temp = [];
			let result = [];
			let count = await dbQuery(`SELECT COUNT(*) as count FROM products`);
			while (temp.length < 4) {
				let random = Math.ceil(Math.random() * count[0].count);
				if (random !== parseInt(req.params.id)) {
					if (temp.indexOf(random) === -1) {
						let data = await dbQuery(`Select * from products p JOIN categories c ON p.category_id = c.category_id WHERE product_id = ${random};`);
						if (data.length > 0) {
							temp = [...temp, random];
							result.push(data[0]);
						}
					}
				}
			}
			res.status(200).send(result);
		} catch (error) {
			console.log(error);
			res.status(500).send(error);
		}
	},
	selectBestSeller: async (req, res) => {
		try {
			let getData = await dbQuery(`Select p.* from transactions t  
			JOIN transaction_detail d ON d.transaction_id = t.transaction_id
			JOIN products p ON d.product_name = p.product_name
			WHERE (t.transaction_status = 'Shipped' OR t.transaction_status = 'Order Confirmed')
			GROUP BY p.product_name ORDER BY count(*) desc limit 4`);
			if (getData.length === 4) {
				res.status(200).send(getData);
			} else {
				res.status(404).send({ message: 'Data not found!' });
			}
		} catch (error) {
			console.log(error);
			res.status(500).send(error);
		}
	},
};
