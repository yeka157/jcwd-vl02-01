const { dbConf, dbQuery } = require('../config/db');

module.exports = {
    getCart: async (req, res) => {
        try {
            let resCart = await dbQuery(`SELECT c.cart_id, p.product_name, p.product_price, p.product_image, s.product_stock, p.product_description, c.is_selected, c.quantity from carts c
            JOIN products p ON p.product_id = c.product_id
            JOIN stock s ON s.product_id = c.product_id
            WHERE c.user_id = ${req.dataToken.user_id};`);

            res.status(200).send({
                succes: true,
                massage: "Get cart success",
                cartData: resCart
            })


        } catch (error) {
            console.log(error);
            res.status(500).send({
                succes: false,
                massage: "Failed"
            })
        }
    },
    chekItem: async (req, res) => {
        try {

            await dbQuery(`UPDATE carts SET is_selected = ${req.body.status}  WHERE cart_id = ${req.params.cart_id};`);

            res.status(200).send({
                succes: true,
                massage: "Success",
            })

        } catch (error) {
            console.log(error);
            res.status(500).send({
                succes: false,
                massage: "Failed"
            })
        }

    },
    decrementCart: async (req, res) => {
        try {

            await dbQuery(`UPDATE carts c SET quantity = c.quantity - ${req.body.substraction}  WHERE cart_id = ${req.params.cart_id};`);

            res.status(200).send({
                succes: true,
                massage: "Success",
            })

        } catch (error) {
            console.log(error);
            res.status(500).send({
                succes: false,
                massage: "Failed"
            })
        }
    },
    incrementCart: async (req, res) => {
        try {

            await dbQuery(`UPDATE carts c SET quantity = c.quantity + ${req.body.addition}  WHERE cart_id = ${req.params.cart_id};`);

            res.status(200).send({
                succes: true,
                massage: "Success",
            })

        } catch (error) {
            console.log(error);
            res.status(500).send({
                succes: false,
                massage: "Failed"
            })
        }
    },
    deleteItem: async (req, res) => {
        try {
            let resDelete = dbQuery(`DELETE from carts WHERE cart_id = ${dbConf.escape(req.params.cart_id)};`);

            res.status(200).send({
                succes: true,
                massage: "Success",
            })

        } catch (error) {
            console.log(error);
            res.status(500).send({
                succes: false,
                massage: "Failed"
            })
        }
    },
    getCheckedItem: async (req, res) => {
        try {
            let resChecked = await dbQuery(`SELECT c.cart_id, p.product_id, p.product_name, p.product_price, p.product_image, p.product_description, s.product_stock, c.is_selected, c.quantity from carts c
            JOIN products p ON c.product_id = p.product_id
            JOIN stock s ON c.product_id = s.product_id
            WHERE user_id = ${req.dataToken.user_id} AND c.is_selected = 1;`);

            res.status(200).send({
                succes: true,
                massage: "Success",
                items: resChecked
            })

        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                massage: "Failed"
            })
        }
    },
    getAddress: async(req, res) => {
        try {
            let resAddress = await dbQuery(`SELECT * from address WHERE user_id = ${req.dataToken.user_id} AND main_address = 1`);

            console.log(resAddress);
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