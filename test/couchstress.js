const nano = require('nano')('http://localhost:5984');
//nano.db.create('stress');
const stress = nano.db.use('stress');
let pMap = require("p-map");

let dt = new Date().toTimeString();
let itters = [];
for(i= 1 ; i<10000;i++) {
    itters.push(i+":"+dt)
}


const test = async function(data) { 

   return await stress.insert({ _id: data, happy: true });    

}

console.time("stress")

const main = async () => {
 	const result = await pMap(itters, test, {concurrency: 5});
    console.log(result.length);
}

main().then(()=>console.timeEnd("stress"));
