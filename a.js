// const { Control, Pay } = require('../../../models');
// const formatter = new Intl.DateTimeFormat("uz-UZ", {
//   timeZone: "Asia/Tashkent",
//   hour12: false,
//   hour: "2-digit",
//   minute: "2-digit",
//   second: "2-digit"
// });

// const todayData = new Date();
// const today = new Intl.DateTimeFormat("uz-UZ", {
//   timeZone: "Asia/Tashkent",
//   year: "numeric",
//   month: "2-digit",
//   day: "2-digit"
// }).format(todayData).split('.').reverse().join('-'); // 'YYYY-MM-DD'

// const times = formatter.format(todayData); // Masalan: "10:52:14"
// const [clock, minut, secound] = times.split(':');

// const time = `${clock}:${minut}`; // Masalan: "10:52"

// class HelpControl {
//     constructor (staff, analiz) {
//         this.staff = staff;
//         this.analiz = analiz;
//     }

//     dateTime () {
//         return {today}
//     }

//     async control (staffId, superId) {
//         const data = await Control.findOne({ where: {staffId: staffId } })
//         if (data) {
//             data.count += 1;
//             await data.save()
//         } else {
//             await Control.create({
//                 superId: superId,
//                 staffId: staffId,
//                 count: 1
//             })
//         }
//         return;
//     }

//     async control2 (staffId, superId) {
//         const data = await Control.findOne({ where: {staffId: staffId } })
//         if (data) {
//             data.count2 += 1;
//             await data.save()
//         } else {
//             await Control.create({
//                 superId: superId,
//                 staffId: staffId,
//                 count2: 1
//             })
//         }
//         return;
//     }

//     async create () {
//         const smen = this.staff.Change.smen;
//         const deadline = this.staff.Change.time;
//         const [dHour, dMin] = deadline.split(":").map(Number);
//         const [tHour, tMin] = time.split(":").map(Number);
//         const deadlineMinutes = dHour * 60 + dMin;
//         const timeMinutes = tHour * 60 + tMin;
//         if (smen === "Kun") {
//             if (timeMinutes > deadlineMinutes) {
//                 await this.analiz.create({
//                     superId: this.staff.superId,
//                     staffId: this.staff.id,
//                     name: this.staff.name,
//                     lastname: this.staff.lastname,
//                     middlename: this.staff.middlename,
//                     time: time,
//                     day: today,
//                     month: `${yyyy}-${mm}`,
//                     year: yyyy,
//                     status: 'false'
//                 })
//                 await this.control(this.staff.id, this.staff.superId)
//             } else {
//                 await this.analiz.create({
//                     superId: this.staff.superId,
//                     staffId: this.staff.id,
//                     name: this.staff.name,
//                     lastname: this.staff.lastname,
//                     middlename: this.staff.middlename,
//                     time: time,
//                     day: today,
//                     month: `${yyyy}-${mm}`,
//                     year: yyyy,
//                     status: 'true'
//                 })
//             }
//             return;
//         }
//         if (smen === "Tun") {
//             if (timeMinutes < deadlineMinutes) {
//                 await this.analiz.create({
//                     superId: this.staff.superId,
//                     staffId: this.staff.id,
//                     name: this.staff.name,
//                     lastname: this.staff.lastname,
//                     middlename: this.staff.middlename,
//                     time: time,
//                     day: today,
//                     month: `${yyyy}-${mm}`,
//                     year: yyyy,
//                     status: 'false'
//                 })
//                 await this.control(this.staff.id, this.staff.superId)
//             } else {
//                 await this.analiz.create({
//                     superId: this.staff.superId,
//                     staffId: this.staff.id,
//                     name: this.staff.name,
//                     lastname: this.staff.lastname,
//                     middlename: this.staff.middlename,
//                     time: time,
//                     day: today,
//                     month: `${yyyy}-${mm}`,
//                     year: yyyy,
//                     status: 'true'
//                 })
//             }
//             return;
//         }
//     }

