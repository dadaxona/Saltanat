const { Router } = require('express');
const SuperControl = require('../Controllers/SuperControl');
const AdminControl = require('../Controllers/AdminControl');
const DeviceControl = require('../Controllers/DeviceControl');
const ChangeControl = require('../Controllers/ChangeControl');
const StaffControl = require('../Controllers/StaffControl');
const AnalizControl = require('../Controllers/AnalizControl');
const Controls = require('../Controllers/Controls');
const PartControl = require('../Controllers/PartControl');
const DiffrentControl = require('../Controllers/DiffrentControl');
const route2 = Router();

route2.post('/checkking_auth', SuperControl.checkking_auth); // 1
route2.post('/auth', SuperControl.auth_next); // 1
route2.get('/super/get', SuperControl.getSuper); // 1
route2.post('/super/create', SuperControl.createSuper); // 1
route2.put('/super/update/:id', SuperControl.updateSuper); // 1
route2.delete('/super/delete/:id', SuperControl.deleteSuper); // 1

route2.get('/admin/findAll/:id', AdminControl.findAll); // 1
route2.post('/admin/auth', AdminControl.auth_next); // 1
route2.post('/admin/create', AdminControl.createAdmin); // 1
route2.put('/admin/update/:id', AdminControl.updateAdmin); // 1
route2.delete('/admin/delete/:id', AdminControl.deleteAdmin); // 1

route2.get('/device/get/:id', DeviceControl.getDevice); // 1
route2.post('/device/create', DeviceControl.createDevice); // 1
route2.put('/device/update/:id', DeviceControl.updateDevice); // 1
route2.delete('/device/delete/:id', DeviceControl.deleteDevice); // 1

route2.get('/change/get/:id', ChangeControl.getChange); // 1
route2.post('/change/create', ChangeControl.createChange); // 1
route2.put('/change/update/:id', ChangeControl.updateChange); // 1
route2.delete('/change/delete/:id', ChangeControl.deleteChange); // 1

route2.get('/diffrent/get/:id', DiffrentControl.getDiffrent); // 1
route2.post('/diffrent/create', DiffrentControl.createDiffrent); // 1
route2.put('/diffrent/update/:id', DiffrentControl.updateDiffrent); // 1
route2.delete('/diffrent/delete/:id', DiffrentControl.deleteDiffrent); // 1

route2.get('/part/get/:id', PartControl.getPart); // 1
route2.post('/part/create', PartControl.createPart); // 1
route2.put('/part/update/:id', PartControl.updatePart); // 1
route2.delete('/part/delete/:id', PartControl.deletePart); // 1

route2.get('/pay/sort/:id', StaffControl.getSort); // 1
route2.get('/staff/get/:id', StaffControl.getStaff); // 1
route2.get('/staff/export/:id', StaffControl.getExport); // 1
route2.get('/staff/findAll/:id', StaffControl.getfindAll); // 1
route2.put('/staff/otmenka/:id', StaffControl.findOtmenka); // 1
route2.put('/staff/fulTimeStaff/:id', StaffControl.fulTimeStaff); // 1
route2.put('/staff/changeSmen/:id', StaffControl.changeSmen); // 1
route2.put('/staff/otmenkaAll/:id', StaffControl.findOtmenkaAll); // 1
route2.put('/staff/otmenkaAllClear/:id', StaffControl.findOtmenkaAllClear); // 1
route2.post('/staff/create', StaffControl.createStaff); // 1
route2.put('/staff/update/:id', StaffControl.updateStaff); // 1
route2.delete('/staff/delete/:id', StaffControl.deleteStaff); // 1

route2.get('/analiz/count/:id', AnalizControl.getCount); // 1
route2.get('/analiz/get/:id', AnalizControl.getAnaliz); // 1
route2.get('/analiz/getAll/:id', AnalizControl.getAnalizAll); // 1
route2.get('/analiz/getAllExel/:id', AnalizControl.getAllExel); // 1
route2.get('/analiz/findOne/:id', AnalizControl.getfindOne); // 1
route2.get('/analiz/findAllStaff/:id', AnalizControl.findAllStaff); // 1
route2.get('/analiz/findAllStaffNocam/:id', AnalizControl.findAllStaffNocam); // 1
route2.get('/nocam/excelapi/:id', AnalizControl.findAllNocamExel); // 1
route2.get('/analiz/excelapi/:id', AnalizControl.excelapi); // 1
route2.get('/analiz/findOneInfo/:id', AnalizControl.getfindOneInfo); // 1
route2.get('/analiz/findAll/:id', AnalizControl.getfindAll); // 1
route2.post('/analiz/create', AnalizControl.createAnaliz); // 1
route2.put('/analiz/update/:id', AnalizControl.updateAnaliz); // 1
route2.delete('/analiz/delete/:id', AnalizControl.deleteAnaliz); // 1
route2.delete('/nocame/delete/:id', AnalizControl.nocameDelete); // 1

route2.get('/control/get/:id', Controls.getControl); // 1
route2.get('/control/excelapi/:id', Controls.getControlExel); // 1
route2.post('/control/create', Controls.createControl); // 1
route2.put('/control/update/:id', Controls.updateControl); // 1
route2.delete('/control/delete/:id', Controls.deleteControl); // 1

module.exports = route2;