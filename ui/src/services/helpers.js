import Lodash from 'lodash';
import Vue from 'vue';
const VueInstance = new Vue();
let Helpers = class {
    constructor() {

    }

    cmOptions(options = {}, el) {
        let retOptions = {
            mode: "javascript",
            lineNumbers: true,
            lineWrapping: true,
            autoRefresh: true,
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

    refresh(el) {
        setTimeout(function () {
            el.editor.refresh();
        }, 200)
    }
    spin(duration = 2000) {
        const loadingComponent = VueInstance.$buefy.loading.open({});
        setTimeout(() => loadingComponent.close(), duration);
        return loadingComponent;
    }
    toast(options = {}) {
        VueInstance.$buefy.toast.open({
            message: options.message || "OK",
            type: options.type || 'is-success',
            position: options.positions || "is-top-left"
        })

    }
}


export default new Helpers();