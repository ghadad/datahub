import Lodash from 'lodash';

let RouterService = class {
    constructor() {
        this.routes = [];
    }

    add(e) {
        if (Lodash.isArray(e)) {
            e.forEach(c => {
                if (Lodash.isArray(c)) {
                    c.forEach(cc => this.routes.push(cc))
                } else {
                    this.routes.push(c)
                }
            })
        } else {
            this.routes.push(e);
        }

        return this.routes;
    }

    get() {
        return this.routes;
    }


}


export default RouterService;