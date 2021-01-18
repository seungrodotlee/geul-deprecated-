import Hangul from "hangul-js";
import { resolve } from "path";

class Geul {
  constructor(value, element, speed = Geul._speed) {
    this.value = value;
    this.speed = speed;
    this.element = element;
    this.running = false;

    if (!("_g" in element) || element._g != this) {
      element._g = this;
    }

    Geul._instances.push(this);

    this.particles = Hangul.disassemble(this.value);
  }

  setValue(val) {
    if (this.running) {
      let e = Error("Typing is already in progress");
      console.error(e.stack);
      return;
    }

    this.value = val;
    this.particles = Hangul.disassemble(this.value);
  }

  setSpeed(val) {
    this.speed = val;
  }

  run(delay = 0, value = this.value) {
    let prom = new Promise((resolve, reject) => {
      if (this.running) {
        let e = Error("Typing is already in progress");
        console.error(e.stack);
        reject(e);
        return;
      }

      if (value != this.value) {
        this.setValue(value);
      }

      this.running = true;

      if (!(this.element instanceof HTMLElement)) {
        let e = Error("Wrong element!");
        console.error(e.stack);
        reject(e);
        return;
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
      position = this.value.slice(0, position);
    }

    if (Hangul.search(this.value, position) == -1) {
      let e = Error(`Can't start typing from ${this.value} to ${position}`);
      console.error(e.stack);
      reject(e);
      return;
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
        let e = Error("Wrong element!");
        console.error(e.stack);
        reject(e);
        return;
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
    let older = this.value;

    this.setValue(this.value + value);
    this.runFrom(older, delay);
  }

  reverse(position, delay = 0) {
    if (typeof position == "number") {
      position = this.value.slice(0, position);
    }

    if (Hangul.search(this.value, position) == -1) {
      let e = Error(`Can't reverse from ${this.value} to ${position}`);
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
        let e = Error("Wrong element!");
        console.error(e.stack);
        reject(e);
        return;
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

Geul._instances = [];

Geul._speed = 100;

Geul.setStaticSpeed = function (value) {
  Geul._instances.forEach((g) => {
    if (g.speed == Geul._speed) {
      g.setSpeed(value);
    }
  });

  Geul._speed = value;
};

console.log(Geul._speed);

HTMLElement.prototype.geul = function (source, delay = 0, speed = Geul._speed) {
  if ("_g" in this) {
    this._g.setValue(source);
  } else {
    this._g = new Geul(source, this, speed);
  }

  let p = this._g.run(delay);

  return p;
};

HTMLElement.prototype.add = function (value, delay = 0, speed = Geul._speed) {
  if (!("_g" in this)) {
    this._g = new Geul(this.textContent, this, speed);
  }

  let p = this._g.add(value, delay);

  return p;
};

HTMLElement.prototype.reverse = function (
  position,
  delay = 0,
  speed = Geul._speed,
  source = this.textContent
) {
  console.log(this.textContent);
  if (!("_g" in this)) {
    this._g = new Geul(source, this, speed);
  }

  let p = this._g.reverse(position, delay);

  return p;
};

HTMLElement.prototype.setTypingValue = function (value) {
  if (!("_g" in this)) {
    this._g = new Geul(value, this, 0);
  } else {
    this._g.setValue(value);
  }
};
HTMLElement.prototype.setTypingSpeed = function (value) {
  if (!("_g" in this)) {
    this._g = new Geul("", this, value);
  } else {
    this._g.setSpeed(value);
  }
};

window.Geul = Geul;
