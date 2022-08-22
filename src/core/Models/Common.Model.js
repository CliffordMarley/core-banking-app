const {pool, Isset, cache} = require('../Config/Database')

RunQuery = (Query)=>{
    return new Promise((resolve, reject)=>{
        pool.getConnection((err, conn)=>{
            conn.query(Query, (err,result)=>{
                conn.release();
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        })
    })
}
module.exports = {
    RunQuery
}
