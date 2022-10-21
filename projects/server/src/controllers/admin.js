const { dbConf, dbQuery } = require('../config/db');

module.exports = {
    getStockHistory: async (req, res) => {
        try {
            const order = req.query.order;
            const sort = req.query.sort;
            if (req.query.date_from && req.query.date_to) {
                var date = {
                    from: req.query.date_from,
                    to: req.query.date_to
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

            if (Object.keys(date).length > 0 && !productName) {
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
    getTotalData: async (req, res) => {
        try {
            let data = await dbQuery(`Select COUNT(*) as count FROM reports`);
            res.status(200).send(data);
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    getTransactionReport: async (req, res) => {
        try {
            if (req.query.filters) {
                let dateRange = {
                    from : req.query.filters.date_from,
                    to : req.query.filters.date_to
                }
            } else {
                let dateRange = {
                    from : new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + (new Date().getDate()-7),
                    to : new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate()
                };
                let time = ' 23:59:59';
                let getData = await dbQuery(`Select count(*) as total_transaction, DATE_FORMAT(order_date, '%Y-%m-%d') as date, 
                SUM(total_purchase-delivery_charge) as total_sales from transactions 
                WHERE (transaction_status = 'Shipped' OR transaction_status = 'Order confirmed') 
                AND order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)} 
                GROUP BY order_date ;`);
                res.status(200).send(getData);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    getProductReport: async (req, res) => {
        try {
            if (req.query.filters) {
                let dateRange = {
                    from : req.query.filters.date_from,
                    to : req.query.filters.date_to
                }
            } else {
                let dateRange = {
                    from : new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + (new Date().getDate()-7),
                    to : new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate()
                };
                let time = ' 23:59:59';
                let getData = await dbQuery(`Select DATE_FORMAT(t.order_date,'%Y-%m-%d') as date, d.product_name, 
                d.product_price, count(*) as total_qty, d.product_unit, 
                d.product_price * count(*) as total_price
                from transactions t 
                JOIN transaction_detail d ON d.transaction_id =t.transaction_id 
                WHERE (t.transaction_status = 'Shipped' OR t.transaction_status = 'Order confirmed')
                AND t.order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)}
                GROUP BY t.order_date, d.product_name;`);
                res.status(200).send(getData);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    getUserReport: async (req, res) => {
        try {
            if (req.query.filters) {

            } else {
                let dateRange = {
                    from : new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + (new Date().getDate()-10),
                    to : new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate()
                };
                let time = ' 23:59:59';
                let getData = await dbQuery(`Select DATE_FORMAT(t.order_date,'%Y-%m-%d') as date, u.username, count(*) as total, sum(total_purchase) as subtotal
                from transactions t 
                JOIN users u ON t.user_id = u.user_id
                WHERE (t.transaction_status = 'Shipped' OR t.transaction_status = 'Order confirmed')
                AND t.order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)}
                GROUP BY t.order_date;`);
                let data = {
                    labels : [],
                    datasets : [
                        {
                            label : 'Transaction Made',
                            data : [],
                            borderColor :'rgb(255,99,132)',
                            backgroundColor : 'rgba(255,99,132,0.5)'
                        }
                    ]
                };
                getData.forEach((val) => {
                    data.labels.push(val.username);
                    data.datasets[0].data.push(val.total);
                });
                res.status(200).send({success : true, dataMap : getData, data});
            }
        } catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
    }
}