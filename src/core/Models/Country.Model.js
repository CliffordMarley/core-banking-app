
const { pool, encKey } = require('../Config/Database')
const path = require('path')

module.exports = class {
    constructor() { 
        
    }

    Create = ()=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{

            })
        })
    }

    ReadAll = ()=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                const SQL = "SELECT * FROM tbl_countries ORDER BY country ASC"
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

    Seed = async () => { 
         
                try {
                        console.log('Evaluating...')
                    let countriesCount = await this.ReadAll()
                    console.log("Found %s records",countriesCount.length)
                        if (countriesCount.length == 0) { 
                            //Get countries list from json file in Data/Raw/countries.json file
                        let jsonfile = require(path.join(__dirname, '../Data/Raw/countries.json'))
                          
                         pool.getConnection((err, conn) => {
                            let SQL = "INSERT INTO tbl_countries(country) VALUES"
                            //For every country in the json file, insert it into the database
                            for (let i = 0; i < jsonfile.length; i++) {
                                if (i == jsonfile.length - 1) {
                                    SQL += "('" + jsonfile[i].country + "')"
                                } else {
                                    SQL += "('" + jsonfile[i].country + "'), "
                                }
                            }
                            console.log('Inserting countries...')
                            conn.query(SQL, (err, results) => {
                                conn.release()
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log('Insertion Complete...')
                                }
                            })
                        })
                        } else {
                            console.log('Countries already exist!')
                    }
                } catch (err) { 
                    console.log('Insertion Failed...')
                    console.log(err.message)
                }
    }


}