const { dbConf, dbQuery } = require('../config/db');

module.exports = {
    getCart: async (req, res) => {
        try {
            let resCart = await dbQuery(`SELECT c.cart_id, p.default_unit, c.product_id, p.product_name, p.product_price, p.product_image, s.product_stock, p.product_description, c.is_selected, c.quantity from carts c
            JOIN products p ON p.product_id = c.product_id
            JOIN stock s ON s.product_id = c.product_id
            WHERE c.user_id = ${req.dataToken.user_id};`);

            res.status(200).send({
                succes: true,
                massage: "Get cart success",
                cartData: resCart,
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
            let resChecked = await dbQuery(`SELECT c.cart_id, s.stock_id, c.product_id, p.default_unit, p.product_name, p.product_price, p.product_image, p.product_description, s.product_stock, c.is_selected, c.quantity from carts c
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
    addCart : async (req,res) => {
        try {
            let get = await dbQuery(`Select * from carts WHERE product_id = ${dbConf.escape(req.body.product_id)} AND user_id = ${req.dataToken.user_id};`);
            if (get.length > 0) {
                let update = await dbQuery(`UPDATE carts c SET quantity = c.quantity + ${dbConf.escape(req.body.quantity)} WHERE c.product_id = ${dbConf.escape(req.body.product_id)} AND c.user_id = ${req.dataToken.user_id};`);
                let getNew = await dbQuery(`Select * from carts WHERE product_id = ${dbConf.escape(req.body.product_id)} AND user_id = ${req.dataToken.user_id};`);
                res.status(200).send({success : true, message : "Success", cart : getNew});
            } else {
                let add = await dbQuery(`INSERT INTO carts
                (user_id, product_id, quantity, is_selected) 
                VALUES (${req.dataToken.user_id}, ${dbConf.escape(req.body.product_id)}, ${dbConf.escape(req.body.quantity)}, 1);`);
                if (add.insertId) {
                    res.status(200).send({
                        success : true,
                        message : "Success",
                        add
                    });
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }
};