const {pool, Isset, cache} = require('../Config/Database')
module.exports = class{

    Create = (data)=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const SQL = "INSERT INTO tbl_accounts(account_number, account_name, account_type, account_class, default_currency) VALUES(?,?,?,?,?)"
                const Params = [data.account_number, data.account_name, data.account_type, data.account_class, data.default_currency]
                
                conn.query(SQL, Params, (err, result)=>{
                    conn.release()
                    if(err){
                        reject(err)
                    }else{
                        resolve("Account Created Successfully!")
                    }
                })
            })
        })
    }
    Read = (data)=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const queryBuilder = this.SearchQueryBuilder(data)
                console.log(queryBuilder.SQL)
                conn.query(queryBuilder.SQL, data.entity_id , (err, result)=>{
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

    SearchQueryBuilder = (data)=>{
        if(data.client_type == "MEMBER"){
            return "SELECT acc.account_id, acc.account_number,acc.accout_name, coa.account_type_name AS account_type, curr.code AS currency, cls.class_name AS class FROM tbl_accounts acc JOIN tbl_chart_of_accounts coa JOIN ON acc.account_type = coa.account_type JOIN tbl_currencies  curr ON acc.default_currency = curr.id JOIN tbl_classes  cls ON cls.class_id = acc.class JOIN tbl_member_acc_link link ON link.account_number = acc.account_number WHERE  link.member_id = ?"
        }

        if(data.client_type == "GROUP"){
            return "SELECT acc.account_id, acc.account_number,acc.accout_name, coa.account_type_name AS account_type, curr.code AS currency, cls.class_name AS class FROM tbl_accounts acc JOIN tbl_chart_of_accounts coa JOIN ON acc.account_type = coa.account_type JOIN tbl_currencies  curr ON acc.default_currency = curr.id JOIN tbl_classes  cls ON cls.class_id = acc.class JOIN tbl_group_acc_link link ON link.account_number = acc.account_number WHERE  link.group_code = ?"
        }

        if(data.client_type == "ORGNISATION"){
            return "SELECT acc.account_id, acc.account_number,acc.accout_name, coa.account_type_name AS account_type, curr.code AS currency, cls.class_name AS class FROM tbl_accounts acc JOIN tbl_chart_of_accounts coa JOIN ON acc.account_type = coa.account_type JOIN tbl_currencies  curr ON acc.default_currency = curr.id JOIN tbl_classes  cls ON cls.class_id = acc.class JOIN tbl_partner_acc_link link ON link.account_number = acc.account_number WHERE  link.organisation_id = ?"
        }
    }
}