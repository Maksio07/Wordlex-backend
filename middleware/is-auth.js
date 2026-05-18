module.exports = (req, res, next) => {
	if (!req.session.user) {
		return res.status(401).json({
			status: 'error',
			message: 'Unauthorized',
		})
	}

	next()
}
