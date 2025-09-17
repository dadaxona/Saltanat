const jwt = require('jsonwebtoken');
const SECRET_KEY = 'dadaxon1996@';

function generateToken(payload) {   
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '30m' });
}

function verifyToken(req, res, next) {    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.json({ statusCode: 404 });
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        if (decoded) {
            req.user = decoded;
            next();
        } else {
            return res.json({ statusCode: 404 });
        }
    } catch (err) {
        return res.json({ statusCode: 404 });
    }
}

module.exports = { generateToken, verifyToken };
