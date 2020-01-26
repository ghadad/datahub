module.exports = {
    config:{
        name:"",
        enableStaging:null
    },
    collector: {
        config: {
            name: "",
            sourceType: "",
            sourceType:"",
            targetDb: "",
            dbAlias: "",
            targetEntity: ""
        },
        handler: `async function(data) { 
            //all good things are exposed 
            // __app.dal
            // __app.logger
            // __app.lodash
            // etc ..
            __app.logger.info("in collector handler:",data);
            return data;
         }`,
        mapping: {
            config: [],
            handler: `async function(data) { 
                //all good things are exposed 
                // __app.dal
                // __app.logger
                // __app.lodash
                // etc ..
                __app.logger.info("in collector handler:",data);
                return data;
             }`,
        },
        discover: {
            config: {},
            handler: `async function(data) { 
                //all good things are exposed 
                // __app.dal
                // __app.logger
                // __app.lodash
                // etc ..
                __app.logger.info("in collector handler:",data);
                return data;
             }`,
        }
    },

}