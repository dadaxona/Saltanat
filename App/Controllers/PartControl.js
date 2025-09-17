const Servis = require("./Servis");
const { Part } = require('../../models');
class PartControl {
    async getPart (req, res) {
        try{
            const result = await new Servis(Part, {
                where: {superId: req.params.id},
                order: [['id', 'ASC']]
            }).findAll();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async createPart (req, res) {
        
        try{
            const result = await new Servis(Part, {...req.body}).create();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            console.log(error);
            return res.json({ statusCode: 404 });
        }
    }

    async updatePart (req, res) {
        try{    
            const result = await new Servis(Part, {...req.body}).update({where: {id: req.params.id}});
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async deletePart (req, res) {
        try{    
            const result = await new Servis(Part, {where: {id: req.params.id}}).destroy();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }
}

module.exports = new PartControl;