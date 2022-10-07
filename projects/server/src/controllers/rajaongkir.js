const { dbConf, dbQuery } = require('../config/db');
const Axios = require('axios');
const { default: axios } = require('axios');

Axios.defaults.baseURL = 'https://api.rajaongkir.com/starter';
Axios.defaults.headers.common['key'] = process.env.rajaOngkirAPI;
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

module.exports = {
    getProvince : async (req,res) => {
        try {
            let data = await Axios.get('/province');
            let list = data.data.rajaongkir.results;
            res.status(200).send(list);
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    getCity : async(req,res) => {
        try {
            let getData = await Axios.get(`/city?province=${req.body.province}`);
            let listCity = getData.data.rajaongkir.results;
            res.status(200).send(listCity);
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }
}