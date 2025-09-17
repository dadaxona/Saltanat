const Servis = require("./Servis");
const { Super, Admin, Analiz, Staff, Change, Device, Control, Pay, Nocam, Diffrent } = require('../../models');
const { Op } = require("sequelize");
const HelpControl = require("./Help/HelpControl");
class AnalizControl {
    async Event (req, res) {
        const rawEvent = req.body.event_log;
        const event = JSON.parse(rawEvent);
        if (event.AccessControllerEvent?.employeeNoString) {
            const { today } = new HelpControl().dateTime()
            const employeeNo = event.AccessControllerEvent?.employeeNoString || null;            
            if (employeeNo) {
                const result = await new Servis(Staff, {
                    where: {id: Number(employeeNo)},
                    include: [
                        {
                            model: Change
                        }
                    ]
                }).findOne();
                if (result && result.qor === 'true') {
                    const deffrent = await Diffrent.findOne({
                        where: {
                            changeId: result.changeId
                        }
                    })
                    if (deffrent) {
                        result.date = today;
                        await result.save()
                        await new HelpControl(result, Analiz).create2(deffrent);
                    }
                } else {
                    if (result && String(result.date) !== String(today)) {
                        result.date = today;
                        await result.save()
                        await new HelpControl(result, Analiz).create()
                    }
                }
            }
        }
        return res.status(200).send('OK');
    }

    async Event2 (req, res) {
        // const rawEvent = req.body.AccessControllerEvent;
        const rawEvent = req.body.event_log;
        const event = JSON.parse(rawEvent);
        if (event.AccessControllerEvent?.employeeNoString) {
            const { today } = new HelpControl().dateTime();
            const employeeNo = event.AccessControllerEvent?.employeeNoString || null;
            if (employeeNo) {
                const result = await new Servis(Staff, {
                    where: { id: Number(employeeNo) },
                    include: [{ model: Change }]
                }).findOne();
                if (result && result.qor === 'true') {
                    const deffrent = await Diffrent.findOne({
                        where: {
                            changeId: result.changeId
                        }
                    })
                    if (deffrent) {
                        await new HelpControl(result, Analiz).update2(deffrent);
                    }
                } else {
                    const prevDateObj = new Date(today);
                    prevDateObj.setDate(prevDateObj.getDate() - 1);
                    const prevDate = prevDateObj.toISOString().split('T')[0];
                    if ((result.Change.smen === "Kun" && String(result.date) === String(today)) ||
                        (result.Change.smen === "Tun" && (String(result.date) === String(today) || String(result.date) === String(prevDate))) || 
                        (result.Change.smen === "To'liq" && String(result.date) === String(prevDate))
                    ) {
                        await new HelpControl(result, Analiz).update();
                    }
                }
            }
        }
        return res.status(200).send('OK');
    }

