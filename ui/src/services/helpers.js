import Lodash from 'lodash';

let Helpers = class {
    constructor() {

    }

    cmOptions(options = {}, el) {
        let retOptions = {
            mode: "javascript",
            lineNumbers: true,
            lineWrapping: true,
            extraKeys: {
                "Ctrl-Q": function (cm) {
                    cm.foldCode(cm.getCursor());
                }
            },
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            readOnly: false
        };

        Object.assign(retOptions, options);


        return retOptions;
    }

    lock1Line(el) {
        setTimeout(function () {
            el.editor.refresh();
            el.editor.on("beforeChange", function (cm, change) {
                if (~[0].indexOf(change.from.line)) {
                    change.cancel();
                }
            });
        }, 100)

    }
}


export default new Helpers();