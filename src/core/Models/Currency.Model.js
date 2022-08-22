const {pool, Isset} = require('../Config/Database')

module.exports = class{

    ReadAll = ()=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const SQL = "SELECT * FROM tbl_currencies"
                conn.query(SQL, (err, results)=>{
                    conn.release();
                    if(err){
                        reject(err)
                    }else{
                        resolve(results)
                    }
                })
            })
        })
    }
}