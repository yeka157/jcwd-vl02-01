const { dbConf, dbQuery } = require('../config/db');

module.exports = {
	getCategory: async (req, res) => {
		try {
			let category = await dbQuery(`SELECT * FROM categories;`);

			if (category.length > 0) {
				res.status(200).send({ success: true, category });
				return;
			}

			res.status(400).send({ success: false, message: 'Failed to get categories ❌' });
		} catch (error) {
			res.status(500).send({ success: false, message: error });
			console.log(error);
		}
	},
	addCategory: async (req, res) => {
		try {
			let category_name = req.body.category_name;
			const category = await dbQuery(`SELECT * FROM categories WHERE category_name = ${dbConf.escape(category_name)};`);

			if (category.length > 0) {
				res.status(400).send({ success: false, message: 'Category already exists ❌' });
				return;
			}

			await dbQuery(`INSERT INTO categories (category_name) VALUES (${dbConf.escape(category_name)})`);
			res.status(200).send({ success: true, message: 'New category has been added ✅' });
		} catch (error) {
			res.status(500).send({ success: false, message: error });
			console.log(error);
		}
	},
	editCategory: async (req, res) => {
		try {
			let new_category = req.body.new_category;
			let id = req.params.id;

			const category = await dbQuery(`SELECT * FROM categories WHERE category_id = ${dbConf.escape(id)};`);

			if (category.length === 0) {
				res.status(400).send({ success: false, message: 'Category not found ❌' });
				return;
			}

			await dbQuery(`UPDATE categories SET category_name = ${dbConf.escape(new_category)} WHERE category_id = ${dbConf.escape(id)};`);
			res.status(200).send({ success: true, message: 'Category has been updated ✅' });
		} catch (error) {
			res.status(500).send({ success: false, message: error });
			console.log(error);
		}
	},
	deleteCategory: async (req, res) => {
		try {
			let id = req.params.id;
			let category = await dbQuery(`SELECT * FROM categories WHERE category_id = ${dbConf.escape(id)};`);

			if (category.length === 0) {
				res.status(400).send({ success: false, message: 'Category not found ❌' });
				return;
			}

			await dbQuery(`DELETE FROM categories WHERE category_id = ${dbConf.escape(id)};`);
			res.status(200).send({ success: true, message: 'Category has been deleted ✅' });
		} catch (error) {
			res.status(500).send({ success: false, message: error });
			console.log(error);
		}
	},
};
