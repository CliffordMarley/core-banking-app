const {pool, Isset} = require('../Config/Database')
module.exports = class{

    //Insert into unccommitted changes and set default status to AWAITING.APPROVAL
    Create = (data)=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const SQL = "INSERT INTO tbl_uncommitted_changes(created_by,serialized_values, target, action) VALUES(?,?,?,?)"

                const Params = [data.created_by, data.payload, data.target, data.action ]
                
                conn.query(SQL, Params, (err, result)=>{
                    conn.release()
                    if(err){
                        reject(err)
                    }else{
                        resolve("Update posted: Awating Approval!")
                    }
                })
            })
        })
    }

    ReadOne = (change_id)=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const SQL = "SELECT *, DATE_FORMAT(created_at, '%Y-%M-%d %H%i') AS created_at FROM tbl_uncommitted_changes WHERE id = ?"
                conn.query(SQL, [change_id], (err, result)=>{
                    conn.release();
                    if(err){
                        reject(err)
                    }else{
                        if(result.length > 0){
                            resolve(result[0])
                        }else{
                            reject({message:"The provided change_id is invalid!"})
                        }
                    }
                })
            })
        })
    }
    Read = (target)=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const SQL = "SELECT *, DATE_FORMAT(created_at, '%Y-%M-%d %H:%i') AS created_at FROM tbl_uncommitted_changes WHERE target = ?"
                conn.query(SQL, [target], (err, results)=>{
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
    UpdateStatus = (data)=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const SQL = "UPDATE tbl_uncommitted_changes SET checked_by = ?, status = ? WHERE id = ?"

                const Params = [data.checked_by, data.status, data.change_id]
                conn.query(SQL, Params, (err, result)=>{
                    conn.release()
                    if(err){
                        console.log(err)
                        reject(err)
                    }else{
                        resolve("Done!")
                    }
                })
            })
        })
    }

}