//     async closeTime () {
//         const deadline = this.staff.Change.time;
//         const [dHour, dMin] = deadline.split(":").map(Number);
//         const [tHour, tMin] = time.split(":").map(Number);
//         const deadlineMinutes = dHour * 60 + dMin;
//         const timeMinutes = tHour * 60 + tMin;
//         const diff = timeMinutes - deadlineMinutes;
//         const data = await Pay.findOne({ where: { staffId: this.staff.id, date: `${yyyy}-${mm}` }})
//         if (data) {
//             data.all = Number(data.all) + Number(diff);
//             await data.save();
//         } else {
//             await Pay.create({
//                 superId: this.staff.superId,
//                 staffId: this.staff.id,
//                 all: diff,
//                 date: `${yyyy}-${mm}`
//             });
//         }
//     }

//     async closeTime2 () {
//         const kirish = this.staff.Change.time; // Kirish vaqti
//         const [kHour, kMin] = kirish.split(":").map(Number);
//         const [tHour, tMin] = time.split(":").map(Number); // Real chiqish vaqti

//         let kirishMinutes = kHour * 60 + kMin;
//         let chiqishMinutes = tHour * 60 + tMin;

//         if (chiqishMinutes < kirishMinutes) {
//             chiqishMinutes += 24 * 60; // Tun smenasi uchun
//         }

//         let diff = chiqishMinutes - kirishMinutes;

//         // Faqat >60 da tushlikni ayiramiz
//         if (diff > 60) diff = diff - 60;

//         if (diff < 0) diff = 0;

//         const data = await Pay.findOne({ where: { staffId: this.staff.id, date: `${yyyy}-${mm}` }});
//         if (data) {
//             data.all = Number(data.all) + diff;
//             await data.save();
//         } else {
//             await Pay.create({
//                 superId: this.staff.superId,
//                 staffId: this.staff.id,
//                 all: diff,
//                 date: `${yyyy}-${mm}`
//             });
//         }
//     }

//     async update () {
//         const smen = this.staff.Change.smen;
//         const deadline = this.staff.Change.time2;
//         const [dHour, dMin] = deadline.split(":").map(Number);
//         const [tHour, tMin] = time.split(":").map(Number);

//         const deadlineMinutes = dHour * 60 + dMin;
//         const timeMinutes = tHour * 60 + tMin;
//         const workDay = this.staff.date;  

//         if (smen === "Kun") {
//             await this.closeTime();
//             const results = await this.analiz.findOne({ where: { staffId: this.staff.id, day: workDay }});
//             if (results) {
//                 results.time2 = time;
//                 results.status2 = timeMinutes < deadlineMinutes ? 'false' : 'true';
//                 await results.save();
//                 if (timeMinutes < deadlineMinutes) {
//                     await this.control2(this.staff.id, this.staff.superId);
//                 }
//             }
//             return;
//         }

//         if (smen === "Tun") {
//             await this.closeTime2();
//             const results = await this.analiz.findOne({ where: { staffId: this.staff.id, day: workDay }});
//             if (results) {
//                 results.time2 = time;
//                 results.status2 = timeMinutes > deadlineMinutes ? 'false' : 'true';
//                 await results.save();
//                 if (timeMinutes > deadlineMinutes) {
//                     await this.control2(this.staff.id, this.staff.superId);
//                 }
//             }
//             return;
//         }
//     }

//     // async update () {
//     //     const smen = this.staff.Change.smen;
//     //     const deadline = this.staff.Change.time2;
//     //     const [dHour, dMin] = deadline.split(":").map(Number);
//     //     const [tHour, tMin] = time.split(":").map(Number);
//     //     const deadlineMinutes = dHour * 60 + dMin;
//     //     const timeMinutes = tHour * 60 + tMin;

//     //     if (smen === "Kun") {
//     //         await this.closeTime()
//     //         const results = await this.analiz.findOne({ where: { staffId: this.staff.id, day: today } })
//     //         if (results) {
//     //             results.time2 = time;
//     //             if (timeMinutes < deadlineMinutes) {
//     //                 results.status2 = 'false';
//     //                 await this.control2(this.staff.id, this.staff.superId)
//     //             } else {
//     //                 results.status2 = 'true';
//     //             }
//     //             await results.save()
//     //         }
//     //         return;
//     //     }

//     //     if (smen === "Tun") {
//     //         await this.closeTime2()
//     //         const results = await this.analiz.findOne({ where: { staffId: this.staff.id, day: this.staff.date } })
//     //         if (results) {
//     //             results.time2 = time;
//     //             if (timeMinutes > deadlineMinutes) {
//     //                 results.status2 = 'false';
//     //                 await this.control2(this.staff.id, this.staff.superId)
//     //             } else {
//     //                 results.status2 = 'true';
//     //             }
//     //             await results.save()
//     //         }
//     //         return;
//     //     }
//     // }

