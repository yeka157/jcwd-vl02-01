const Crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = {
	hashPassword: (pass) => {
		return Crypto.createHmac('sha256', 'sehat_bos115').update(pass).digest('hex');
	},
	createToken: (payload, expiresIn = '24h') => {
		return jwt.sign(payload, 'posting', {
			expiresIn,
		});
	},
	readToken: (req, res, next) => {
		jwt.verify(req.token, 'posting', (err, decode) => {
			if (err) {
				console.log('ini errornya', err);
				return res.status(401).send({
					message: 'Authenticate error ❌',
				});
			}
			req.dataToken = decode;

			next();
		});
	},
};
