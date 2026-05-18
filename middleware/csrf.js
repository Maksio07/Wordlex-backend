const csrf = require('@dr.pogodin/csurf')

const csrfProtection = csrf({
	cookie: {
		key: '_csrf',
		path: '/',
		httpOnly: true,
		secure: false, 
		sameSite: 'lax', 
	},
})

module.exports = csrfProtection