//         // async create () {
//     //     const {today, yyyy, mm, dd, time} = this.dateTime()
//     //     const smen = this.staff.Change.smen;
//     //     const deadline = this.staff.Change.time;
//     //     const [dHour, dMin] = deadline.split(":").map(Number);
//     //     const [tHour, tMin] = time.split(":").map(Number);
//     //     const deadlineMinutes = dHour * 60 + dMin;
//     //     const timeMinutes = tHour * 60 + tMin;
//     //     if (smen === "Kun") {
//     //         if (timeMinutes > deadlineMinutes) {
//     //             await this.analiz.create({
//     //                 superId: this.staff.superId,
//     //                 staffId: this.staff.id,
//     //                 name: this.staff.name,
//     //                 lastname: this.staff.lastname,
//     //                 middlename: this.staff.middlename,
//     //                 time: time,
//     //                 day: today,
//     //                 month: `${yyyy}-${mm}`,
//     //                 year: yyyy,
//     //                 status: 'false'
//     //             })
//     //             await this.control(this.staff.id, this.staff.superId)
//     //         } else {
//     //             await this.analiz.create({
//     //                 superId: this.staff.superId,
//     //                 staffId: this.staff.id,
//     //                 name: this.staff.name,
//     //                 lastname: this.staff.lastname,
//     //                 middlename: this.staff.middlename,
//     //                 time: time,
//     //                 day: today,
//     //                 month: `${yyyy}-${mm}`,
//     //                 year: yyyy,
//     //                 status: 'true'
//     //             })
//     //         }
//     //         return;
//     //     }
//     //     if (smen === "Tun") {
//     //         if (timeMinutes < deadlineMinutes) {
//     //             await this.analiz.create({
//     //                 superId: this.staff.superId,
//     //                 staffId: this.staff.id,
//     //                 name: this.staff.name,
//     //                 lastname: this.staff.lastname,
//     //                 middlename: this.staff.middlename,
//     //                 time: time,
//     //                 day: today,
//     //                 month: `${yyyy}-${mm}`,
//     //                 year: yyyy,
//     //                 status: 'false'
//     //             })
//     //             await this.control(this.staff.id, this.staff.superId)
//     //         } else {
//     //             await this.analiz.create({
//     //                 superId: this.staff.superId,
//     //                 staffId: this.staff.id,
//     //                 name: this.staff.name,
//     //                 lastname: this.staff.lastname,
//     //                 middlename: this.staff.middlename,
//     //                 time: time,
//     //                 day: today,
//     //                 month: `${yyyy}-${mm}`,
//     //                 year: yyyy,
//     //                 status: 'true'
//     //             })
//     //         }
//     //         return;
//     //     }
//     // }
    
//     // async update () {
//     //     const {today, yyyy, mm, dd, time} = this.dateTime()
//     //     const smen = this.staff.Change.smen;
//     //     const deadline = this.staff.Change.time2;
//     //     const [dHour, dMin] = deadline.split(":").map(Number);
//     //     const [tHour, tMin] = time.split(":").map(Number);

//     //     const deadlineMinutes = dHour * 60 + dMin;
//     //     const timeMinutes = tHour * 60 + tMin;
//     //     const workDay = this.staff.date;  

//     //     if (smen === "Kun") {
//     //         await this.closeTime();
//     //         const results = await this.analiz.findOne({ where: { staffId: this.staff.id, day: workDay }});
//     //         if (results) {
//     //             results.time2 = time;
//     //             results.status2 = timeMinutes < deadlineMinutes ? 'false' : 'true';
//     //             await results.save();
//     //             if (timeMinutes < deadlineMinutes) {
//     //                 await this.control2(this.staff.id, this.staff.superId);
//     //             }
//     //         }
//     //         return;
//     //     }

