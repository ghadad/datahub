module.exports = {
	name: "flow-1-csv-collect",
	sourceType: "csv",
	//sourceFile:"/tmp/customer.csv",
	sourceFile: __app.path.resolve(__app.examples, "testData/customer.csv"),
	ignoreFirstLine: false,
	pkIndex: 2,
	//pkHandler:function(date) { 
	//      return data[3] + data[4];
	// }
	//pkHeader:"COMPANY_NAME"
	targetDb: "mydb",
	dbAlias: "maria1",
	targetEntity: "customer"
}