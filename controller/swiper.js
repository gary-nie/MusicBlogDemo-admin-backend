const Router = require('koa-router')
const router = new Router()
const callCloudDB = require('../utils/callCloudDB')
const cloudStorage = require('../utils/callCloudStorage.js')

router.get('/getList',async(ctx,next)=>{
    const query = `db.collection('swiper').get()`

    const res = await callCloudDB(ctx,'databasequery',query)
    // console.log(res)
    let data = res.data
    const file_list = []
    for(let i=0 ,len=data.length;i<len;i++){
        file_list.push({
            fileid:JSON.parse(data[i]).fileId,
            max_age:7200
        })
    }
    const dlRes = await cloudStorage.download(ctx,file_list)
    // console.log(dlRes)

    let returnRes = []
    for (let i=0,len=dlRes.file_list.length ; i<len ; i++){
        // console.log(dlRes.file_list)
        returnRes.push({
            fileId:dlRes.file_list[i].fileid,
            download_url:dlRes.file_list[i].download_url,
            _id:JSON.parse(data[i])._id
        })
    }

    ctx.body = {
        code : 20000,
        data : returnRes
    }
})

router.post('/upload',async(ctx,next)=>{
    console.log('res')
    const fileid =  await cloudStorage.upload(ctx)
    console.log(fileid)

    const query = `
    db.collection('swiper').add({
        data:{
            fileId:'${fileid}'
        }
    })
    `
    const res = await callCloudDB(ctx,'databaseadd',query)
    ctx.body = {
        code : 20000,
        data : res.id_list
    }

})

router.get('/del',async(ctx,next)=>{
    const params = ctx.request.query
    const query =`db.collection('swiper').doc('${params._id}').remove()`
    const delDBRes = await callCloudDB(ctx,'databasedelete',query)
    // console.log(params.fileId)
    // let delId = []
    // delId.push(params.fileId)

    const delStorage = await cloudStorage.delete(ctx,params.fileId)

    ctx.body = {
        code: 20000,
        data: {
            delDBRes,
            delStorage
        }
    }

})


module.exports = router