import Hangul from "hangul-js";
import { resolve } from "path";

class Geul {
  constructor(source, speed = 100, element) {
    this.source = source;
    this.speed = speed;
    this.element = element;
    this.running = false;

    this.particles = Hangul.disassemble(this.source);
  }

  setValue(val) {
    if (this.running) {
      let e = Error("Typing is already in progress");
      console.error(e.stack);
      return;
    }

    this.source = val;
    this.particles = Hangul.disassemble(this.source);
  }

  run(delay = 0) {
    let prom = new Promise((resolve, reject) => {
      if (this.running) {
        let e = Error("Typing is already in progress");
        console.error(e.stack);
        reject(e);
        return;
      }

      this.running = true;

      if (!(this.element instanceof HTMLElement)) {
        reject("wrong element!");
      }
      setTimeout(() => {
        for (let i in this.particles) {
          (function (d) {
            d++;
            setTimeout(() => {
              this.element.textContent = Hangul.assemble(
                this.particles.slice(0, d)
              );

              if (d == this.particles.length) {
                this.running = false;
                resolve(this.source);
              }
            }, this.speed * d);
          }.bind(this)(parseInt(i)));
        }
      }, delay);
    });

    return prom;
  }

  runFrom(position, delay = 0) {
    if (typeof position == "number") {
      position = this.source.slice(0, position);
    }

    let startIdx = Hangul.disassemble(position).length;

    let prom = new Promise((resolve, reject) => {
      if (this.running) {
        let e = Error("Typing is already in progress");
        console.error(e.stack);
        reject(e);
        return;
      }

      this.running = true;

      if (!(this.element instanceof HTMLElement)) {
        reject("wrong element!");
      }
      setTimeout(() => {
        for (let i = startIdx; i < this.particles.length; i++) {
          (function (d) {
            d++;
            setTimeout(() => {
              this.element.textContent = Hangul.assemble(
                this.particles.slice(0, d)
              );

              if (d == this.particles.length) {
                this.running = false;
                resolve(this.source);
              }
            }, this.speed * d);
          }.bind(this)(parseInt(i)));
        }
      }, delay);
    });

    return prom;
  }

  add(value, delay = 0) {
    let older = this.source;

    this.setValue(this.source + value);
    this.runFrom(older, delay);
  }

  reverse(position, delay = 0) {
    if (typeof position == "number") {
      position = this.source.slice(0, position);
    }

    if (this.source.indexOf(position) == -1) {
      let e = Error(`Can't reverse from ${this.source} to ${position}`);
      console.error(e.stack);
      reject(e);
      return;
    }

    let targetIdx = Hangul.disassemble(position).length;

    let prom = new Promise((resolve, reject) => {
      if (this.running) {
        let e = Error("Typing is already in progress");
        console.error(e.stack);
        reject(e);
        return;
      }

      this.running = true;

      if (!(this.element instanceof HTMLElement)) {
        reject("wrong element!");
      }

      setTimeout(() => {
        for (let i = this.particles.length - 1; i >= targetIdx; i--) {
          (function (d) {
            setTimeout(() => {
              let pos = d;
              this.element.textContent = Hangul.assemble(
                this.particles.slice(0, pos)
              );

              if (d == targetIdx) {
                this.running = false;
                this.setValue(Hangul.assemble(this.particles.slice(0, pos)));
                resolve(position);
              }
            }, this.speed * (this.particles.length - d));
          }.bind(this)(parseInt(i)));
        }
      }, delay);
    });

    return prom;
  }
}

HTMLElement.prototype.geul = function (source, delay = 0, speed = 100) {
  if ("_g" in this) {
    this._g.setValue(source);
  } else {
    this._g = new Geul(source, speed, this);
  }

  let p = this._g.run(delay);

  return p;
};

HTMLElement.prototype.reverse = function (
  position,
  delay = 0,
  speed = 100,
  source = this.textContent
) {
  console.log(this.textContent);
  if (!("_g" in this)) {
    this._g = new Geul(source, speed, this);
  }

  let p = this._g.reverse(position, delay);

  return p;
};

HTMLElement.prototype.add = function (value, delay = 0) {
  if (!("_g" in this)) {
    this._g = new Geul(this.textContent, speed, this);
  }

  let p = this._g.add(value, delay);

  return p;
};

window.Geul = Geul;
