const express = require('express');
const cors = require('cors');
const path = require("path");
const multer = require('multer');
const app = express();
const route  = require('./App/Routes/route');
const { verifyToken } = require('./App/Middleware/Auth');
const SuperControl = require('./App/Controllers/SuperControl');
const route2 = require('./App/Routes/route2');
const AdminControl = require('./App/Controllers/AdminControl');
const AnalizControl = require('./App/Controllers/AnalizControl');
const cron = require("node-cron");
const Controls = require('./App/Controllers/Controls');
const upload = multer();

// Har kuni 23:00 da ishlaydi
cron.schedule("0 23 * * *", () => {
    const todayData = new Date();
    const today = todayData.toISOString().split('T')[0];
    Controls.filterStaff(today, 'Tun')
}, {
  scheduled: true,
  timezone: "Asia/Tashkent"
});

// Har kuni 11:00 da ishlaydi
cron.schedule("0 13 * * *", () => {
    const todayData = new Date();
    const today = todayData.toISOString().split('T')[0];
    Controls.filterStaff(today, 'Kun')
}, {
  scheduled: true,
  timezone: "Asia/Tashkent"
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/login', SuperControl.auth);
app.post('/admin/login', AdminControl.auth);
app.use("/images", express.static(path.join(__dirname, "uploads")));

app.post('/event', upload.any(), AnalizControl.Event);
app.post('/event2', upload.any(), AnalizControl.Event2);

app.use(route);
app.use(verifyToken)
app.use(route2)

const PORT = process.env.PORT || 8008;
// const HOST = "192.0.0.100";

app.listen(PORT);

// npx sequelize-cli model:generate --name Admin --attributes login:string,password:string,startus:string
// npx sequelize-cli db:migrate
// npx sequelize-cli db:migrate:undo:all