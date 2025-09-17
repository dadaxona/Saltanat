const Servis = require("./Servis");
const { Control, Staff, Change, Nocam } = require('../../models');
const { Op } = require("sequelize");
class Controls {
    async getControl (req, res) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        try{
            const result = await new Servis(Control, {
                where: {superId: req.params.id},
                limit: limit,
                offset: offset,
                order: [['id', 'DESC']],
                include: [
                    {
                        model: Staff
                    }
                ]
            }).findAll();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async getControlExel (req, res) {
        try{
            const result = await new Servis(Control, {
                where: {superId: req.params.id},
                include: [
                    {
                        model: Staff
                    }
                ]
            }).findAll();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async filterStaff (date, typ) {
        const data = await Change.findOne({where: {smen: typ}})
        if (data) {
            const staf = await Staff.findAll({
                where: {
                    superId: data.superId,
                    changeId: data.id,
                    [Op.or]: [
                        { date: { [Op.ne]: `${date}` } },
                        { date: null }
                    ]
                }
            })
            if (staf && staf.length > 0) {  
                for (let i = 0; i < staf.length; i++) {
                    await Nocam.create({
                        superId: staf[i].superId,
                        changeId: staf[i].changeId,
                        name: staf[i].name,
                        lastname: staf[i].lastname,
                        middlename: staf[i].middlename,
                        date: `${date}`,
                        rasm: staf[i].rasm,
                    })
                }
            }
        }
    }

    async createControl (req, res) {
        try{
            const result = await new Servis(Control, {...req.body}).create();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            console.log(error);
            return res.json({ statusCode: 404 });
        }
    }

    async updateControl (req, res) {
        try{    
            const result = await new Servis(Control, {...req.body}).update({where: {id: req.params.id}});
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async deleteControl (req, res) {
        try{    
            const result = await new Servis(Control, {where: {id: req.params.id}}).destroy();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }
}

module.exports = new Controls;