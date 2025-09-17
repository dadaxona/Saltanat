const axios = require("axios");
const https = require("https");
const xml2js = require("xml2js");
const crypto = require('crypto');
const sharp = require('sharp');
const agent = new https.Agent({ rejectUnauthorized: false });

class Help 
{
    constructor (option) {
        this.option = option;
    }

    basicAuth () {
        const auth = Buffer.from(`${this.option.username}:${this.option.password}`).toString('base64');
        return auth;
    }

    randoms ()
    {
        const random = Math.floor(Math.random() * 100000000);
        return random;
    }

    timeStamp ()
    {
        return Date.now();
    }

    generateIv () {
        return crypto.createHash("md5")
        .update(Date.now().toString())
        .digest("hex");
    }

    async imgSize(buffer) {
        const maxSize = 200 * 1024; // 200 KB
        const width = 480;
        const height = 640;
        let quality = 80;

        // 1. Boshlang'ich konvertatsiya
        let output = await sharp(buffer)
            .rotate() // EXIF orientatsiyani hisobga oladi
            .resize(width, height, { fit: 'inside' }) // o'lchamga sig'diradi
            .toColourspace('srgb') // RGB format
            .jpeg({ quality }) // JPEG format
            .toBuffer();

        // 2. Kichiklashtirish (agar kerak bo'lsa)
        while (output.length > maxSize && quality > 10) {
            quality -= 5;
            output = await sharp(buffer)
                .rotate()
                .resize(width, height, { fit: 'inside' })
                .toColourspace('srgb')
                .jpeg({ quality })
                .toBuffer();
        }

        return output;
    }


    // async imgSize(buffer) {
    //     if (buffer.length <= 200 * 1024) {
    //         return buffer;
    //     }

    //     let quality = 80;
    //     let output = await sharp(buffer)
    //         .jpeg({ quality })
    //         .toBuffer();

    //     while (output.length > 200 * 1024 && quality > 10) {
    //         quality -= 5;
    //         output = await sharp(buffer)
    //         .jpeg({ quality })
    //         .toBuffer();
    //     }
    //     return output;
    // }

    // async imgSize(buffer) {
    //     if (buffer.length <= 200 * 1024) {
    //         return await sharp(buffer)
    //             .resize(480, 640, { fit: 'inside' })
    //             .jpeg({ quality: 80 })
    //             .toBuffer();
    //     }

    //     let quality = 80;
    //     let output = await sharp(buffer)
    //         .resize(480, 640, { fit: 'inside' })
    //         .jpeg({ quality })
    //         .toBuffer();

    //     while (output.length > 200 * 1024 && quality > 10) {
    //         quality -= 5;
    //         output = await sharp(buffer)
    //             .resize(480, 640, { fit: 'inside' })
    //             .jpeg({ quality })
    //             .toBuffer();
    //     }

    //     return output;
    // }

//     async imgSize(buffer) {
//     let quality = 80;

//     let output = await sharp(buffer)
//         .resize(480, 640, { fit: 'inside' })
//         .toColourspace('rgb') // <-- rasmni RGB ga o‘tkazish
//         .jpeg({ quality })
//         .toBuffer();

//     while (output.length > 200 * 1024 && quality > 10) {
//         quality -= 5;
//         output = await sharp(buffer)
//             .resize(480, 640, { fit: 'inside' })
//             .toColourspace('rgb') // <-- yana RGB
//             .jpeg({ quality })
//             .toBuffer();
//     }

//     return output;
// }


    async apiGET (url, auth)
    {
        const res = await axios.get(url, {
            httpsAgent: agent,
            headers: {
                "Content-Type": "application/xml",
                'Authorization': `Basic ${auth}`,
            }
        });
        return res;
    }

    async opentXml (xml)
    {
        const result = await xml2js.parseStringPromise(xml, { explicitArray: false });
        return result;
    }

    hashPassword (salt, challenge, iterations)
    {
        let hash = crypto.createHash('sha256')
        .update(this.option.username + salt + this.option.password)
        .digest('hex');
        hash = crypto.createHash('sha256')
        .update(hash + challenge)
        .digest('hex');
        for (let i = 2; i < iterations; i++) {
        hash = crypto.createHash('sha256')
            .update(hash)
            .digest('hex');
        }
        return hash;
    }

    createXml (hash, sessionID, sessionIDVersion)
    {
        return `<?xml version="1.0" encoding="UTF-8"?>
        <SessionLogin>
        <userName>${this.option.username}</userName>
        <password>${hash}</password>
        <sessionID>${sessionID}</sessionID>
        <isSessionIDValidLongTerm>false</isSessionIDValidLongTerm>
        <sessionIDVersion>${sessionIDVersion}</sessionIDVersion>
        <isNeedSessionTag>true</isNeedSessionTag>
        </SessionLogin>`;
    }
    
