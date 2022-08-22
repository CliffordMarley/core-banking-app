
const {pool, Isset, cache} = require('../Config/Database')
module.exports = class{

    Create = (data,occupation)=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const SQL = "INSERT INTO tbl_members(member_id, title,firstname, lastname,othernames, gender,dob, nationality,residency,marital_status,branch,employment_status,employer_name, employer_address,employer_phone,designation,net_monthly_income) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
                const Params = [data.member_id,data.title, data.firstname, data.lastname,data.othernames, data.gender, data.dob,data.nationality,data.residency, data.marital_status, data.branch, occupation.employment_status,occupation.employer_name, occupation.employer_address, occupation.employer_phone, occupation.job_title,occupation.net_monthly_income]
                conn.query(SQL, Params, (err, result)=>{
                    conn.release();
                    if(err){
                        reject(err)
                    }else{
                        resolve("New Customer Information File Created Successfully!")
                    }
                })
            })
        })
    }
    Update = (data)=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const queryBuilder = this.UpdateQueryBuilder(data)
                
                conn.query(queryBuilder.SQL, queryBuilder.Params, (err, result)=>{
                    conn.release();
                    if(err){
                        reject(err)
                    }else{
                        resolve(`Member ${data.member_id} updated Successfully!`)
                    }
                })
            })
        })
    }

    GetCount = (branch)=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const SQL = "SELECT COUNT(*) AS count FROM members WHERE branch = ?"
                conn.query(branch, [branch], (err,result)=>{
                    conn.release();
                    if(err){
                        reject(err)
                    }else{
                        resolve(result[0].count)
                    }
                })
            })
        })
    }
    Read = (data)=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const queryBuilder = this.SearchQueryBuilder(data)
                
                conn.query(queryBuilder.SQL, queryBuilder.Params , (err, result)=>{
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

    ReadOne = (member_id)=>{
        console.log(member_id)
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const QueryBuilder = this.SearchQueryBuilder({member_id})
               
                conn.query(QueryBuilder.SQL, QueryBuilder.Params, (err, result)=>{
                    conn.release();
                    if(err){
                        reject(err)
                    }else{
                        if(result.length > 0){
                            resolve(result[0])
                        }else{
                            reject({message:"The provided member_id is invalid!"})
                        }
                    }
                })
            })
        })
    }

    SearchQueryBuilder = (data)=>{
        let SQL = "SELECT m.member_id, m.branch,m.title, m.firstname, m.lastname,m.othernames, m.gender, m.dob,c.country AS nationality, m.nationality AS nationality_id,m.marital_status, m.residency,m.employment_status, m.employer_name, m.employer_phone, m.employer_address, m.designation,m.net_monthly_income, m.status, m.image, DATE_FORMAT(m.created_at, '%Y-%m-%d %H:%i') AS created_at, m.updated_at FROM tbl_members m JOIN tbl_countries c ON c.id = m.nationality WHERE 1 "
        let Params = []
        if(Isset(data.member_id)){
            SQL += " AND m.member_id = ? "
            Params.push(`${data.member_id}`)
        }
        if(Isset(data.firstname)){
            SQL += " AND m.firstname LIKE ? "
            Params.push(`${data.firstname}%`)
        }
        if(Isset(data.lastname)){
            SQL += " AND m.lastname LIKE ? "
            Params.push(`${data.lastname}%`)
        }
        if(Isset(data.customer_name)){
            SQL += " AND (m.lastname LIKE ? OR m.firstname LIKE ? ) "
            Params.push(`${data.customer_name}%`)
            Params.push(`${data.customer_name}%`)
            //Params.push(`%${data.customer_name}%`)
        }
        if(Isset(data.othernames)){
            SQL += " AND m.othernames LIKE ? "
            Params.push(`${data.othernames}%`)
        }
        if(Isset(data.gender)){
            SQL += " AND m.gender = ? "
            Params.push(data.gender)
        }
        if(Isset(data.dob)){
            SQL += " AND m.dob = ? "
            Params.push(data.dob)
        }
        if(Isset(data.status)){
            SQL += " AND m.status = ? "
            Params.push(data.status)
        }
        if(Isset(data.branch)){
            SQL += " AND m.branch = ? "
            Params.push(data.branch)
        }
        if(Isset(data.created_at)){
            SQL += " AND created_at = ? "
            Params.push(new Date(data.created_at))
        }

        return {SQL, Params}
    }

    

    UpdateQueryBuilder = (data)=>{
        let SQL = "UPDATE tbl_members SET updated_at = NOW() "
        let Params = []
        if(Isset(data.firstname)){
            SQL +=  ",firstname = ?"
            Params.push(data.firstname)
        }
        if(Isset(data.lastname)){
            SQL +=  ",lastname = ?"
            Params.push(data.lastname)
        }
        if(Isset(data.othernames)){
            SQL +=  ",othernames = ?"
            Params.push(data.othernames)
        }
        if(Isset(data.gender)){
            SQL +=  ",gender = ?"
            Params.push(data.gender)
        }
        if(Isset(data.dob)){
            SQL += ", dob = ?"
            Params.push(data.dob)
        }
        if(Isset(data.status)){
            SQL += ", status = ?"
            Params.push(data.status)
        }
        SQL += " WHERE member_id = ?"
        Params.push(data.member_id)

        return {SQL, Params}
    }
}

