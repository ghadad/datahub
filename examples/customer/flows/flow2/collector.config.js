module.exports = {
	name: "flow-2-query-mariadb-collect",
	sourceType: "sql",
	query: "select * from subscriber where rownum <10",
	pkField: "userId",
	// pk:function(date) { 
	//      return data[3] + data[4];
	// }
	dbAlias: "maria1",
	targetEntity: "Customer",
	targetAlias: "myDb"
}