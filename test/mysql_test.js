var mysql      = require('mysql');
var connection = mysql.createConnection({
  host:      'mysql-mysql.apps.ca-central-1.starter.openshift-online.com',
  database : 'my_db'
});
 
connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
 
connection.end();
