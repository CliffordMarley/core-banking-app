
const {pool, Isset} = require('../Config/Database')

module.exports = class{
    Create = (data)=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const SQL = "INSERT INTO tbl_branches(branch_code, branch_name, address_line_1, address_line_2, city, country,contact_phone, contact_email) VALUES(?,?,?,?,?,?,?,?)"

                const Params = [data.branch_code, data.branch_name, data.address_line_1, data.address_line_2, data.city, data.country, data.contact_phone, data.contact_email]

                conn.query(SQL, Params, (err, results)=>{
                    conn.release();
                    if(err){
                        reject(err)
                    }else{
                        resolve('New Branch created successfully!')
                    }
                })
            })
        })
    }

    ReadOne = (branch_code)=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const SQL = "SELECT b.id, b.branch_code, b.branch_name, b.address_line_1, b.address_line_2, b.contact_phone, b.contact_email, c.city_name AS city, b.status, DATE_FORMAT(b.created_at, '%Y-%M-%d') AS created_at FROM tbl_branches b JOIN tbl_cities c ON b.city = c.id WHERE b.branch_code = ?"
                conn.query(SQL, [branch_code], (err, results)=>{
                    conn.release()
                    if(err){
                        reject(err)
                    }else{
                        if(results.length > 0){
                            resolve(results[0])
                        }else{
                            reject({message:"Invalid Branch Code!"})
                        }
                    }
                })
            })
        })
    }

    ReadByStaff = (staff_username)=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const SQL = "SELECT b.id, b.branch_code, b.branch_name, b.address_line_1, b.address_line_2, c.city_name AS city, DATE_FORMAT(b.created_at, '%Y-%M-%d') AS created_at FROM tbl_branches b JOIN tbl_cities c ON b.city = c.id JOIN tbl_staff_branch_assignment sba ON sba.branch_id = b.branch_code JOIN tbl_staff ON tbl_staff.staff_id = sba.staff_id WHERE tbl_staff.email_address = ?"

                console.log(SQL)
                
                conn.query(SQL, [staff_username], (err, results)=>{
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
    ReadAll = ()=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const SQL = "SELECT b.id, b.branch_code, b.branch_name, b.address_line_1, b.address_line_2, b.contact_phone, b.contact_email, b.status, c.city_name AS city, b.status, b.created_at FROM tbl_branches b JOIN tbl_cities c ON b.city = c.id"
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