    async apiPOST (url, xmlPayload, auth)
    {
        const res = await axios.post(url,
            xmlPayload,
            {
                httpsAgent: agent,
                headers: {
                    'Authorization': `Basic ${auth}`,
                    "Content-Type": "application/xml",
                    "User-Agent": 'Mozilla/5.0',
                    "Host": this.option.ip,
                    "Origin": `https://${this.option.ip}`,
                    "Accept": "*/*"
                }
            }
        );
        return res;
    }

    async apiGETAuth (url, cookie, sessionTag, auth)
    {
        const res = await axios.get(url, {
            httpsAgent: agent,
            headers: {
                'Authorization': `Basic ${auth}`,
                "Cookie": cookie,
                "Sessiontag": sessionTag
            }
        });
        return res;
    }

    async apiPUT (url, auth) {
        const respons = await axios.put(url, null, {
            httpsAgent: agent,
            headers: {
                'Authorization': `Basic ${auth}`,
                'Cookie': this.option.cookie,
                'SessionTag': this.option.sessionTag,
                'Accept': 'application/json, text/plain, */*',
            },
        });
        return respons;
    }

    async getSecurityParams(url, auth) {
        const response = await axios.get(url, {
            httpsAgent: agent,
            headers: {
            'Authorization': `Basic ${auth}`,
            'Cookie': this.option.cookie,
            'Sessiontag': this.option.sessionTag
            }
        });
        return response.data;
    }

    async getUsers (url, auth) {
        const respons = await axios.post(url, {
            UserInfoSearchCond: {
            searchID: "1234567890abcdef",
            maxResults: 20,
            searchResultPosition: 0
            }
        }, {
            httpsAgent: agent,
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Basic ${auth}`,
                'Cookie': this.option.cookie,
                'Sessiontag': this.option.sessionTag,
            }
        });
        return respons;
    }

    async getImage (images, auth) {
        const respons = await axios.get(images, {
            httpsAgent: agent,
            responseType: 'arraybuffer',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'image/*',
                'Cookie': this.option.cookie,
                'Sessiontag': this.option.sessionTag,
            }
        });
        return respons;
    }

    async getFaceIDphoto (url, auth) {
        const xmlPayload = `
            <CaptureFaceDataCond version="2.0" xmlns="http://www.isapi.org/ver20/XMLSchema">
            <captureInfrared>false</captureInfrared>
            <dataType>url</dataType>
            </CaptureFaceDataCond>
        `;
        const respons = await axios.post(url, xmlPayload, {
            httpsAgent: agent,
            responseType: 'arraybuffer',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/xml',
                'Cookie': this.option.cookie,
                'sessiontag': this.option.sessionTag,
                'Accept': 'application/json'
            }
        });
        return respons;
    }

    async registerUser (url, auth, formData) {
        const respons = await axios.post(url, formData, {
            httpsAgent: agent,
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json, text/plain, */*',
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
                'Host': '192.168.1.166',
                'Origin': 'https://192.168.1.166',
                'Cookie': this.option.cookie,
                'Sessiontag': this.option.sessionTag,
            }
        });
        return respons;
    }

    async Uplode_Image (url, auth, formData) {
        const respons = await axios.put(url, formData, {
            httpsAgent: agent,
            maxBodyLength: Infinity, // <-- YANGI
            maxContentLength: Infinity, // <-- YANGI
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json',
                'Cookie': this.option.cookie,
                'Sessiontag': this.option.sessionTag,
                ...formData.getHeaders(),
            }
        });
        return respons;
    }

    async findUserData (url, auth, data) {
        const response = await axios.post(url, data, {
            httpsAgent: agent,
            headers: {
                "Authorization": `Basic ${auth}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Cookie": this.option.cookie,
                "Sessiontag": this.option.sessionTag
            }
        });
        return response;
    }

    async deleteUserDevice (url, auth, data) {
        const response = await axios.put(url, data, {
            httpsAgent: agent,
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Cookie': this.option.cookie,
                'Sessiontag': this.option.sessionTag
            }
        });
        return response;
    }

    async updateUserDevice (url, auth, data) {
        const response = await axios.put(url, data, {
            httpsAgent: agent,
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
                'Cookie': this.option.cookie,
                'Sessiontag': this.option.sessionTag
            }
        });
        return response;
    }
}

module.exports = Help;