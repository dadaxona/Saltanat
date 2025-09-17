const Servis = require("./Servis");
const { Diffrent } = require('../../models');
class DiffrentControl {
    async getDiffrent (req, res) {
        try{
            const result = await new Servis(Diffrent, {
                where: {superId: req.params.id},
                order: [['id', 'ASC']]
            }).findAll();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async createDiffrent (req, res) {
        
        try{
            const result = await new Servis(Diffrent, {...req.body}).create();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            console.log(error);
            return res.json({ statusCode: 404 });
        }
    }

    async updateDiffrent (req, res) {
        try{    
            const result = await new Servis(Diffrent, {...req.body}).update({where: {id: req.params.id}});
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async deleteDiffrent (req, res) {
        try{    
            const result = await new Servis(Diffrent, {where: {id: req.params.id}}).destroy();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }
}

module.exports = new DiffrentControl;