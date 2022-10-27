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
            } else {
                getQuery += `order by date desc `
            }

            if (limit) {
                getQuery += `LIMIT ${limit} OFFSET ${offset}`
            }
            let getData = await dbQuery(`${getQuery};`);
            if (getData.length > 0) {
                res.status(200).send(getData);
            }
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
            let dateRange = {
                from : 0,
                to : 0,
            }
            let sort = 'date';
            let order = 'desc';
            if (req.query.sort && req.query.order) {
                if (req.query.sort === 'sales') {
                    sort = 'SUM(total_purchase-delivery_charge)'
                } else {
                    sort = req.query.sort;
                }
                order = req.query.order;
            } 
            if (req.query.date_from && req.query.date_to) {
                dateRange = {
                    from : req.query.date_from,
                    to : req.query.date_to
                }
            } else {
                dateRange = {
                    from : new Date().getFullYear()-1 + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate(),
                    to : new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate()
                };
            }
            let time = ' 23:59:59';
            let getData = await dbQuery(`Select count(*) as total_transaction, DATE_FORMAT(order_date, '%Y-%m-%d') as date, 
            SUM(total_purchase-delivery_charge) as total_sales from transactions 
            WHERE (transaction_status = 'Shipped' OR transaction_status = 'Order confirmed') 
            AND order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)} 
            GROUP BY date order by ${sort} ${order} limit 10;`);
            let getData_table = await dbQuery(`Select count(*) as total_transaction, DATE_FORMAT(order_date, '%Y-%m-%d') as date, 
            SUM(total_purchase-delivery_charge) as total_sales from transactions 
            WHERE (transaction_status = 'Shipped' OR transaction_status = 'Order confirmed') 
            AND order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)} 
            GROUP BY date order by ${sort} ${order};`);
            let data = {
                labels : [],
                datasets : [
                    {
                        label : 'Total purchased',
                        data : [],
                        borderColor : 'rgb(2,93,103,0.1)',
                        backgroundColor : 'rgb(2,93,103,0.5)'
                    }
                ]
            };
            getData.forEach((val) => {
                data.labels.push(new Date(val.date).toLocaleDateString("en-GB", {
                    weekday : 'short',
                    day : 'numeric',
                    month : 'short',
                    year : 'numeric'
                }));
                data.datasets[0].data.push(val.total_sales);
            });
            res.status(200).send({success : true, dataMap : getData_table, data, note : 'data found'});
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    getProductReport: async (req, res) => {
        try {
            let dateRange = {
                from : 0,
                to : 0
            }
            if (req.query.date_from && req.query.date_to) {
                dateRange = {
                    from : req.query.date_from,
                    to : req.query.date_to
                }
            } else {
                dateRange = {
                    from : new Date().getFullYear()-1 + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate(),
                    to : new Date().getFullYear()  + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate()
                };
            }
            let sort = 'count(*)';
            let sort_table = 'count(*)';
            let order = 'desc';
            let order_table = 'desc';
            if (req.query.sort && req.query.order) {
                if (req.query.sort === 'sales') {
                    sort = 'd.product_price * count(*)';
                    sort_table = 'd.product_price * count(*)';
                    order = req.query.order;
                    order_table = req.query.order
                } else if (req.query.sort === 'date') {
                    sort_table = 'date';
                    order_table = req.query.order;
                }
            }
            let time = ' 23:59:59';
            let getData = await dbQuery(`Select DATE_FORMAT(t.order_date,'%Y-%m-%d') as date, d.product_name, 
            d.product_price, count(*) as total_qty, d.product_unit, 
            d.product_price * count(*) as total_price
            from transactions t 
            JOIN transaction_detail d ON d.transaction_id =t.transaction_id 
            WHERE (t.transaction_status = 'Shipped' OR t.transaction_status = 'Order confirmed')
            AND t.order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)}
            GROUP BY d.product_name order by ${sort} ${order};`);
            let getData_table = await dbQuery(`Select DATE_FORMAT(t.order_date,'%Y-%m-%d') as date, d.product_name, 
            d.product_price, count(*) as total_qty, d.product_unit, 
            d.product_price * count(*) as total_price
            from transactions t 
            JOIN transaction_detail d ON d.transaction_id =t.transaction_id 
            WHERE (t.transaction_status = 'Shipped' OR t.transaction_status = 'Order confirmed')
            AND t.order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)}
            GROUP BY d.product_name, date order by ${sort_table} ${order_table};`);
            let data = {
                labels : [],
                datasets : [
                    {
                        label : 'Total purchased',
                        data : [],
                        borderColor : 'rgb(2,93,103,0.1)',
                        backgroundColor : 'rgb(2,93,103,0.5)'
                    }
                ]
            };
            getData.forEach((val) => {
                data.labels.push(val.product_name);
                data.datasets[0].data.push(val.total_qty);
            })
            res.status(200).send({success : true, dataMap : getData_table, data, note : 'data found'});
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    getUserReport: async (req, res) => {
        try {
            let dateRange = {
                from : 0,
                to : 0
            }
            if (req.query.date_from && req.query.date_to) {
                dateRange = {
                    from : req.query.date_from,
                    to : req.query.date_to
                }
            } else {
                dateRange = {
                    from : new Date().getFullYear()-1 + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
                    to : new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
                }
            }
            let sort = 'count(*)';
            let sort_table = 'count(*)'
            let order = 'desc';
            let order_table = 'desc';
            if (req.query.sort && req.query.order) {
                if (req.query.sort === 'sales') {
                    sort = 'SUM(total_purchase)';
                    sort_table = 'SUM(total_purchase)';
                    order = req.query.order;
                    order_table = req.query.order;
                } else if (req.query.sort === 'date') {
                    sort_table = 'date';
                    order_table = req.query.order;
                }
            }
            let time = ' 23:59:59';
            let getData = await dbQuery(`Select DATE_FORMAT(t.order_date,'%Y-%m-%d') as date, u.username, count(*) as total, sum(total_purchase) as subtotal
            from transactions t 
            JOIN users u ON t.user_id = u.user_id
            WHERE (t.transaction_status = 'Shipped' OR t.transaction_status = 'Order confirmed')
            AND t.order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)}
            GROUP BY u.username
            order by ${sort} ${order}
            limit 5;`);
            let getData_table = await dbQuery(`Select DATE_FORMAT(t.order_date,'%Y-%m-%d') as date, u.username, count(*) as total, sum(total_purchase) as subtotal
            from transactions t 
            JOIN users u ON t.user_id = u.user_id
            WHERE (t.transaction_status = 'Shipped' OR t.transaction_status = 'Order confirmed')
            AND t.order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)}
            GROUP BY u.username, t.order_date
            order by ${sort_table} ${order_table};`);
            let data = {
                labels : [],
                datasets : [
                    {
                        label : 'Transaction Made',
                        data : [],
                        borderColor :'rgb(2,93,103,0.1)',
                        backgroundColor : 'rgb(2,93,103,0.5)'
                    }
                ]
            };
            getData.forEach((val) => {
                data.labels.push(val.username);
                data.datasets[0].data.push(val.total);
            });
            res.status(200).send({success : true, dataMap : getData_table, data, found : true});
        } catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
    },
    getTotalReport : async (req,res) => {
        try {
            let dateRange = {
                from : new Date().getFullYear()-1,
                to : new Date().getFullYear()
            };
            let time = ' 23:59:59';
            let data = 0;
            if (req.query.report === 'transaction') {
                let getData = await dbQuery(`Select count(*) as total_transaction, DATE_FORMAT(order_date, '%Y-%m-%d') as date, 
                SUM(total_purchase-delivery_charge) as total_sales from transactions 
                WHERE (transaction_status = 'Shipped' OR transaction_status = 'Order confirmed') 
                AND order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)} 
                GROUP BY order_date;`);
                data = getData.length;
            } else if (req.query.report === 'user') {
                let getData = await dbQuery(`Select DATE_FORMAT(t.order_date,'%Y-%m-%d') as date, u.username, count(*) as total, sum(total_purchase) as subtotal
                from transactions t 
                JOIN users u ON t.user_id = u.user_id
                WHERE (t.transaction_status = 'Shipped' OR t.transaction_status = 'Order confirmed')
                AND t.order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)}
                GROUP BY u.username`);
                data = getData.length;
            } else if (req.query.report === 'product') {
                let getData = await dbQuery(`Select DATE_FORMAT(t.order_date,'%Y-%m-%d') as date, d.product_name, 
                d.product_price, count(*) as total_qty, d.product_unit, 
                d.product_price * count(*) as total_price
                from transactions t 
                JOIN transaction_detail d ON d.transaction_id =t.transaction_id 
                WHERE (t.transaction_status = 'Shipped' OR t.transaction_status = 'Order confirmed')
                AND t.order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)}
                GROUP BY d.product_name;`);
                data = getData.length;
            }
            res.status(200).send({success : true, count : data});
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    getProductTable : async (req,res) => {
        try {
            let dateRange = {
                from : 0,
                to : 0
            }
            if (req.query.date_from && req.query.date_to) {
                dateRange = {
                    from : req.query.date_from,
                    to : req.query.date_to
                }
            } else {
                dateRange = {
                    from : new Date().getFullYear()-1 + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate(),
                    to : new Date().getFullYear()  + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate()
                };
            }
            let sort_table = 'count(*)';
            let order_table = 'desc';
            if (req.query.sort && req.query.order) {
                if (req.query.sort === 'sales') {
                    sort_table = 'd.product_price * count(*)';
                    order_table = req.query.order
                } else if (req.query.sort === 'date') {
                    sort_table = 'date';
                    order_table = req.query.order;
                }
            }
            let time = ' 23:59:59';
            let getData_table = await dbQuery(`Select DATE_FORMAT(t.order_date,'%Y-%m-%d') as date, d.product_name, 
            d.product_price, count(*) as total_qty, d.product_unit, 
            d.product_price * count(*) as total_price
            from transactions t 
            JOIN transaction_detail d ON d.transaction_id =t.transaction_id 
            WHERE (t.transaction_status = 'Shipped' OR t.transaction_status = 'Order confirmed')
            AND t.order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)}
            GROUP BY d.product_name, date order by ${sort_table} ${order_table}
            ${req.query.limit ? 'LIMIT ' + req.query.limit + ' OFFSET ' + req.query.offset : ''};`);
            if (getData_table.length > 0) {
                res.status(200).send({success : true, length : getData_table.length, dataMap : getData_table});
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    getUserTable : async(req,res) => {
        try {
            let dateRange = {
                from : 0,
                to : 0
            }
            if (req.query.date_from && req.query.date_to) {
                dateRange = {
                    from : req.query.date_from,
                    to : req.query.date_to
                }
            } else {
                dateRange = {
                    from : new Date().getFullYear()-1 + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
                    to : new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
                }
            }
            let sort_table = 'count(*)'
            let order_table = 'desc';
            if (req.query.sort && req.query.order) {
                if (req.query.sort === 'sales') {
                    sort_table = 'SUM(total_purchase)';
                    order_table = req.query.order;
                } else if (req.query.sort === 'date') {
                    sort_table = 'date';
                    order_table = req.query.order;
                }
            }
            let time = ' 23:59:59';
            let getData_table = await dbQuery(`Select DATE_FORMAT(t.order_date,'%Y-%m-%d') as date, u.username, count(*) as total, sum(total_purchase) as subtotal
            from transactions t 
            JOIN users u ON t.user_id = u.user_id
            WHERE (t.transaction_status = 'Shipped' OR t.transaction_status = 'Order confirmed')
            AND t.order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)}
            GROUP BY u.username, t.order_date
            order by ${sort_table} ${order_table}
            ${req.query.limit ? 'LIMIT ' + req.query.limit + ' OFFSET ' + req.query.offset : ''};`);
            if (getData_table.length > 0) {
                res.status(200).send({success : true, length : getData_table.length, dataMap : getData_table});
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    getTransactionTable : async (req,res) => {
        try {
            let dateRange = {
                from : 0,
                to : 0,
            }
            let sort = 'date';
            let order = 'desc';
            if (req.query.sort && req.query.order) {
                if (req.query.sort === 'sales') {
                    sort = 'SUM(total_purchase-delivery_charge)'
                } else {
                    sort = req.query.sort;
                }
                order = req.query.order;
            } 
            if (req.query.date_from && req.query.date_to) {
                dateRange = {
                    from : req.query.date_from,
                    to : req.query.date_to
                }
            } else {
                dateRange = {
                    from : new Date().getFullYear()-1 + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate(),
                    to : new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate()
                };
            }
            let time = ' 23:59:59';
            let getData_table = await dbQuery(`Select count(*) as total_transaction, DATE_FORMAT(order_date, '%Y-%m-%d') as date, 
            SUM(total_purchase-delivery_charge) as total_sales from transactions 
            WHERE (transaction_status = 'Shipped' OR transaction_status = 'Order confirmed') 
            AND order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)} 
            GROUP BY date order by ${sort} ${order}
            ${req.query.limit ? 'LIMIT ' + req.query.limit + ' OFFSET ' + req.query.offset : ''};`);
            if (getData_table.length > 0) {
                res.status(200).send({success : true, length : getData_table.length, dataMap : getData_table});
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }
}