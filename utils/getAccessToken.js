const rp = require('request-promise')
const APPID = 'wx347e1cc130d56ed0'
const APPSECRET = '0fcbd8579f2ff42a12d1ec79548e36e2'
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
const fs = require('fs')
const path = require('path')
const fileName = path.resolve(__dirname, './access_token.json')

const updataAccessToken = async () => {
    const resStr = await rp(URL)
    const result = JSON.parse(resStr)
    console.log(result)

    if (result.access_token) {
        fs.writeFileSync(fileName, JSON.stringify(
            {
                access_token: result.access_token,
                createTime: new Date()
            }
        ))
    }

}

const getAccessToken = async () => {
    try {
        const readRes = fs.readFileSync(fileName, 'utf8')
        const readObj = JSON.parse(readRes)
        const createTime = new Date(readObj.createTime).getTime()
        const nowTime = new Date().getTime()
        if ((nowTime - createTime) / 1000 / 60 / 60 >= 2) {
            await updataAccessToken()
            await getAccessToken()
        }
        return readObj.access_token
    } catch (error) {
        await updataAccessToken()
        await getAccessToken()
    }

    
}

setInterval(async() => {
    await updataAccessToken()
}, (7200 - 300)*1000);

// updataAccessToken()
module.exports=getAccessToken