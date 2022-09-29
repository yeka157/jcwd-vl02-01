const { dbConf, dbQuery } = require('../config/db');

const dataProduct = async (product) => await dbQuery(`SELECT * FROM products WHERE product_name = ${dbConf.escape(product)};`);

module.exports = {
	getProduct: async (req, res) => {
		try {
			let products = await dbQuery(`SELECT * FROM products;`);

			if (products.length > 0) {
				res.status(200).send({ success: true, products });
				return;
			}

			res.status(400).send({ success: false, message: 'Failed to get products ❌' });
		} catch (error) {
			res.status(500).send({ success: false, message: error });
			console.log(error);
		}
	},
	addProduct: async (req, res) => {
		try {
			let { category_id, product_name, product_price, product_image, product_description, product_usage, default_unit } = req.body;
			const product = await dataProduct(product_name);

			if (product.length > 0) {
				res.status(400).send({ success: false, message: 'Product already exists ❌' });
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

			res.status(200).send({ success: true, message: 'New product has been added ✅' });
		} catch (error) {
			res.status(500).send({ success: false, message: error });
			console.log(error);
		}
	},
	updateProduct: async (req, res) => {
		try {
			let newData = [];

			Object.keys(req.body).forEach(val => {
				newData.push(`${val}=${dbConf.escape(req.body[val])}`);
			})
			await dbQuery(`UPDATE products set ${newData.join(', ')} where product_id=${req.params.id}`);
			res.status(200).send({ success: true, message: 'Product has been updated ✅' });
		} catch (error) {
			res.status(500).send({ success: false, message: error });
			console.log(error);
		}
	},
	deleteProduct: async (req, res) => {
		try {
			let id = req.params.id;
			const product = await dbQuery(`SELECT * FROM products WHERE product_id = ${dbConf.escape(id)};`);

			if (product.length === 0) {
				res.status(400).send({ success: false, message: 'Product not found ❌' });
				return;
			}

			await dbQuery(`DELETE FROM products WHERE product_id = ${dbConf.escape(id)};`);
			res.status(200).send({ success: true, message: 'Product has been deleted ✅' });
		} catch (error) {
			res.status(500).send({ success: false, message: error });
			console.log(error);
		}
	}
};
