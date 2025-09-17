const Servis = require("./Servis");
const { Staff, Pay, Change } = require('../../models');
const { Op } = require("sequelize");
const todayData = new Date();
const today = todayData.toISOString().split('T')[0];
const [yyyy, mm, dd] = today.split('-')

class StaffControl {
    async getSort (req, res) {
        try {
            const pay = await new Servis(Pay, {
                where: {superId: req.params.id},
                order: [['all', 'DESC']],
                limit: 10,
                include: [
                    {
                        model: Staff,
                        attributes: ['name', 'lastname']
                    }
                ]
            }).findAll()
            return res.json({ items: pay, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
        
    }
    async getStaff (req, res) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        if (req.query.search) {
            try {
                const searchTerm = req.query.search;
                const result = await new Servis(Staff, {
                    where: {
                        superId: req.params.id,
                        [Op.or]: [
                            { name: { [Op.like]: `%${searchTerm}%` } },
                            { lastname: { [Op.like]: `%${searchTerm}%` } },
                            { middlename: { [Op.like]: `%${searchTerm}%` } },
                        ]
                    },
                    limit: limit,
                    offset: offset,
                    order: [['id', 'DESC']],
                    include: [
                        {
                            model: Pay,
                            where: { date: `${yyyy}-${mm}` },
                            required: false
                        },
                        {
                            model: Change,
                            attributes: ['smen']
                        }
                    ]
                }).findAll();

                const result2 = await new Servis(Staff, {
                    where: {
                        superId: req.params.id,
                        [Op.or]: [
                            { name: { [Op.like]: `%${searchTerm}%` } },
                            { lastname: { [Op.like]: `%${searchTerm}%` } },
                            { middlename: { [Op.like]: `%${searchTerm}%` } },
                        ]
                    },
                    attributes: ['id'],
                    order: [['name', 'ASC']],
                }).findAll();

                const allstatus = await new Servis(Staff, {
                    where: {
                        superId: req.params.id,
                        status: 'true'
                    },
                    attributes: ['id']
                }).findAll();
                return res.json({ items: result, all: result2.length, status: allstatus.length, statusCode: 200 });
            } catch (error) {
                return res.json({ statusCode: 404 });
            }
        } else {
            try{
                const result = await new Servis(Staff, {
                    where: { superId: req.params.id },
                    limit: limit,
                    offset: offset,
                    order: [['name', 'ASC']],
                    include: [
                        {
                            model: Pay,
                            where: { date: `${yyyy}-${mm}` },
                            required: false
                        },
                        {
                            model: Change,
                            attributes: ['smen']
                        }
                    ]
                }).findAll();
                const result2 = await new Servis(Staff, {
                    where: { superId: req.params.id },
                    attributes: ['id']
                }).findAll();
                const allstatus = await new Servis(Staff, {
                    where: {
                        superId: req.params.id,
                        status: 'true'
                    },
                    attributes: ['id']
                }).findAll();
                return res.json({ items: result, all: result2.length, status: allstatus.length, statusCode: 200 });
            } catch (error) {
                return res.json({ statusCode: 404 });
            }
        }
    }

    async getfindAll (req, res) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        try{
            const result = await new Servis(Pay, {
                where: { staffId: req.params.id },
                limit: limit,
                offset: offset,
                order: [['id', 'DESC']],
            }).findAll();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async findOtmenka (req, res) {
        try{    
            const result = await new Servis(Staff, {where: {id: Number(req.params.id)}}).findOne();
            if (result.status === 'false' || result.status === null) {
                result.status = 'true';
                await result.save();
            } else {
                result.status = 'false';
                await result.save();
            }
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async fulTimeStaff (req, res) {
        try{    
            const result = await new Servis(Staff, {where: {id: Number(req.params.id)}}).findOne();
            if (result.qor === 'false' || result.qor === null) {
                result.qor = 'true';
                await result.save();
            } else {
                result.qor = 'false';
                await result.save();
            }
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async changeSmen (req, res) {
        try{    
            const result = await new Servis(Staff, {
                changeId: req.body.changeId,
            }).update({where: {superId: req.params.id, status: 'true'}});
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async findOtmenkaAll (req, res) {
        try{    
            const result = await new Servis(Staff, {
                status: req.body.status
            }).update({where: {superId: req.params.id}});
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async findOtmenkaAllClear (req, res) {
        try{    
            const result = await new Servis(Staff, {
                status: req.body.status
            }).update({where: {superId: req.params.id}});
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async getExport (req, res) {
        try{
            const result = await new Servis(Staff, {
                where: {superId: req.params.id},
                order: [['name', 'ASC']],
                include: [
                    {
                        model: Change,
                    },
                    {
                        model: Pay
                    }
                ]
            }).findAll();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async createStaff (req, res) {
        try{
            const result = await new Servis(Staff, {...req.body}).create();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            console.log(error);
            return res.json({ statusCode: 404 });
        }
    }

    async updateStaff (req, res) {
        try{    
            const result = await new Servis(Staff, {...req.body}).update({where: {id: req.params.id}});
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async deleteStaff (req, res) {
        try{    
            const result = await new Servis(Staff, {where: {id: req.params.id}}).destroy();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }
}

module.exports = new StaffControl;