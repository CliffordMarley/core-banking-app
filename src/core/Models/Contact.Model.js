const {pool, Isset} = require('../Config/Database')
module.exports = class{

    Create = (data)=>{
        
        return new Promise(async (resolve, reject)=>{
            pool.getConnection(async (err, conn)=>{

                //Check if already exist
                try{
                    let CheckContactsExist = await this.Read(data)
                    if(CheckContactsExist.length > 0){
                        reject({message:"Contact Already exist!"})
                    }else{
                        const SQL = "INSERT INTO tbl_contacts(member_id, contact_type, contact) VALUES(?,?,?)"
                        const Params = [data.member_id, data.contact_type, data.contact]
                        conn.query(SQL, Params, (err, result)=>{
                            conn.release();
                            if(err){
                                reject(err)
                            }else{
                                resolve("Contact Added Successfully!")
                            }
                        })
                    }
                }catch(err){
                    reject(err)
                }
               
                
            })
        })
    }

    Read = (data)=>{
        
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const Query = this.ReadQueryBuilder(data)
                conn.query(Query.SQL, Query.PARAMS, (err, result)=>{
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



    

    ReadQueryBuilder = (data)=>{
        let SQL = "SELECT * FROM tbl_contacts WHERE 1 "
        let PARAMS = []
        if(Isset(data.member_id)){
            SQL += " AND  member_id = ?"
            PARAMS.push(data.member_id)
        }
        if(Isset(data.contact_type)){
            SQL += " AND contact_type = ?"
            PARAMS.push(data.contact_type)
        }
        if(Isset(data.status)){
            SQL += " AND status = ?"
            PARAMS.push(data.status)
        }
        if(Isset(data.contact)){
            SQL += " AND contact = ?"
            PARAMS.push(data.contact)
        }
        
        //console.log(SQL, PARAMS)
        return {SQL, PARAMS}
    }
}