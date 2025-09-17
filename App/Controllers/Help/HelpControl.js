const { Control, Pay } = require('../../../models');
const { Op } = require("sequelize");
class HelpControl {
    constructor (staff, analiz) {
        this.staff = staff;
        this.analiz = analiz;
    }

    dateTime () {
        const todayData = new Date();
        const today = todayData.toISOString().split('T')[0];
        const times = todayData.toLocaleTimeString("uz-UZ", { timeZone: "Asia/Tashkent", hour12: false });
        const [clock, minut, secound] = times.split(':')
        const [yyyy, mm, dd] = today.split('-')
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
        const { today, yyyy, mm, dd, time } = this.dateTime();
        const staffkirish = this.staff.Change.time;
        
        const [staffsoat, staffminut] = staffkirish.split(":").map(Number);
        const [realsoat, realminut] = time.split(":").map(Number);

        const stafftime = staffsoat * 3600 + staffminut * 60;
        const realtime = realsoat * 3600 + realminut * 60;
        if (realtime > stafftime) {
            await this.analiz.create({
                superId: this.staff.superId,
                staffId: this.staff.id,
                changeId: this.staff.Change.id,
                name: this.staff.name,
                lastname: this.staff.lastname,
                middlename: this.staff.middlename,
                time: time,
                day: today,
                month: `${yyyy}-${mm}`,
                year: yyyy,
                status: 'false'
            });
            await this.control(this.staff.id, this.staff.superId);
        } else {
            await this.analiz.create({
                superId: this.staff.superId,
                staffId: this.staff.id,
                changeId: this.staff.Change.id,
                name: this.staff.name,
                lastname: this.staff.lastname,
                middlename: this.staff.middlename,
                time: time,
                day: today,
                month: `${yyyy}-${mm}`,
                year: yyyy,
                status: 'true'
            });
        }
        return;
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
    }

    async update() {
        const { today, yyyy, mm, dd, time } = this.dateTime();
        const smen = this.staff.Change.smen;
        const stafftime2 = this.staff.Change.time2;
        const [staffsoat, staffminut] = stafftime2.split(":").map(Number);
        const [realsoat, realminut] = time.split(":").map(Number);
        
        let stafftugash = staffsoat * 3600 + staffminut * 60;
        let realtime = realsoat * 3600 + realminut * 60;
        
        const yakshanba = new Date();
        if (yakshanba.getDay() === 0) {
            realtime += 3600;
            if (realtime < 0) realtime = 0;
        }
        const workDay = this.staff.date;

        const results = await this.analiz.findOne({ where: { staffId: this.staff.id, day: workDay }});
        if (results) {
            if (smen === "Kun") {
                await this.closeTime(results.time);
            }
            if (smen === "Tun") {
                await this.closeTime2(results.time);
            }
            if (smen === "To'liq") {
                await this.closeFullTime(results.time);
            }
            results.time2 = time;
            results.status2 = realtime > stafftugash ? 'true' : 'false';
            await results.save();
            if (realtime < stafftugash) {
                await this.control2(this.staff.id, this.staff.superId);
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
        const smen = this.staff.Change.smen;
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
        const workDay = this.staff.date;

        const results = await this.analiz.findOne({ where: { staffId: this.staff.id, day: workDay }});
        if (results) {
            if (smen === "Kun") {
                await this.closeTime(results.time);
            }
            if (smen === "Tun") {
                await this.closeTime2(results.time);
            }
            if (smen === "To'liq") {
                await this.closeFullTime(results.time);
            }
            results.time2 = time;
            results.status2 = realtime > stafftugash ? 'true' : 'false';
            await results.save();
            this.staff.changeId = deffrent.changeId2;
            this.staff.qor = 'false';
            await this.staff.save()
            if (realtime < stafftugash) {
                await this.control2(this.staff.id, this.staff.superId);
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