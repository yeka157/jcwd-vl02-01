// CONFIG DEFAULT
const axios = require('axios')

// Config Defaults Axios dengan Detail Akun Rajaongkir
axios.defaults.baseURL = 'https://api.rajaongkir.com/starter'
axios.defaults.headers.common['key'] = 'db19f15530590b4bdd1e941fd90f2249'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

module.exports = {
    delivery: async(req, res) => {
        try {
            
            let getAll = [];

            let getJNE = await axios.post('/cost', {
                origin: 501,
                destination: 114,
                weight: 1000,
                courier: 'jne'
            });

            getJNE.data.rajaongkir.results[0].costs.forEach(val => {
                getAll.push({name: 'JNE', ...val })
            })

            let getTIKI = await axios.post('/cost', {
                origin: 501,
                destination: 114,
                weight: 1000,
                courier: 'tiki'
            });

            getTIKI.data.rajaongkir.results[0].costs.forEach(val => {
                getAll.push({name: 'TIKI', ...val })
            })

            res.status(200).send({
                success: true,
                option: getAll
            });

        } catch (error) {
            console.log(error);
            res.status(500).send({
                error
            })
        }
    } 
}