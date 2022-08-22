const {pool, encKey} = require ('../Config/Database');

module.exports = class {
  Create = data => {
    return new Promise ((resolve, reject) => {
      pool.getConnection ((err, conn) => {
        const SQL =
          'INSERT INTO tbl_next_of_kin(member_id, nok_fullname, nok_phone, nok_physical_address, nok_relationship) VALUES(?,?,?,?,?)';
        const Params = [
          data.member_id,
          data.fullname,
          data.phone_number,
          data.physical_address,
          data.relationship,
        ];
        conn.query (SQL, Params, () => {
          conn.release ();
          if (err) {
            reject (err);
          } else {
            resolve ('Next Of Kin added to CIF!');
          }
        });
      });
    });
  };

  Read = member_id => {
    return new Promise ((resolve, reject) => {
      pool.getConnection ((err, conn) => {
        const SQL = 'SELECT * FROM tbl_next_of_kin WHERE member_id = ?';
        conn.query (SQL, [member_id], (err, results) => {
          conn.release ();
          if (err) {
            reject (err);
          } else {
            resolve (results);
          }
        });
      });
    });
  };


};
