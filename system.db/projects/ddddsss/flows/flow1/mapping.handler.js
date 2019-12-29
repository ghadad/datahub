module.exports = async function (data) {
   //all good things are exposed 
   // __app.dal
   // __app.logger
   // __app.lodash
   // etc ..
   __app.logger.info("in mapping handler", data)
   return data;
}