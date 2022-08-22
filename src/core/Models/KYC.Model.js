const {pool, encKey} = require('../Config/Database')

module.exports = class{
    Create = (data)=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const SQL = "INSERT INTO tbl_kyc_docs(member_id,doc_type,id_number,document_name, document_issuer,file_type,url, primary_id) VALUES(?,?,?,?,?,?,?,?)"
                const Params = [data.member_id, data.document_type,data.id_number, data.document_name, data.document_issuer,data.Type, data.file_name, data.is_id]

                conn.query(SQL,Params, (err, results)=>{
                    conn.release()
                    if(err){
                        console.log(err)
                        reject(err)
                    }else{
                        resolve('File uploaded successfully!')
                    }
                })
            })
        })
    }

    Read = (member_id)=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const SQL = "SELECT * FROM tbl_kyc_docs WHERE member_id = ?"
                conn.query(SQL,[member_id], (err, results)=>{
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