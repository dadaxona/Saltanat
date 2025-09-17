const Servis = require('./Servis');
const { Super } = require('../../models');
const { generateToken } = require("../Middleware/Auth");

class SuperControl {
    async auth (req, res) {
        const result = await new Servis(Super, {}).findAll();
        if (result && result.length > 0) {
            if (result[0].login === req.body.login && result[0].password === req.body.password) {
                const token = generateToken({
                    id: result[0].id,
                    login: result[0].login,
                    password: result[0].password,
                    status: result[0].status
                });
                const items = {
                    id: result[0].id,
                    login: result[0].login,
                    password: result[0].password,
                    status: result[0].status
                }
                return res.json({statusCode: 200, token, items});
            } else {
                return res.json({statusCode: 404})
            }
        } else {
            try{
                const result2 = await new Servis(Super, {...req.body}).create();
                const token = generateToken({
                    id: result2.id,
                    login: result2.login,
                    password: result2.password,
                    status: result.status
                });
                const items = {
                    id: result.id,
                    login: result.login,
                    password: result.password,
                    status: result.status
                }
                return res.json({statusCode: 200, token, items});
            } catch (error) {
                return res.json({ statusCode: 404 });
            }
        }
    }

    async auth_next (req, res) {
        try {
            const result = await new Servis(Super, { where: {login: req.user.login, password: req.user.password}}).findOne();
            if (result.login === req.user.login && result.password === req.user.password) {
                const items = {
                    id: result.id,
                    login: result.login,
                    password: result.password,
                    status: result.status
                }
                return res.json({statusCode: 200, items});
            } else {
                return res.json({statusCode: 404})
            }
        } catch (error) {
            return res.json({statusCode: 404})
        }
    }

    async getSuper (req, res) {
        try{
            const result = await new Servis(Super, {}).findAll();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async createSuper (req, res) {
        try{
            const result = await new Servis(Super, {...req.body}).create();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async updateSuper (req, res) {
        try{
            const result = await new Servis(Super, {...req.body}).update({where: {id: req.params.id}});
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async deleteSuper (req, res) {
        try{
            const result = await new Servis(Super, {where: {id: req.params.id}}).destroy();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async checkking_auth (req, res) {
        return req.user.login ? res.json({ statusCode: 200 }) : res.json({ statusCode: 404 });
    }
}

module.exports = new SuperControl;