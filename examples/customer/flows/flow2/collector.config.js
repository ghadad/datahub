module.exports=  { 
	name:"flow-2-csv-collect",
	sourceType:"sql",
    query:"select * from subscriber where rownum <10",
	pkField:"SUBSCRIBER_NO",
	// pk:function(date) { 
	//      return data[3] + data[4];
	// }
	dbAlias:"oradb",
	target:"Customer",
	targetAlias:"myDb"
}
