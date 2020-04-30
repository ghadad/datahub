 const fs = require("fs");
 const cheerio = require('cheerio')
 const Producer = require("./producer");
 const upath = require("upath");

 exports = module.exports = class {
   constructor(interfaceData) {
     this.config = interfaceData.notifications;
     this.interface = interfaceData;
     this.config.errors.to = (this.config.errors.to || "").trim().replace(/[;,\s]+/, ",")
     this.config.errors.cc = (this.config.errors.cc || "").trim().replace(/[;,\s]+/, ",")
     this.config.errors.bcc = (this.config.errors.bcc || "").trim().replace(/[;,\s]+/, ",")
     this.config.success.to = (this.config.success.to || "").trim().replace(/[;,\s]+/, ",")
     this.config.success.cc = (this.config.success.cc || "").trim().replace(/[;,\s]+/, ",")
     this.config.success.bcc = (this.config.success.bcc || "").trim().replace(/[;,\s]+/, ",")
     this.config.failure.to = (this.config.failure.to || "").trim().replace(/[;,\s]+/, ",")
     this.config.failure.cc = (this.config.failure.cc || "").trim().replace(/[;,\s]+/, ",")
     this.config.failure.bcc = (this.config.failure.bcc || "").trim().replace(/[;,\s]+/, ",")
     this.producer = new Producer({});
     this.successHtmlTempalte = __app.config.successTemplate ? fs.readFileSync(upath.resolve(__app.templatePath, "email", __app.config.successTemplate)) : "";
     this.failureHtmlTempalte = __app.config.failureTemplate ? fs.readFileSync(upath.resolve(__app.templatePath, "email", __app.config.failureTemplate)) : "";
     this.errorsHtmlTempalte = __app.config.errorsTemplate ? fs.readFileSync(upath.resolve(__app.templatePath, "email", __app.config.errorsTemplate)) : "";
   }


   async send(result) {
     let $dom, strResult, subject;
     let mailConfig;
     let attachment;
     if (result.type == "failure") {
       $dom = cheerio.load(this.failureHtmlTempalte);
       mailConfig = this.config.failure;
       attachment = await this.producer.getAttachment("txt", result.error, {
         //   filename: this.interface.interfaceName + ".interface.failure.txt",
         filename: `${this.interface.interfaceName}.interface.${__app.ts("timestamp")}.failure.txt`
       });

     } else if (result.type == "success") {
       $dom = cheerio.load(this.successHtmlTempalte);
       mailConfig = this.config.success;
       attachment = await this.producer.getAttachment("csv", result.rows, {
         filename: `${this.interface.interfaceName}.interface.${__app.ts("timestamp")}.out.csv`
       });

     } else if (result.type == "errors") {
       $dom = cheerio.load(this.errorsHtmlTempalte);
       mailConfig = this.config.errors;
       attachment = await this.producer.getAttachment("csv", result.errors, {
         filename: `${this.interface.interfaceName}.interface.${__app.ts("timestamp")}.eceptions.csv`

       });
     } else {
       __app.logger.warn("Nothing to send !!!");
       return true;
     }

     if (!mailConfig.active) {
       __app.logger.warn("Nothing to send !!!");
       return true;
     }

     mailConfig.engine = mailConfig.engine || "handlebars";

     strResult = this.producer.getResult(mailConfig.engine,
       mailConfig.template, result);

     subject = this.producer.getResult(mailConfig.engine,
       mailConfig.subject || "", result);

     $dom('body').html('<div id="message-body" style="direction:ltr;text-align:left">' + strResult + ' </div>');


     const mailOptions = {
       from: `${__app.config.senderTitle} <${__app.config.senderEmail}>`,
       to: mailConfig.to,
       subject: subject,
       html: $dom.html(),
       attachments: attachment
     };


     try {
       await __app.mailer.sendMail(mailOptions);
     } catch (e) {
       console.error(e)
     }

   }
 }