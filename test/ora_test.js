'use strict';
 
const oracledb = require('oracledb');
 
async function run() {
 let connection;
 
 try {
    connection = await oracledb.getConnection({
     user: process.env.NODE_ORACLEDB_USER || "ADMIN",
     password: process.env.NODE_ORACLEDB_PASSWORD || "Hanoireactor123!",
     connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING || "dbreactor_low"
   });
   let result = await connection.execute("select sysdate from dual");
   console.log(result.rows[0]);
 } catch (err) {
   console.error(err);
 } finally {
   if (connection) {
     try {
    await connection.close();
     } catch (err) {
    console.error(err);
     }
   }
 }
}
 
run();
