const { Control, Pay, Part } = require('../../../models');
const { Op } = require("sequelize");
class HelpControl {
    constructor (staff, analiz) {
        this.staff = staff;
        this.analiz = analiz;
    }

    dateTime () {
        const todayData = new Date();
        // const today = '2025-09-18';
        const today = todayData.toISOString().split('T')[0];
        const times = todayData.toLocaleTimeString("uz-UZ", { timeZone: "Asia/Tashkent", hour12: false });
        const [clock, minut, secound] = times.split(':')
        const [yyyy, mm, dd] = today.split('-')
        // const time = `01:03`
        const time = `${clock}:${minut}`
        return {today, yyyy, mm, dd, time}
    }

    async control (staffId, superId) {
        const data = await Control.findOne({ where: {staffId: staffId } })
        if (data) {
            data.count += 1;
            await data.save()
        } else {
            await Control.create({
                superId: superId,
                staffId: staffId,
                count: 1
            })
        }
        return;
    }

    async control2 (staffId, superId) {
        const data = await Control.findOne({ where: {staffId: staffId } })
        if (data) {
            data.count2 += 1;
            await data.save()
        } else {
            await Control.create({
                superId: superId,
                staffId: staffId,
                count2: 1
            })
        }
        return;
    }

    async create() {
        const results = await this.analiz.findOne({ 
            order: [['id', 'DESC']],
            where: { staffId: this.staff.id, day: this.staff.date }
        });
        if (!results) {
            await this.create_ftaff()
        } else {
            if (!results.online) {
                await this.create_ftaff()
            }
        }
    }

    tim(jami, n) {        
        if (jami >= 3600) {
            let a = jami - 3600;
            n++;
            return this.tim(a, n)
        } else {
            return n;
        }
    }

    async hisob(realtime, stafftime) {
        const jami = realtime - stafftime;
        const tim2 = this.tim(jami, 0)
        if (tim2 > 0) {
            const part = await Part.findOne({
                where: {superId: this.staff.superId, part: tim2},
                attributes: ['result']
            });
            if (part) {
                const a = Number(this.staff.money) / 100;
                const natija = a * Number(part.result);
                return {natija, jami};
            }
        } else {
            const natija = 0;
            return {natija, jami};
        }
    }

    async create_ftaff() {
        const { today, yyyy, mm, dd, time } = this.dateTime();
        const staffkirish = this.staff.Change.time;
        
        const [staffsoat, staffminut] = staffkirish.split(":").map(Number);
        const [realsoat, realminut] = time.split(":").map(Number);

        const stafftime = staffsoat * 3600 + staffminut * 60;
        const realtime = realsoat * 3600 + realminut * 60;
        
        const check = realtime > stafftime ? true : false;
        if (check) {
            const {natija, jami} = await this.hisob(realtime, stafftime)
            await this.analiz.create({
                superId: this.staff.superId,
                staffId: this.staff.id,
                changeId: this.staff.Change.id,
                smen: this.staff.Change.smen,
                name: this.staff.name,
                lastname: this.staff.lastname,
                middlename: this.staff.middlename,
                time: time,
                day: today,
                month: `${yyyy}-${mm}`,
                year: yyyy,
                status: 'false',
                errortime: jami,
                summa: natija,
                online: true
            });
            return await this.control(this.staff.id, this.staff.superId)
        } else {
            await this.analiz.create({
                superId: this.staff.superId,
                staffId: this.staff.id,
                changeId: this.staff.Change.id,
                smen: this.staff.Change.smen,
                name: this.staff.name,
                lastname: this.staff.lastname,
                middlename: this.staff.middlename,
                time: time,
                day: today,
                month: `${yyyy}-${mm}`,
                year: yyyy,
                status: 'true',
                errortime: 0,
                summa: 0,
                online: true
            });
            return;
        }
    }

    async closeTime (kirish) {
        const {yyyy, mm, dd, time} = this.dateTime()

        const startTime = kirish;
        const endTime = time;

        const today = new Date();
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, startMinute);

