module.exports = async function (data, r, p) {
   //all good things are exposed 
   // __app.dal
   // __app.logger
   // __app.lodash
   // etc ..
   __app.logger.info("in discovery  handler:", data);
   return data;
}