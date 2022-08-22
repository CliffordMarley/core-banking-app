const {pool, encKey} = require('../Config/Database')

module.exports = class{
    Create = (data)=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const SQL = "INSERT INTO tbl_chart_of_accounts(account_type, account_type_name, description, class_group,parent) VALUES(?,?,?,?,?)"
                const Params = [data.account_type, data.account_type_name, data.description, data.class_group, data.parent]
                conn.query(SQL, Params, (err, results)=>{
                    conn.release()
                    if(err){
                        reject(err)
                    }else{
                        resolve('New account type created!')
                    }
                })
            })
        })
    }

    ReadAll = ()=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const SQL = "SELECT * FROM tbl_chart_of_accounts"
                conn.query(SQL, (err, results)=>{
                    conn.release()
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