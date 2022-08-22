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
                let SQL = "SELECT *, privilege_title As menu_name FROM tbl_menus WHERE parent = 0 ORDER BY sort_order ASC "
                conn.query(SQL, (err, results)=>{
                    //conn.release()
                    if(err){
                        reject(err)
                    }else{
                        let parents = results
                        for (let i = 0; i < results.length; i++) {
                            SQL = "SELECT *, privilege_title AS menu_name FROM tbl_menus WHERE parent = ? ORDER BY sort_order ASC "
                            conn.query(SQL, parents[i].id, (err, results)=>{
                                parents[i].children = err ? [] : results
                                if(i == (parents.length - 1 )){
                                    conn.release()
                                     resolve(parents)
                                }
                            })
                        }
                    }
                })
            })
        })
    }

    

}