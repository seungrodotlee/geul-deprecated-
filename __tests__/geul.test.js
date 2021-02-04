const Geul = require("../geul.js");

let element = document.createElement("div");
let g = new Geul("안녕하세요", element, 10);
document.body.appendChild(element);

beforeEach(() => {
  Geul.setStaticSpeed(100);
  element.textContent = "";
  g.setValue("안녕하세요");
  g.setSpeed(10);
});

describe("Test: Getters and Setters", () => {
  test("getValue: from constructor", () => {
    expect(g.getValue()).toBe("안녕하세요");
  });

  test("getValue: from setValue() method", () => {
    g.setValue("안녕");
    expect(g.getValue()).toBe("안녕");
  });

  test("getSpeed: from constructor", () => {
    expect(g.getSpeed()).toBe(10);
  });

  test("getSpeed: from default", () => {
    let temp = new Geul("안녕", document.createElement("div"));
    expect(temp.getSpeed()).toBe(Geul._speed);
  });

  test("getSpeed: from setSpeed() method", () => {
    g.setSpeed(120);
    expect(g.getSpeed()).toBe(120);
  });

  test("getElement", () => {
    expect(g.getElement()).toBe(element);
  });
});

describe("Test: Typing Methods", () => {
  test("run: without any params", async () => {
    let result = await g.run();
    expect(result).toBe("안녕하세요");
  });

  test("run: with delay", async () => {
    let result = await g.run(100);
    expect(result).toBe("안녕하세요");
  });

  test("run: with new value", async () => {
    let result = await g.run(undefined, "안녕");
    expect(result).toBe("안녕");
  });

  test("runFrom: with num position", async () => {
    let result = await g.runFrom(2);
    expect(result).toBe("안녕하세요");
  });

  test("runFrom: with string position", async () => {
    let result = await g.runFrom("안녕");
    expect(result).toBe("안녕하세요");
  });

  test("add", async () => {
    g.setValue("안녕");
    let result = await g.add("하세요");
    expect(result).toBe("안녕하세요");
  });

  test("reverse: with num position", async () => {
    let result = await g.reverse(2);
    expect(result).toBe("안녕");
  });

  test("reverse: with string position", async () => {
    let result = await g.reverse("안녕");
    expect(result).toBe("안녕");
  });
});

describe("Test: Static Methods", () => {
  test("staticSpeed: default speed created before setStaticSpeed", () => {
    let temp = new Geul("안녕", document.createElement("div"));
    Geul.setStaticSpeed(50);
    expect(temp.getSpeed()).toBe(50);
  });

  test("staticSpeed: default speed created after setStaticSpeed", () => {
    Geul.setStaticSpeed(60);
    let temp = new Geul("안녕", document.createElement("div"));
    expect(temp.getSpeed()).toBe(60);
  });
});

describe("Test: HTMLElement.prototype Methods", () => {
  test("geul: from new instance", async () => {
    let temp = document.createElement("div");
    let result = await temp.geul("안녕", undefined, 10);
    expect(result).toBe("안녕");
  });

  test("geul: from old instance", async () => {
    let result = await element.geul("안녕");
    expect(result).toBe("안녕");
  });

  test("add: from new instance", async () => {
    let temp = document.createElement("div");
    await temp.geul("안녕", undefined, 10);
    let result = await temp.add("하세요");
    expect(result).toBe("안녕하세요");
  });

  test("add: from old instance", async () => {
    await element.geul("안녕");
    let result = await element.add("하세요");
    expect(result).toBe("안녕하세요");
  });

  test("reverse(num position): from new instance", async () => {
    let temp = document.createElement("div");
    await temp.geul("안녕하세요", undefined, 10);
    let result = await temp.reverse(2);
    expect(result).toBe("안녕");
  });

  test("reverse(num position): from old instance", async () => {
    await element.geul("안녕하세요");
    let result = await element.reverse(2);
    expect(result).toBe("안녕");
  });

  test("reverse(string position): from new instance", async () => {
    let temp = document.createElement("div");
    await temp.geul("안녕하세요", undefined, 10);
    let result = await temp.reverse("안녕");
    expect(result).toBe("안녕");
  });

  test("reverse(string position): from old instance", async () => {
    await element.geul("안녕하세요");
    let result = await element.reverse("안녕");
    expect(result).toBe("안녕");
  });

  test("setTypingValue: from new instance", async () => {
    let temp = document.createElement("div");
    temp.setTypingValue("안녕");
    let result = await temp.geul();
    expect(result).toBe("안녕");
  });

  test("setTypingValue: from old instance", async () => {
    element.setTypingValue("안녕");
    let result = await element.geul();
    expect(result).toBe("안녕");
  });

  test("setTypingSpeed: from new instance", async () => {
    let temp = document.createElement("div");
    temp.setTypingSpeed(200);
    expect(temp.getGeulInstance().getSpeed()).toBe(200);
  });

  test("setTypingSpeed: from old instance", async () => {
    element.setTypingSpeed(200);
    expect(element.getGeulInstance().getSpeed()).toBe(200);
  });
});

describe("Test: throw Error", () => {
  test("multiple geul instance", () => {
    expect(() => {
      new Geul("안녕", element);
    }).toThrow(
      "Element can't have multiple Geul Instance.\nUse Element.getGeulInstancee instead."
    );
  });

  test("wrong element", () => {
    expect(() => {
      new Geul("안녕", "div");
    }).toThrow("Wrong element!");
  });

  test("typing in progress: from setValue Method", async () => {
    g.run(0, "안녕하세요");
    expect(() => {
      g.setValue("안녕");
    }).toThrow("Typing is already in progress");
  });

  test("typing in progress: from run Method", async () => {
    g.run(0, "안녕하세요");
    try {
      await g.run(10, "안녕");
    } catch (e) {
      expect(e.message).toBe("Typing is already in progress");
    }
  });

  test("typing in progress: from runFrom Method", async () => {
    g.run(0, "안녕하세요");
    try {
      await g.runFrom("안녕", 10);
    } catch (e) {
      expect(e.message).toBe("Typing is already in progress");
    }
  });

  test("typing in progress: from add Method", async () => {
    g.run(0, "안녕하세요");
    try {
      await g.add("안녕", 10);
    } catch (e) {
      expect(e.message).toBe("Typing is already in progress");
    }
  });

  test("typing in progress: from reverse Method", async () => {
    g.run(0, "안녕하세요");
    try {
      await g.reverse("안녕");
    } catch (e) {
      expect(e.message).toBe("Typing is already in progress");
    }
  });

  test("wrong position: from runFrom Method", async () => {
    await g.run(0, "안녕하세요");
    try {
      await g.runFrom("하이");
    } catch (e) {
      expect(e.message).toBe("Can't start typing from 하이 to 안녕하세요");
    }
  });

  test("wrong position: from reverse Method", async () => {
    await g.run(0, "안녕하세요");
    try {
      await g.reverse("하이");
    } catch (e) {
      expect(e.message).toBe("Can't reverse from 안녕하세요 to 하이");
    }
  });
});