//     //     if (smen === "Tun") {
//     //         await this.closeTime2();
//     //         const results = await this.analiz.findOne({ where: { staffId: this.staff.id, day: workDay }});
//     //         if (results) {
//     //             results.time2 = time;
//     //             results.status2 = timeMinutes > deadlineMinutes ? 'false' : 'true';
//     //             await results.save();
//     //             if (timeMinutes > deadlineMinutes) {
//     //                 await this.control2(this.staff.id, this.staff.superId);
//     //             }
//     //         }
//     //         return;
//     //     }
//     // }

//     // async update () {
//     //     const smen = this.staff.Change.smen;
//     //     const deadline = this.staff.Change.time2;
//     //     const [dHour, dMin] = deadline.split(":").map(Number);
//     //     const [tHour, tMin] = time.split(":").map(Number);
//     //     const deadlineMinutes = dHour * 60 + dMin;
//     //     const timeMinutes = tHour * 60 + tMin;

//     //     if (smen === "Kun") {
//     //         await this.closeTime()
//     //         const results = await this.analiz.findOne({ where: { staffId: this.staff.id, day: today } })
//     //         if (results) {
//     //             results.time2 = time;
//     //             if (timeMinutes < deadlineMinutes) {
//     //                 results.status2 = 'false';
//     //                 await this.control2(this.staff.id, this.staff.superId)
//     //             } else {
//     //                 results.status2 = 'true';
//     //             }
//     //             await results.save()
//     //         }
//     //         return;
//     //     }

//     //     if (smen === "Tun") {
//     //         await this.closeTime2()
//     //         const results = await this.analiz.findOne({ where: { staffId: this.staff.id, day: this.staff.date } })
//     //         if (results) {
//     //             results.time2 = time;
//     //             if (timeMinutes > deadlineMinutes) {
//     //                 results.status2 = 'false';
//     //                 await this.control2(this.staff.id, this.staff.superId)
//     //             } else {
//     //                 results.status2 = 'true';
//     //             }
//     //             await results.save()
//     //         }
//     //         return;
//     //     }
//     // }

// }
// module.exports = HelpControl;


// const { Control, Pay } = require('../../../models');
// class HelpControl {
//     constructor (staff, analiz) {
//         this.staff = staff;
//         this.analiz = analiz;
//     }

//     dateTime () {
//         const todayData = new Date();
//         const today = '2025-09-15';
//         // const today = todayData.toISOString().split('T')[0];
//         const times = todayData.toLocaleTimeString("uz-UZ", { timeZone: "Asia/Tashkent", hour12: false });
//         const [clock, minut, secound] = times.split(':')
//         const [yyyy, mm, dd] = today.split('-')
//         const time = `08:01`
//         // const time = `${clock}:${minut}`
//         return {today, yyyy, mm, dd, time}
//     }

//     async control (staffId, superId) {
//         const data = await Control.findOne({ where: {staffId: staffId } })
//         if (data) {
//             data.count += 1;
//             await data.save()
//         } else {
//             await Control.create({
//                 superId: superId,
//                 staffId: staffId,
//                 count: 1
//             })
//         }
//         return;
//     }

//     async control2 (staffId, superId) {
//         const data = await Control.findOne({ where: {staffId: staffId } })
//         if (data) {
//             data.count2 += 1;
//             await data.save()
//         } else {
//             await Control.create({
//                 superId: superId,
//                 staffId: staffId,
//                 count2: 1
//             })
//         }
//         return;
//     }

//     async create() {
//         const { today, yyyy, mm, dd, time } = this.dateTime();
//         const smen = this.staff.Change.smen;
//         const staffkirish = this.staff.Change.time;
        
//         const [staffsoat, staffminut] = staffkirish.split(":").map(Number);
//         const [realsoat, realminut] = time.split(":").map(Number);

//         const stafftime = staffsoat * 3600 + staffminut * 60;
//         const realtime = realsoat * 3600 + realminut * 60;
//         if (realtime > stafftime) {
//             await this.analiz.create({
//                 superId: this.staff.superId,
//                 staffId: this.staff.id,
//                 changeId: this.staff.Change.id,
//                 name: this.staff.name,
//                 lastname: this.staff.lastname,
//                 middlename: this.staff.middlename,
//                 time: time,
//                 day: today,
//                 month: `${yyyy}-${mm}`,
//                 year: yyyy,
//                 status: 'false'
//             });
//             await this.control(this.staff.id, this.staff.superId);
//         } else {
//             await this.analiz.create({
//                 superId: this.staff.superId,
//                 staffId: this.staff.id,
//                 changeId: this.staff.Change.id,
//                 name: this.staff.name,
//                 lastname: this.staff.lastname,
//                 middlename: this.staff.middlename,
//                 time: time,
//                 day: today,
//                 month: `${yyyy}-${mm}`,
//                 year: yyyy,
//                 status: 'true'
//             });
//         }
//         return;

