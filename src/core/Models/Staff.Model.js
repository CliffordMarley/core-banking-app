
const {pool, encKey} = require('../Config/Database')

module.exports = class{
 
    //Create staff member object     


    Authenticate = (data)=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                //const SQL = "SELECT * FROM tbl_staff WHERE email_address = ? AND password = AES_ENCRYPT(?, '"+encKey+"')"
                const SQL = "SELECT * FROM tbl_staff WHERE email_address = ? AND password = ? "

                conn.query(SQL, [data.username, data.password], (err, results)=>{
                    conn.release()
                    if(err){
                        reject(err)
                    } else {
                        if(results.length > 0){
                            resolve(results[0])
                        }else{
                            reject({message:"Invalid Username or Password!"})
                        }
                    }
                })
            })
        })
    }
}