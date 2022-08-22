const {pool, encKey} = require('../Config/Database')

module.exports = class{
    Create = ()=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{

            })
        })
    }

    ReadAll = ()=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const SQL = "SELECT * FROM tbl_identification_types WHERE in_use = 1"
                conn.query(SQL, (err, results)=>{
                    conn.release()
                    if (err){
                        reject(err)
                    }else{
                        resolve(results)
                    }
                })
            })
        })
    }

    

}