import Hangul from "hangul-js";
import { resolve } from "path";

class Geul {
  constructor(source, speed = 100, delay = 0, element) {
    console.log(arguments);
    this.source = source;
    this.speed = speed;
    this.delay = delay;
    this.element = element;

    this.particles = Hangul.disassemble(this.source);
  }

  setValue(val) {
    this.source = val;
    this.particles = Hangul.disassemble(this.source);
  }

  run(speed = this.speed, element = this.element, delay = this.delay) {
    this.element = element;

    let prom = new Promise((resolve, reject) => {
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
                resolve(this.source);
              }
            }, speed * d);
          }.bind(this)(parseInt(i)));
        }
      }, delay);
    });

    return prom;
  }

  reverse(
    position,
    speed = this.speed,
    delay = this.delay,
    element = this.element
  ) {
    this.element = element;

    if (typeof position == "number") {
      position = this.source.slice(0, position);
    }

    let targetIdx = Hangul.disassemble(position).length;

    let prom = new Promise((resolve, reject) => {
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
                resolve(position);
                this.setValue(Hangul.assemble(this.particles.slice(0, pos)));
              }
            }, speed * (this.particles.length - d));
          }.bind(this)(parseInt(i)));
        }
      }, delay);
    });

    return prom;
  }
}

HTMLElement.prototype.geul = function (source, speed = 100, delay = 0) {
  this._g = new Geul(source, speed, delay, this);
  let p = this._g.run();

  return p;
};

HTMLElement.prototype.reverse = function (
  position,
  speed = 100,
  delay = 0,
  source
) {
  console.log(this.textContent);
  if (!("_g" in this)) {
    this._g = new Geul(this.textContent, speed, delay, this);
  }

  let p = this._g.reverse(position);

  return p;
};

window.Geul = Geul;