//         // if (smen === "Tun") {
//         //     if (realtime > stafftime) {
//         //         await this.analiz.create({
//         //             superId: this.staff.superId,
//         //             staffId: this.staff.id,
//         //             changeId: this.staff.Change.id,
//         //             name: this.staff.name,
//         //             lastname: this.staff.lastname,
//         //             middlename: this.staff.middlename,
//         //             time: time,
//         //             day: today,
//         //             month: `${yyyy}-${mm}`,
//         //             year: yyyy,
//         //             status: 'false'
//         //         });
//         //         await this.control(this.staff.id, this.staff.superId);
//         //     } else {
//         //         await this.analiz.create({
//         //             superId: this.staff.superId,
//         //             staffId: this.staff.id,
//         //             changeId: this.staff.Change.id,
//         //             name: this.staff.name,
//         //             lastname: this.staff.lastname,
//         //             middlename: this.staff.middlename,
//         //             time: time,
//         //             day: today,
//         //             month: `${yyyy}-${mm}`,
//         //             year: yyyy,
//         //             status: 'true'
//         //         });
//         //     }
//         //     return;
//         // }
//     }

//     async closeTime (kirish) {
//         const {yyyy, mm, dd, time} = this.dateTime()

//         const startTime = kirish;
//         const endTime = time;

//         const today = new Date();
//         const [startHour, startMinute] = startTime.split(":").map(Number);
//         const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, startMinute);

//         const [endHour, endMinute] = endTime.split(":").map(Number);
//         const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);

//         const diffMs = endDate - startDate;
//         const totalSeconds = Math.floor(diffMs / 1000);
//         const hours = Math.floor(totalSeconds / 3600);
//         const minutes = Math.floor((totalSeconds % 3600) / 60);

//         const jami = hours * 3600;
//         const jami2 = minutes * 60;
//         const jami3 = jami + jami2;

//         const data = await Pay.findOne({ where: { staffId: this.staff.id, date: `${yyyy}-${mm}` }})
//         if (data) {
//             data.all = Number(data.all) + Number(jami3);
//             await data.save();
//         } else {
//             await Pay.create({
//                 superId: this.staff.superId,
//                 staffId: this.staff.id,
//                 all: Number(jami3),
//                 date: `${yyyy}-${mm}`
//             });
//         }
//     }

//     async closeTime2 (kirish) {
//         const {yyyy, mm, dd, time} = this.dateTime()

//         const startTime = kirish;
//         const endTime = time;

//         const today = new Date();
//         const [endHour, endMinute] = endTime.split(":").map(Number);
//         const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);

//         const yesterday = new Date(today);
//         yesterday.setDate(today.getDate() - 1);
//         const [startHour, startMinute] = startTime.split(":").map(Number);
//         const startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), startHour, startMinute);

//         const diffMs = endDate - startDate;
//         const totalSeconds = Math.floor(diffMs / 1000);
//         const hours = Math.floor(totalSeconds / 3600);
//         const minutes = Math.floor((totalSeconds % 3600) / 60);

//         const jami = hours * 3600;
//         const jami2 = minutes * 60;
//         const jami3 = jami + jami2;
            
//         const data = await Pay.findOne({ where: { staffId: this.staff.id, date: `${yyyy}-${mm}` }});
//         if (data) {
//             data.all = Number(data.all) + Number(jami3);
//             await data.save();
//         } else {
//             await Pay.create({
//                 superId: this.staff.superId,
//                 staffId: this.staff.id,
//                 all: Number(jami3),
//                 date: `${yyyy}-${mm}`
//             });
//         }
//     }

//     async update() {
//         const { today, yyyy, mm, dd, time } = this.dateTime();
//         const smen = this.staff.Change.smen;
//         const stafftime2 = this.staff.Change.time2;
//         const [staffsoat, staffminut] = stafftime2.split(":").map(Number);
//         const [realsoat, realminut] = time.split(":").map(Number);
        
