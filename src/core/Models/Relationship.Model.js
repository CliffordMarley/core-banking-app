const path = require('path')
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
                const SQL = "SELECT * FROM tbl_relationships ORDER BY relationship_name ASC"
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
    console.log ('Evaluating...');
    let relationshipsCount = await this.ReadAll ();
    console.log ('Found %s records', relationshipsCount.length);
    if (relationshipsCount.length == 0) {
      //Get relationships list from json file in Data/Raw/relationships.json file
      let jsonfile = require (path.join (
        __dirname,
        '../Data/Raw/relationships.json'
      ));

      pool.getConnection ((err, conn) => {
        let SQL = 'INSERT INTO tbl_relationships(relationship_name) VALUES';
        //For every country in the json file, insert it into the database
        for (let i = 0; i < jsonfile.length; i++) {
          if (i == jsonfile.length - 1) {
            SQL += "('" + jsonfile[i].name + "')";
          } else {
            SQL += "('" + jsonfile[i].name + "'), ";
          }
        }
        console.log ('Inserting relationships...');
        conn.query (SQL, (err, results) => {
          conn.release ();
          if (err) {
            console.log (err);
          } else {
            console.log ('Insertion Complete...');
          }
        });
      });
    } else {
      console.log ('relationships already exist!');
    }
  } catch (err) {
    console.log ('Insertion Failed...');
    console.log (err.message);
  }
};

}