module.exports=  { 
	name:"flow-1-csv-collect",
	sourceType:"csv",
        sourceFile:"/tmp/customer.csv",
        pk:"data[2]",
	// pk:function(date) { 
	//      return data[3] + data[4];
	// }
	target:"myDb.Customer",
}