//         let stafftugash = staffsoat * 3600 + staffminut * 60;
//         let realtime = realsoat * 3600 + realminut * 60;
//         const workDay = this.staff.date;

//         if (smen === "Kun") {
//             const results = await this.analiz.findOne({ where: { staffId: this.staff.id, day: workDay }});
//             if (results) {
//                 await this.closeTime(results.time);
//                 results.time2 = time;
//                 results.status2 = realtime > stafftugash ? 'true' : 'false';
//                 await results.save();
//                 if (realtime < stafftugash) {
//                     await this.control2(this.staff.id, this.staff.superId);
//                 }
//             }
//             return;
//         }

//         if (smen === "Tun") {
//             const results = await this.analiz.findOne({ where: { staffId: this.staff.id, day: workDay }});
//             if (results) {
//                 await this.closeTime2(results.time);
//                 results.time2 = time;
//                 results.status2 = realtime > stafftugash ? 'true' : 'false';
//                 await results.save();
//                 if (realtime < stafftugash) {
//                     await this.control2(this.staff.id, this.staff.superId);
//                 }
//             }
//             return;
//         }
//         if (smen === "To'liq") {
//             const results = await this.analiz.findOne({ where: { staffId: this.staff.id, day: workDay }});
//             if (results) {
//                 await this.closeFullTime(results.time);
//                 results.time2 = time;
//                 results.status2 = realtime > stafftugash ? 'true' : 'false';
//                 await results.save();
//                 if (realtime < stafftugash) {
//                     await this.control2(this.staff.id, this.staff.superId);
//                 }
//             }
//             return;
//         }
//     }

//     async closeFullTime (kirish) {
//         const {yyyy, mm, dd, time} = this.dateTime()

//         const startTime = kirish;
//         const endTime = time;

//         const today = new Date();
//         const [endHour, endMinute] = endTime.split(":").map(Number);
//         const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);

//         const yesterday = new Date(today);
//         yesterday.setDate(today.getDate() - 1);
//         const [startHour, startMinute] = startTime.split(":").map(Number);
//         const startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), startHour, startMinute);

//         const diffMs = endDate - startDate;
//         const totalSeconds = Math.floor(diffMs / 1000);
//         const hours = Math.floor(totalSeconds / 3600);
//         const minutes = Math.floor((totalSeconds % 3600) / 60);

//         const jami = hours * 3600;
//         const jami2 = minutes * 60;
//         const jami3 = jami + jami2;
            
//         const data = await Pay.findOne({ where: { staffId: this.staff.id, date: `${yyyy}-${mm}` }});
//         if (data) {
//             data.all = Number(data.all) + Number(jami3);
//             await data.save();
//         } else {
//             await Pay.create({
//                 superId: this.staff.superId,
//                 staffId: this.staff.id,
//                 all: Number(jami3),
//                 date: `${yyyy}-${mm}`
//             });
//         }
//     }
// }
// module.exports = HelpControl;

//         // if (smen === "Tun") {
//         //     if (realtime > stafftime) {
//         //         await this.analiz.create({
//         //             superId: this.staff.superId,
//         //             staffId: this.staff.id,
//         //             changeId: this.staff.Change.id,
//         //             name: this.staff.name,
//         //             lastname: this.staff.lastname,
//         //             middlename: this.staff.middlename,
//         //             time: time,
//         //             day: today,
//         //             month: `${yyyy}-${mm}`,
//         //             year: yyyy,
//         //             status: 'false'
//         //         });
//         //         await this.control(this.staff.id, this.staff.superId);
//         //     } else {
//         //         await this.analiz.create({
//         //             superId: this.staff.superId,
//         //             staffId: this.staff.id,
//         //             changeId: this.staff.Change.id,
//         //             name: this.staff.name,
//         //             lastname: this.staff.lastname,
//         //             middlename: this.staff.middlename,
//         //             time: time,
//         //             day: today,
//         //             month: `${yyyy}-${mm}`,
//         //             year: yyyy,
//         //             status: 'true'
//         //         });
//         //     }
//         //     return;
//         // }

const d1 = new Date("2025-09-17T11:59:00");
const d2 = new Date("2025-09-17T23:59:00");

console.log("11:59 →", d1.toTimeString()); 
console.log("23:59 →", d2.toTimeString());
