const Servis = require("./Servis");
const { Change } = require('../../models');
class ChangeControl {
    async getChange (req, res) {
        try{
            const result = await new Servis(Change, {
                where: {superId: req.params.id},
                order: [['id', 'ASC']]
            }).findAll();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async createChange (req, res) {
        
        try{
            const result = await new Servis(Change, {...req.body}).create();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            console.log(error);
            return res.json({ statusCode: 404 });
        }
    }

    async updateChange (req, res) {
        try{    
            const result = await new Servis(Change, {...req.body}).update({where: {id: req.params.id}});
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async deleteChange (req, res) {
        try{    
            const result = await new Servis(Change, {where: {id: req.params.id}}).destroy();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }
}

module.exports = new ChangeControl;