    async getCount (req, res) {
        try {
            const analiz = await new Servis(Analiz, {
                where: {superId: req.params.id, changeId: Number(req.query.smen), day: req.query.date}
            }).findAll()
            const result = await new Servis(Super, {
                where: {id: req.params.id},
                include: [
                    {
                        model: Admin,
                        attributes: ['id']
                    },
                    {
                        model: Device,
                        attributes: ['id']
                    },
                    {
                        model: Change,
                        attributes: ['id']
                    },
                    {
                        model: Staff,
                        where: {changeId: Number(req.query.smen)},
                        attributes: ['id'],
                        required: false
                    },
                    {
                        model: Control,
                        attributes: ['id']
                    }
                ]
            }).findOne()
            return res.json({ items: result, analiz, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async getAnaliz (req, res) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        try{
            const result = await new Servis(Analiz, {
                where: {superId: req.params.id, changeId: Number(req.query.smen), day: req.query.date},
                limit: limit,
                offset: offset,
                order: [['name', 'ASC']],
                include: [
                    {
                        model: Staff,
                        // where: {changeId: Number(req.query.smen)},
                    },
                    {
                        model: Change
                    }
                ]
            }).findAll();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async getAnalizAll (req, res) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 30;
        const offset = (page - 1) * limit;
        const option = new HelpControl({},{}).option(req.query)
        try{
            const result = await new Servis(Analiz, {
                ...option,
                limit: limit,
                offset: offset,
                order: [['name', 'ASC']],
                include: [
                    {
                        model: Staff,
                        include: [
                            {
                                model: Pay
                            },
                            {
                                model: Control
                            }
                        ]
                    },
                    {
                        model: Change
                    }
                ]
            }).findAll();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async getAllExel (req, res) {
        const option = new HelpControl({},{}).option(req.query)
            try{
            const result = await new Servis(Analiz, {
                ...option,
                order: [['name', 'ASC']],
                include: [
                    {
                        model: Staff,
                        include: [
                            {
                                model: Pay
                            }
                        ]
                    },
                    {
                        model: Change
                    }
                ]
            }).findAll();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async excelapi (req, res) {
        try{
            const result = await new Servis(Analiz, {
                where: {superId: req.params.id, changeId: Number(req.query.smen), day: req.query.date},
                order: [['id', 'ASC']],
                include: [
                    {
                        model: Staff,
                        // where: {changeId: Number(req.query.smen)},
                        include: [
                            {
                                model: Change
                            },
                            {
                                model: Pay,
                                where: {date: req.query.paydate},
                                required: false
                            },
                        ]
                    }
                ]
            }).findAll();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async findAllStaff (req, res) {
        try{
            const result = await new Servis(Staff, {
                where: {
                    superId: req.params.id,
                    changeId: Number(req.query.smen),
                    [Op.or]: [
                        { date: { [Op.ne]: req.query.date } },
                        { date: null }
                    ]
                },
                order: [['id', 'DESC']],
                include: [
                    {
                        model: Change
                    }
                ]
            }).findAll();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async findAllStaffNocam (req, res) {
        try{
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const result = await new Servis(Nocam, {
                where: { superId: req.params.id },
                limit: limit,
                offset: offset,
                order: [['id', 'DESC']],
                include: [
                    {
                        model: Change
                    }
                ]
            }).findAll();
            const count = await new Servis(Nocam, {
                where: { superId: req.params.id },
                attributes: ['id'],
            }).findAll();
            return res.json({ items: result, count: count.length, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async findAllNocamExel (req, res) {
        try{
            const result = await new Servis(Nocam, {
                where: { superId: req.params.id },
                order: [['id', 'DESC']],
                include: [
                    {
                        model: Change
                    }
                ]
            }).findAll();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async getfindOne (req, res) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        try{
            const result = await new Servis(Staff, {
                where: {
                    superId: req.params.id,
                    changeId: Number(req.query.smen),
                    [Op.or]: [
                        { date: { [Op.ne]: req.query.date } },
                        { date: null }
                    ]
                },
                limit,
                offset,
                order: [['id', 'DESC']],
                include: [
                    {
                        model: Change
                    }
                ]
            }).findAll();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async getfindOneInfo (req, res) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        try{
            const result = await new Servis(Staff, {
                where: {
                    superId: req.params.id,
                    changeId: Number(req.query.smen),
                    [Op.or]: [
                        { date: { [Op.ne]: req.query.date } },
                        { date: null }
                    ]
                },
                limit,
                offset,
                order: [['id', 'DESC']],
                include: [
                    {
                        model: Change
                    },
                    {
                        model: Pay,
                        where: {date: req.query.paydate},
                        required: false
                    },
                    {
                        model: Control
                    }
                ]
            }).findAll();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async getfindAll (req, res) {
        try{
            const result = await new Servis(Staff, {
                where: {
                    superId: req.params.id,
                    changeId: Number(req.query.smen),
                    [Op.or]: [
                        { date: { [Op.ne]: req.query.date } },
                        { date: null }
                    ]
                },
                order: [['id', 'DESC']],
                include: [
                    {
                        model: Change
                    }
                ]
            }).findAll();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async createAnaliz (req, res) {
        try{
            const result = await new Servis(Analiz, {...req.body}).create();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            console.log(error);
            return res.json({ statusCode: 404 });
        }
    }

    async updateAnaliz (req, res) {
        try{    
            const result = await new Servis(Analiz, {...req.body}).update({where: {id: req.params.id}});
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async deleteAnaliz (req, res) {
        try{    
            const result = await new Servis(Analiz, {where: {id: req.params.id}}).destroy();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async nocameDelete (req, res) {
        try{    
            const result = await new Servis(Nocam, {where: {id: req.params.id}}).destroy();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }
}

module.exports = new AnalizControl;