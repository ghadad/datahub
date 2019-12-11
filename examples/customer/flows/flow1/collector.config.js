module.exports=  { 
	name:"flow-1-csv-collect",
	sourceType:"csv",
	//sourceFile:"/tmp/customer.csv",
	sourceFile:"./customer.csv",
	pkIndex:2,
	//pkHandler:function(date) { 
	//      return data[3] + data[4];
	// }
	//pkHeader:"COMPANY_NAME"
	targetDb:"mydb",
	targetEntity:"customer"
}
