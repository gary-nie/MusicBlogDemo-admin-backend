const Router = require('koa-router')
const router = new Router()
const callCloudDB = require('../utils/callCloudDB')
const cloudStorage = require('../utils/callCloudStorage')


router.get('/getList',async(ctx , next)=>{
    const params = ctx.request.query
    console.log(params)
    const query = `db.collection('blog')
    .skip(${params.start})
    .limit(${params.count})
    .orderBy("createTime",'desc').get()`

    const res = await callCloudDB(ctx,'databasequery',query)
    // console.log(res)
    // let retData =JSON.parse(
    ctx.body = {
        code:20000,
        data:res.data
    }
})

router.get('/del',async(ctx,next)=>{
    const params = ctx.request.query
    const queryBlog = `db.collection('blog').doc('${params._id}').remove()`
    const dbResBlog = await callCloudDB(ctx,'databasedelete',queryBlog)

    const queryComment = `db.collection('blog-comment').where({
        blogId : '${params._id}'
    }).remove()`
    const dbResComment = await callCloudDB(ctx,'databasedelete',queryComment)

// console.log()
    const storageRes = await cloudStorage.delete(ctx,params['img[]'])

    ctx.body={
        code : 20000,
        data :{
            dbResBlog,
            storageRes,
            dbResComment
        }
    }
})


module.exports = router