const Servis = require("./Servis");
const { Admin } = require('../../models');
const { generateToken } = require("../Middleware/Auth");
class AdminControl {
    async findAll (req, res) {
        try {
            const result = await new Servis(Admin, {
                where: {superId: req.params.id},
            }).findAll();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async auth (req, res) {
        try {
            const result = await new Servis(Admin, { where: {login: req.body.login, password: req.body.password}}).findOne();
            if (result.login === req.body.login && result.password === req.body.password) {
                const token = generateToken({
                    id: result.id,
                    superId: result.superId,
                    login: result.login,
                    password: result.password,
                    status: result.status
                });
                const items = {
                    id: result.id,
                    superId: result.superId,
                    login: result.login,
                    password: result.password,
                    status: result.status,
                    statistika: result.statistika,
                    staff: result.staff,
                    device: result.device,
                    change: result.change,
                    bag: result.bag,
                }
                return res.json({statusCode: 200, token, items});
            } else {
                return res.json({statusCode: 404})
            }
        } catch (error) {
            return res.json({statusCode: 404})
        }
    }

    async auth_next (req, res) {
        try {
            const result = await new Servis(Admin, { where: {login: req.user.login, password: req.user.password}}).findOne();
            if (result.login === req.user.login && result.password === req.user.password) {
                const items = {
                    id: result.id,
                    superId: result.superId,
                    login: result.login,
                    password: result.password,
                    status: result.status,
                    statistika: result.statistika,
                    staff: result.staff,
                    device: result.device,
                    change: result.change,
                    bag: result.bag,
                }
                return res.json({statusCode: 200, items});
            } else {
                return res.json({statusCode: 404})
            }
        } catch (error) {
            return res.json({statusCode: 404})
        }
    }

    async createAdmin (req, res) {
        const result = await new Servis(Admin, { where: {login: req.body.login}}).findOne();
        if (!result) {
            try {
                const result2 = await new Servis(Admin, {...req.body}).create();
                return result2 ? res.json({ statusCode: 200 }) : res.json({ statusCode: 404 });;
            } catch (error) {
                return res.json({ statusCode: 404 });
            }
        } else {
            return res.json({ statusCode: 404 });
        }
    }

    async updateAdmin (req, res) {
        const resul = await new Servis(Admin, req.params.id).findByPk();
        const result = await new Servis(Admin, { where: {login: req.body.login}}).findOne();
        if (!result) {
            try {
                const result2 = await new Servis(Admin, {...req.body}).update({where: {id: req.params.id}});
                return result2 ? res.json({ statusCode: 200 }) : res.json({ statusCode: 404 });
            } catch (error) {
                return res.json({ statusCode: 404 });
            }
        } else {
            if (resul.login === req.body.login) {
                try {
                    const result2 = await new Servis(Admin, {...req.body}).update({where: {id: req.params.id}});
                    return result2 ? res.json({ statusCode: 200 }) : res.json({ statusCode: 404 });
                } catch (error) {
                    return res.json({ statusCode: 404 });
                }
            } else {
                return res.json({ statusCode: 404 });
            }
        }
    }

    async update () {
        try {
            await new Servis(Admin, {...req.body}).update({where: {id: req.params.id}});
            return res.json({ statusCode: 200 })
            
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async deleteAdmin (req, res) {
        try {
            await new Servis(Admin, {where: {id: req.params.id}}).destroy();
            return res.json({ statusCode: 200 })
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }
}

module.exports = new AdminControl;