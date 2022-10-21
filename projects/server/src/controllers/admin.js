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
            if (req.query.date_from && req.query.date_to) {
                let dateRange = {
                    from : req.query.date_from,
                    to : req.query.date_to
                }
                let time = ' 23:59:59';
                let getData = await dbQuery(`Select count(*) as total_transaction, DATE_FORMAT(order_date, '%Y-%m-%d') as date, 
                SUM(total_purchase-delivery_charge) as total_sales from transactions 
                WHERE (transaction_status = 'Shipped' OR transaction_status = 'Order confirmed') 
                AND order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)} 
                GROUP BY order_date ;`);
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
                if (getData.length > 0) {
                    getData.forEach((val) => {
                        let label = new Date(val.date).toLocaleDateString("en-GB", {
                            weekday : 'short',
                            day : 'numeric',
                            month : 'short',
                            year : 'numeric'
                        });
                        console.log(label);
                        data.labels.push(label);
                        data.datasets[0].data.push(val.total_sales);
                    });
                    res.status(200).send({success : true, dataMap : getData, data, note : 'data found'});
                }
                res.status(200).send({success : true, dataMap : [], data, note : 'data not found'});
            } else {
                let dateRange = {
                    from : new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + (new Date().getDate()-10),
                    to : new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate()
                };
                let time = ' 23:59:59';
                let getData = await dbQuery(`Select count(*) as total_transaction, DATE_FORMAT(order_date, '%Y-%m-%d') as date, 
                SUM(total_purchase-delivery_charge) as total_sales from transactions 
                WHERE (transaction_status = 'Shipped' OR transaction_status = 'Order confirmed') 
                AND order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)} 
                GROUP BY order_date ;`);
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
                res.status(200).send({success : true, dataMap : getData, data});
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    getProductReport: async (req, res) => {
        try {
            if (req.query.date_from && req.query.date_to) {
                let dateRange = {
                    from : req.query.date_from,
                    to : req.query.date_to
                }
                let time = ' 23:59:59';
                let getData = await dbQuery(`Select DATE_FORMAT(t.order_date,'%Y-%m-%d') as date, d.product_name, 
                d.product_price, count(*) as total_qty, d.product_unit, 
                d.product_price * count(*) as total_price
                from transactions t 
                JOIN transaction_detail d ON d.transaction_id =t.transaction_id 
                WHERE (t.transaction_status = 'Shipped' OR t.transaction_status = 'Order confirmed')
                AND t.order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)}
                GROUP BY d.product_name;`);
                let getData_table = await dbQuery(`Select DATE_FORMAT(t.order_date,'%Y-%m-%d') as date, d.product_name, 
                d.product_price, count(*) as total_qty, d.product_unit, 
                d.product_price * count(*) as total_price
                from transactions t 
                JOIN transaction_detail d ON d.transaction_id =t.transaction_id 
                WHERE (t.transaction_status = 'Shipped' OR t.transaction_status = 'Order confirmed')
                AND t.order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)}
                GROUP BY d.product_name, t.order_date;`);
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
                if (getData.length > 0 && getData_table.length > 0) {
                    getData.forEach((val) => {
                        data.labels.push(val.product_name);
                        data.datasets[0].data.push(val.total_qty);
                    })
                    res.status(200).send({success : true, dataMap : getData_table, data, note : 'data found'});
                }
                res.status(200).send({success : true, dataMap : getData_table, data, note : 'data not found'})
            } else {
                let dateRange = {
                    from : new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + (new Date().getDate()-10),
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
                GROUP BY d.product_name;`);
                let getData_table = await dbQuery(`Select DATE_FORMAT(t.order_date,'%Y-%m-%d') as date, d.product_name, 
                d.product_price, count(*) as total_qty, d.product_unit, 
                d.product_price * count(*) as total_price
                from transactions t 
                JOIN transaction_detail d ON d.transaction_id =t.transaction_id 
                WHERE (t.transaction_status = 'Shipped' OR t.transaction_status = 'Order confirmed')
                AND t.order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)}
                GROUP BY d.product_name, t.order_date;`);
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
                res.status(200).send({success : true, dataMap : getData_table, data});
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    getUserReport: async (req, res) => {
        try {
            if (req.query.date_from && req.query.date_to) {
                let dateRange = {
                    from : req.query.date_from,
                    to : req.query.date_to
                }
                let time = ' 23:59:59';
                let getData = await dbQuery(`Select DATE_FORMAT(t.order_date,'%Y-%m-%d') as date, u.username, count(*) as total, sum(total_purchase) as subtotal
                from transactions t 
                JOIN users u ON t.user_id = u.user_id
                WHERE (t.transaction_status = 'Shipped' OR t.transaction_status = 'Order confirmed')
                AND t.order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)}
                GROUP BY u.username;`);
                let getData_table = await dbQuery(`Select DATE_FORMAT(t.order_date,'%Y-%m-%d') as date, u.username, count(*) as total, sum(total_purchase) as subtotal
                from transactions t 
                JOIN users u ON t.user_id = u.user_id
                WHERE (t.transaction_status = 'Shipped' OR t.transaction_status = 'Order confirmed')
                AND t.order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)}
                GROUP BY u.username, t.order_date;`);
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
                if (getData.length > 0 && getData_table.length > 0) {
                    getData.forEach((val) => {
                        data.labels.push(val.username);
                        data.datasets[0].data.push(val.total);
                    });
                    res.status(200).send({success : true, dataMap : getData_table, data, note : 'data found'});
                }
                res.status(200).send({success : true, dataMap : getData_table, data, note : 'data not found'})
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
                GROUP BY u.username;`);
                let getData_table = await dbQuery(`Select DATE_FORMAT(t.order_date,'%Y-%m-%d') as date, u.username, count(*) as total, sum(total_purchase) as subtotal
                from transactions t 
                JOIN users u ON t.user_id = u.user_id
                WHERE (t.transaction_status = 'Shipped' OR t.transaction_status = 'Order confirmed')
                AND t.order_date BETWEEN ${dbConf.escape(dateRange.from)} AND ${dbConf.escape(dateRange.to + time)}
                GROUP BY u.username, t.order_date;`);
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
                res.status(200).send({success : true, dataMap : getData_table, data});
            }
        } catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
    }
}