        const [endHour, endMinute] = endTime.split(":").map(Number);
        const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);

        const diffMs = endDate - startDate;
        const totalSeconds = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        const jami = hours * 3600;
        const jami2 = minutes * 60;
        const jami3 = jami + jami2;

        const data = await Pay.findOne({ where: { staffId: this.staff.id, date: `${yyyy}-${mm}` }})
        if (data) {
            data.all = Number(data.all) + Number(jami3);
            await data.save();
        } else {
            await Pay.create({
                superId: this.staff.superId,
                staffId: this.staff.id,
                all: Number(jami3),
                date: `${yyyy}-${mm}`
            });
        }
        return {jami3};
    }

    async closeTime2 (kirish) {
        const {yyyy, mm, dd, time} = this.dateTime()

        const startTime = kirish;
        const endTime = time;

        const today = new Date();
        const [endHour, endMinute] = endTime.split(":").map(Number);
        const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), startHour, startMinute);

        const diffMs = endDate - startDate;
        const totalSeconds = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        const jami = hours * 3600;
        const jami2 = minutes * 60;
        const jami3 = jami + jami2;
        const data = await Pay.findOne({ where: { staffId: this.staff.id, date: `${yyyy}-${mm}` }});
        if (data) {
            data.all = Number(data.all) + Number(jami3);
            await data.save();
        } else {
            await Pay.create({
                superId: this.staff.superId,
                staffId: this.staff.id,
                all: Number(jami3),
                date: `${yyyy}-${mm}`
            });
        }
        return {jami3}
    }

    async update() {
        const {today, yyyy, mm, dd, time } = this.dateTime();
        const smen = this.staff.Change.day;
        const stafftime2 = this.staff.Change.time2;
        const [staffsoat, staffminut] = stafftime2.split(":").map(Number);
        const [realsoat, realminut] = time.split(":").map(Number);
        
        let stafftugash = staffsoat * 3600 + staffminut * 60;
        let realtime = realsoat * 3600 + realminut * 60;
        if (smen) {
            const tu = new Date();
            const yesterday = new Date(tu);
            yesterday.setDate(tu.getDate() - 1);
            const date = yesterday.toISOString().split('T')[0];
            const results2 = await this.analiz.findOne({
                order: [['id', 'DESC']],
                where: { staffId: this.staff.id, day: String(date) }
            });
            if (results2) {
                const check = realtime > stafftugash ? true : false;
                const {jami3} = await this.closeTime2(results2.time);
                // const [sta, staffmi] = results2.time.split(":").map(Number);
                // const [reals, realmi] = time.split(":").map(Number);

                // const kirish = sta * 3600 + staffmi * 60;
                // const chiqish = reals * 3600 + realmi * 60;
                // const jami = chiqish - kirish;

                results2.owerall = jami3;
                results2.time2 = time;
                results2.status2 = check ? 'true' : 'false';
                results2.errortime2 = check ? 0 : stafftugash - realtime;
                results2.online = false;
                await results2.save();
                return await this.control2(this.staff.id, this.staff.superId)
            }
            return;
        } else {
            const results = await this.analiz.findOne({
                order: [['id', 'DESC']],
                where: { staffId: this.staff.id, day: String(today) }
            });
            if (results) {
                await this.closeTime(results.time);
                const check = realtime > stafftugash ? true : false;
                const [sta, staffmi] = results.time.split(":").map(Number);
                const [reals, realmi] = time.split(":").map(Number);
                
                const kirish = sta * 3600 + staffmi * 60;
                const chiqish = reals * 3600 + realmi * 60;
                const jami = chiqish - kirish;

                results.owerall = jami;
                results.time2 = time;
                results.status2 = check ? 'true' : 'false';
                results.online = false;
                results.errortime2 = 0;
                await results.save();
                return !check ? await this.control2(this.staff.id, this.staff.superId) : null;
            } else {
                const tod = new Date();
                const yesterday = new Date(tod);
                yesterday.setDate(tod.getDate() - 1);
                const date2 = yesterday.toISOString().split('T')[0];
                const results2 = await this.analiz.findOne({
                    order: [['id', 'DESC']],
                    where: { staffId: this.staff.id, day: String(date2) }
                });
                if (results2) {
                    await this.closeTime2(results2.time);
                    const [sta, staffmi] = results2.time.split(":").map(Number);
                    const [sta2, staffmi2] = '23:59'.split(":").map(Number);
                    const [reals, realmi] = time.split(":").map(Number);
                    const kirish = sta * 3600 + staffmi * 60;
                    const chiqish = reals * 3600 + realmi * 60;
                    const chiqish2 = sta2 * 3600 + staffmi2 * 60;
                    const jami = chiqish2 - kirish;
                    const jami2 = jami + chiqish;

                    results2.owerall = String(jami2);
                    results2.time2 = time;
                    results2.status2 = 'true';
                    results2.online = false;
                    results2.errortime2 = 0;
                    await results2.save();
                }
            }
            return;
        }
    }

    async closeFullTime (kirish) {
        const {yyyy, mm, dd, time} = this.dateTime()

        const startTime = kirish;
        const endTime = time;

        const today = new Date();
        const [endHour, endMinute] = endTime.split(":").map(Number);
        const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), startHour, startMinute);

        const diffMs = endDate - startDate;
        const totalSeconds = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        const jami = hours * 3600;
        const jami2 = minutes * 60;
        const jami3 = jami + jami2;

        const data = await Pay.findOne({ where: { staffId: this.staff.id, date: `${yyyy}-${mm}` }});
        if (data) {
            data.all = Number(data.all) + Number(jami3);
            await data.save();
        } else {
            await Pay.create({
                superId: this.staff.superId,
                staffId: this.staff.id,
                all: Number(jami3),
                date: `${yyyy}-${mm}`
            });
        }
    }

    async create2(deffrent) {
        const { today, yyyy, mm, dd, time } = this.dateTime();
        let staffkirish2 = ''
        if (deffrent.time) {
            staffkirish2 = deffrent.time;
        }
        if (deffrent.time2) {
            staffkirish2 = deffrent.time2;
        }
        
        const [staffsoat, staffminut] = staffkirish2.split(":").map(Number);
        const [realsoat, realminut] = time.split(":").map(Number);

        const stafftime = staffsoat * 3600 + staffminut * 60;
        const realtime = realsoat * 3600 + realminut * 60;
        if (realtime > stafftime) {
            await this.analiz.create({
                superId: this.staff.superId,
                staffId: this.staff.id,
                changeId: this.staff.Change.id,
                smen: this.staff.Change.smen,
                name: this.staff.name,
                lastname: this.staff.lastname,
                middlename: this.staff.middlename,
                time: time,
                day: today,
                month: `${yyyy}-${mm}`,
                year: yyyy,
                status: 'false'
            });
            this.staff.changeId = deffrent.changeId2;
            this.staff.qor = 'false';
            await this.staff.save()
            await this.control(this.staff.id, this.staff.superId);
        } else {
            await this.analiz.create({
                superId: this.staff.superId,
                staffId: this.staff.id,
                changeId: this.staff.Change.id,
                smen: this.staff.Change.smen,
                name: this.staff.name,
                lastname: this.staff.lastname,
                middlename: this.staff.middlename,
                time: time,
                day: today,
                month: `${yyyy}-${mm}`,
                year: yyyy,
                status: 'true'
            });
            this.staff.changeId = deffrent.changeId2;
            this.staff.qor = 'false';
            await this.staff.save()
        }
        return;
    }

    async update2(deffrent) {
        const { today, yyyy, mm, dd, time } = this.dateTime();
        const smen = this.staff.Change.day;
        let stafftime2 = ''

        if (deffrent.time) {
            stafftime2 = deffrent.time;
        }
        if (deffrent.time2) {
            stafftime2 = deffrent.time2;
        }
        
        const [staffsoat, staffminut] = stafftime2.split(":").map(Number);
        const [realsoat, realminut] = time.split(":").map(Number);
        
        let stafftugash = staffsoat * 3600 + staffminut * 60;
        let realtime = realsoat * 3600 + realminut * 60;
        if (smen) {
            const tu = new Date();
            const yesterday = new Date(tu);
            yesterday.setDate(tu.getDate() - 1);
            const date = yesterday.toISOString().split('T')[0];
            const results2 = await this.analiz.findOne({
                order: [['id', 'DESC']],
                where: { staffId: this.staff.id, day: String(date) }
            });
            if (results2) {
                const check = realtime > stafftugash ? true : false;
                const {jami3} = await this.closeTime2(results2.time);

                results2.owerall = jami3;
                results2.time2 = time;
                results2.status2 = check ? 'true' : 'false';
                results2.errortime2 = check ? 0 : stafftugash - realtime;
                results2.online = false;
                await results2.save();

                this.staff.changeId = deffrent.changeId2;
                this.staff.qor = 'false';
                await this.staff.save()
                return await this.control2(this.staff.id, this.staff.superId)
            }
            return;
        } else {
            const results = await this.analiz.findOne({
                order: [['id', 'DESC']],
                where: { staffId: this.staff.id, day: String(today) }
            });
            if (results) {
                await this.closeTime(results.time);
                const check = realtime > stafftugash ? true : false;
                const [sta, staffmi] = results.time.split(":").map(Number);
                const [reals, realmi] = time.split(":").map(Number);
                
                const kirish = sta * 3600 + staffmi * 60;
                const chiqish = reals * 3600 + realmi * 60;
                const jami = chiqish - kirish;

                results.owerall = jami;
                results.time2 = time;
                results.status2 = check ? 'true' : 'false';
                results.online = false;
                results.errortime2 = 0;
                await results.save();

                this.staff.changeId = deffrent.changeId2;
                this.staff.qor = 'false';
                await this.staff.save()
                return !check ? await this.control2(this.staff.id, this.staff.superId) : null;
            } else {
                const tod = new Date();
                const yesterday = new Date(tod);
                yesterday.setDate(tod.getDate() - 1);
                const date2 = yesterday.toISOString().split('T')[0];
                const results2 = await this.analiz.findOne({
                    order: [['id', 'DESC']],
                    where: { staffId: this.staff.id, day: String(date2) }
                });
                if (results2) {
                    await this.closeTime2(results2.time);
                    const [sta, staffmi] = results2.time.split(":").map(Number);
                    const [sta2, staffmi2] = '23:59'.split(":").map(Number);
                    const [reals, realmi] = time.split(":").map(Number);

                    const kirish = sta * 3600 + staffmi * 60;
                    const chiqish = reals * 3600 + realmi * 60;
                    const chiqish2 = sta2 * 3600 + staffmi2 * 60;
                    const jami = chiqish2 - kirish;
                    const jami2 = jami + chiqish;

                    results2.owerall = String(jami2);
                    results2.time2 = time;
                    results2.status2 = 'true';
                    results2.online = false;
                    results2.errortime2 = 0;
                    await results2.save();

                    this.staff.changeId = deffrent.changeId2;
                    this.staff.qor = 'false';
                    await this.staff.save()
                }
            }
            return;
        }    
    }
    
    option (query) {
        let where = {};
        if (query.changeId) {
            where.changeId = query.changeId;
        }
        if (query.search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${query.search}%` } },
                { lastname: { [Op.like]: `%${query.search}%` } },
                { middlename: { [Op.like]: `%${query.search}%` } },
            ];
        }
        if (query.date) {
            if (query.date2) {
                where.day = { [Op.between]: [query.date, query.date2] };
            } else {
                where.day = query.date;
            }
        }
        return { where };
    }

}
module.exports = HelpControl;