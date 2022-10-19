const { dbConf, dbQuery } = require('../config/db');

module.exports = {
    getStockHistory : async (req,res) => {
        try {
            const order = req.query.order;
            const sort = req.query.sort;
            if (req.query.date_from && req.query.date_to) {
                var date = {
                    from : req.query.date_from,
                    to : req.query.date_to
                }
            } else {
                var date = {}
            }
            const time = ' 23:59:59'
            const offset = req.query.offset;
            const limit = req.query.limit;
            const productName = req.query.product_name;
            let getQuery = 'Select * from reports '
            if (Object.keys(date).length === 0 && productName) {
                getQuery += `WHERE product_name LIKE "%${productName}%" `
            }
            if (Object.keys(date).length > 0 && productName) {
                getQuery += `WHERE product_name LIKE "%${productName}%" AND date between ${dbConf.escape(date.from)} AND ${dbConf.escape(date.to + time)} `
            }

            if (Object.keys(date).length > 0 && !productName ) {
                getQuery += `WHERE date between ${dbConf.escape(date.from)} AND ${dbConf.escape(date.to + time)} `
            }

            if (sort) {
                getQuery += `order by ${sort} ${order} `
            }

            if (limit) {
                getQuery += `LIMIT ${limit} OFFSET ${offset}`
            }
            console.log(getQuery);
            let getData = await dbQuery(`${getQuery};`);
            console.log(getData);
            if (getData.length > 0) {
                res.status(200).send(getData);
            }
            // let getData = await dbQuery(`Select * from reports ${productName && Object.keys(date).length === 0? `WHERE product_name LIKE "%${productName}%"` : ''}
            // ${productName && Object.keys(date).length > 0 ? `WHERE product_name LIKE "%${productName}%" AND date BETWEEN ${date.from} AND ${date.to} 23:59:59`: ''}
            // ${!productName && Object.keys(date).length > 0 ? `WHERE date BETWEEN ${date.from} AND ${date.to} ${time}`: ''}
            // ${sort ? 'order by '+ date + ' ' + order : '' }
            // ${limit ? 'LIMIT ' + limit + ' OFFSET ' + offset : ''};`);
            // console.table(getData);
            // if (getData.length) {
            //     res.status(200).send(getData);
            // }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    getTotalData : async (req,res) => {
        try {
            let data = await dbQuery(`Select COUNT(*) as count FROM reports`);
            res.status(200).send(data);
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }
}