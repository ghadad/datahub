module.exports = {
    config: {
        name: "",
        enableStaging: null
    },
    collector: {
        config: {
            name: "",
            sourceType: "",
            sourceType: "",
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
            return data;
         }`,
    },
    mapping: {
        config: [],
        handler: `async function(newData,oldData,rawData){ 
                //all good things are exposed 
                // __app.dal
                // __app.logger
                // __app.lodash
                // etc ..              
                return newData;
             }`,
    },
    finalize: {
        config: {},
        handler: `async function(newData,oldData,rawData) { 
                //all good things are exposed 
                // __app.dal
                // __app.logger
                // __app.lodash
                // etc ..
               
                return newData;
             }`,
    }
}