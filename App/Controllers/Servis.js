class Servis {
    constructor (model, option) {
        this.model = model;
        this.option = option;
    }

    async findAll () {
        return await this.model.findAll({...this.option})
    }

    async findOne () {
        return await this.model.findOne({...this.option})
    }
    
    async findByPk () {
        return await this.model.findByPk(this.option)
    }

    async create () {
        return await this.model.create(this.option)
    }

    async update (option) {
        return await this.model.update(this.option, option)
    }

    async destroy () {
        return await this.model.destroy(this.option)
    }
}
module.exports = Servis;