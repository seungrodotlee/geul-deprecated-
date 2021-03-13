import Hangul from "hangul-js";

class Geul {
  constructor(value, element, speed = Geul._speed) {
    this.value = value;
    this.speed = speed;
    this.element = element;
    this.running = false;
    this.forcedStop = false;

    if (!(element instanceof HTMLElement)) {
      let e = Error("Wrong element!");
      throw e;
    }

    if (!("_g" in element)) {
      element._g = this;
    } else if (element._g !== this) {
      let e = Error(
        "Element can't have multiple Geul Instance.\nUse Element.getGeulInstancee instead."
      );

      throw e;
    }

    Geul._instances.push(this);

    this.particles = Hangul.disassemble(this.value);
  }

  setValue(val) {
    if (this.running) {
      let e = Error("Typing is already in progress");
      this.running = false;
      throw e;
    }

    this.value = val;
    this.particles = Hangul.disassemble(this.value);
  }

  getValue() {
    return this.value;
  }

  setSpeed(val) {
    this.speed = val;
  }

  getSpeed() {
    return this.speed;
  }

  getElement() {
    return this.element;
  }

  stop() {
    if (!this.running) return;
    this.forcedStop = true;
  }

  run(delay = 10, value = this.value) {
    if (value === "") {
      console.warn("Value for typing can't be empty string!");
      return false;
    }

    let prom = new Promise((resolve, reject) => {
      if (this.running) {
        let e = Error("Typing is already in progress");
        this.running = false;
        reject(e);
        return;
      }

      if (value != this.value) {
        this.setValue(value);
      }

      this.running = true;

      let typingStack = [];

      setTimeout(() => {
        for (let i in this.particles) {
          (function (d) {
            d++;
            typingStack[i] = setTimeout(() => {
              if (this.forcedStop) {
                this.running = false;
                this.forcedStop = false;

                for (i in typingStack) {
                  clearTimeout(typingStack[i]);
                }

                resolve();
              }

              this.element.textContent = Hangul.assemble(
                this.particles.slice(0, d)
              );

              if (d === this.particles.length) {
                this.running = false;
                resolve(this.element.textContent);
              }
            }, this.speed * d);
          }.bind(this)(parseInt(i)));
        }
      }, delay);
    });

    return prom;
  }

  runFrom(position, delay = 0) {
    if (typeof position === "number") {
      position = this.value.slice(0, position);
    }

    if (Hangul.search(this.value, position) === -1) {
      let e = Error(`Can't start typing from ${position} to ${this.value}`);
      throw e;
    }

    let startIdx = Hangul.disassemble(position).length;

    let prom = new Promise((resolve, reject) => {
      if (this.running) {
        let e = Error("Typing is already in progress");
        this.running = false;
        reject(e);
        return;
      }

      this.running = true;
      let typingStack = [];

      setTimeout(() => {
        for (let i in this.particles) {
          (function (d) {
            d++;
            typingStack[i] = setTimeout(() => {
              if (this.forcedStop) {
                this.running = false;
                this.forcedStop = false;

                for (i in typingStack) {
                  clearTimeout(typingStack[i]);
                }

                resolve();
              }

              this.element.textContent = Hangul.assemble(
                this.particles.slice(0, d)
              );

              if (d === this.particles.length) {
                this.running = false;
                resolve(this.element.textContent);
              }
            }, this.speed * d);
          }.bind(this)(parseInt(i)));
        }
      }, delay);
    });

    return prom;
  }

  add(value, delay = 0) {
    if (value === "") {
      console.warn("Value for typing can't be empty string!");
      return;
    }

    let older = this.value;

    this.setValue(this.value + value);

    return new Promise((resolve, reject) => {
      this.runFrom(older, delay)
        .then((r) => {
          resolve(r);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  reverse(position, delay = 0) {
    if (typeof position === "number") {
      position = this.value.slice(0, position);
    }

    if (Hangul.search(this.value, position) === -1) {
      let e = Error(`Can't reverse from ${this.value} to ${position}`);
      throw e;
    }

    let targetIdx = Hangul.disassemble(position).length;

    let prom = new Promise((resolve, reject) => {
      if (this.running) {
        let e = Error("Typing is already in progress");
        this.running = false;
        reject(e);
        return;
      }

      this.running = true;
      let typingStack = [];

      setTimeout(() => {
        for (let i in this.particles) {
          (function (d) {
            d++;
            typingStack[i] = setTimeout(() => {
              if (this.forcedStop) {
                this.running = false;
                this.forcedStop = false;

                for (i in typingStack) {
                  clearTimeout(typingStack[i]);
                }

                resolve();
              }

              let pos = d;
              this.element.textContent = Hangul.assemble(
                this.particles.slice(0, pos)
              );

              if (d === targetIdx) {
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
    if (g.speed === Geul._speed) {
      g.setSpeed(value);
    }
  });

  Geul._speed = value;
};

HTMLElement.prototype.geul = function (source, delay = 0, speed = Geul._speed) {
  if ("_g" in this) {
    if (source !== undefined) {
      this._g.setValue(source);
    }
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

HTMLElement.prototype.getGeulInstance = function () {
  return this._g;
};

HTMLElement.prototype.stopTyping = function () {
  if (!("_g" in this)) {
    throw Error("Start typing first!");
  } else {
    this._g.stop();
  }
};

window.Hangul = Hangul;
window.Geul = Geul;
