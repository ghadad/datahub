
const internals = {}

exports = module.exports = class {
    constructor(collector) {
        __app.logger.info("collector:",collector)
        this.config = collector.config;
        this.handler = collector.handler|| function(data) { console.log("get default handler") ;return data ;}

    }

    getKey(data) {
        if(this.config.pkIndex)
            return Object.values(data)[this.config.pkIndex];
        else if(this.config.pkHeader)    
        return data[this.config.pkHeader];
        else if(this.config.pkHandler)  
            return  this.config.pkHandler(data);
        throw new Error("Failed to get key for csv cdr")         
   }

   async getStream(query,params) {
    let self = this;
    return await __app.dal.queryStream(query,params);
  }

    async collect(flow) {
        let self = this;
        let cdrList = [];
        let ratedUsgaes = [];
        let stream = await self.getStream();
        let kavedAvaz = new Promise((resolve, reject) => {
        stream.on('data', function(data) {
                      cdrList.push(data);
                      if(cdrList.length === 100){
                        stream.pause();
                    //    (await (async () { self.filterDataCdrs(self, stream, cdrList)}()));
                        cdrList = [];
                        stream.resume();
                     }
          });
          stream.on('error', reject);
          stream.on('end', resolve);
        });
        debugger;
        await kavedAvaz;
        debugger;
        __app.logger.info("After filter data usages , length :", cdrList.length)
        return cdrList;    
    }
}