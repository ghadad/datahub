module.exports = async function (newData, oldData, raw) {
   //all good things are exposed 
   // __app.dal
   // __app.logger
   // __app.lodash
   // etc ..
   __app.logger.info("in collector handler:", data);
   return data;
}