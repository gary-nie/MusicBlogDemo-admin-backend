const Router = require('koa-router')
const router = new Router()
// const getAccessToken = require('../utils/getAccessToken.js')
// const rp = require('request-promise')
const callCloudFn = require('../utils/callCloudFn')
const callCloudDB = require('../utils/callCloudDB')

router.get('/list', async (ctx, next) => {
    const query = ctx.request.query

    const res = await callCloudFn(ctx,'music',
        {
            start:parseInt(query.start),
            $url:'playlist',
            count:parseInt(query.count)
        }
    )
    let data=[]
    if(res.resp_data){
        data = JSON.parse(res.resp_data).data
    }
    ctx.body = {
        data,
        code: 20000
    }
})

router.get('/getPlayById',async(ctx,next)=>{
    const params = ctx.request.query
    // console.log(params)
    const query = `db.collection('playlist').doc('${params.id}').get()`
    const res = await callCloudDB(ctx,'databasequery',query)
    // console.log(res)
    ctx.body = {
        code:20000,
        data:JSON.parse(res.data)
    }

})

router.post('/updatePlaylist',async(ctx,next)=>{
    const params = ctx.request.body
    console.log(params)
    const query =`
    db.collection('playlist').doc('${params._id}').update({
        data:{
            name:'${params.name}',
            copywriter:'${params.copywriter}'
        }
    })
    `
    const res = await callCloudDB(ctx,'databaseupdate',query)
    ctx.body = {
        code:20000,
        data:res
    }
})

router.get('/del',async(ctx,next)=>{
    const params = ctx.request.query
    console.log(params)
    const query = `
    db.collection('playlist').doc('${params.id}').remove()
    `
    const res = await callCloudDB(ctx,'databasedelete',query)
    ctx.body = {
        code:20000,
        data:res
    }
})

module.exports = router