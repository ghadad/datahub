export default { 
 name:"customer",
 properties : [ 
	{
 	 name:"customerId",
         type:"integer"
	} , 
	{ 
	 name:"firstName",
	 type:"string"
        },
 	{
        name:"telephone",
	type:"string"
        },
	{
	name:"contacts",
        type:Ref("contact"),
        rel:"o2m"
        }];
}

