const internals = {}
exports = module.exports = class {
  constructor(props) {
    this.props = props;
    this.stat = {};
    this.props.forEach(p => {
      this.stat[p] = {
        prop: p,
        min: 9999999999999,
        max: -999999999999,
        avg: 0,
        sum: 0,
        items: 0,
      };
    });
  }

  add(data) {
    this.props.forEach(p => {
      if (data[p] == null || typeof data[p] == "undefined")
        return;
      this.stat[p].items++;
      this.stat[p].sum += data[p];
      this.stat[p].min = data[p] <= this.stat[p].min ? data[p] : this.stat[p].min;
      this.stat[p].max = data[p] >= this.stat[p].max ? data[p] : this.stat[p].max;
    })
  }

  calc() {
    Object.keys(this.stat).forEach(p => {
      this.stat[p].avg = this.stat[p].sum / (this.stat[p].items || 0.001);
    })
  }

  get() {
    return this.stat;
  }

}