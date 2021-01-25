const Geul = require("../geul.js");

/* Getter & Setter 테스트 */
{
  let tempElement = document.createElement("div");
  let g = new Geul("안녕하세요", tempElement, 80);

  test("getValue: from constructor", () => {
    expect(g.getValue()).toBe("안녕하세요");
  });

  test("getValue: from setValue() method", () => {
    g.setValue("안녕");
    expect(g.getValue()).toBe("안녕");
  });

  test("getSpeed: from constructor", () => {
    expect(g.getSpeed()).toBe(80);
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
    expect(g.getElement()).toBe(tempElement);
  });
}

{
  let tempElement = document.createElement("div");
  let g = new Geul("안녕하세요", tempElement, 80);

  document.body.appendChild(tempElement);

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
    g.setValue("안녕하세요");
    let result = await g.runFrom(2);
    expect(result).toBe("안녕하세요");
  });

  test("runFrom: with string position", async () => {
    let result = await g.runFrom("안녕");
    expect(result).toBe("안녕하세요");
  })
}
