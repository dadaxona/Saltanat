const Servis = require("./Servis");
const { Device } = require('../../models');
class DeviceControl {
    async getDevice (req, res) {
        try{
            const result = await new Servis(Device, {
                where: {superId: req.params.id},
                order: [['id', 'ASC']]}
            ).findAll();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async createDevice (req, res) {        
        try{
            const result = await new Servis(Device, {...req.body}).create();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async updateDevice (req, res) {
        try{    
            const result = await new Servis(Device, {...req.body}).update({where: {id: req.params.id}});
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }

    async deleteDevice (req, res) {
        try{    
            const result = await new Servis(Device, {where: {id: req.params.id}}).destroy();
            return res.json({ items: result, statusCode: 200 });
        } catch (error) {
            return res.json({ statusCode: 404 });
        }
    }
}

module.exports = new DeviceControl;