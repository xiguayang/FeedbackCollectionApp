module.exports = (req, res, next) => {
	//next: pass to next middleware or route handler
	if (req.user.credits < 1) {
		return res.status(401).send({ error: 'Not enough credits!' });
	}
	next();
};
