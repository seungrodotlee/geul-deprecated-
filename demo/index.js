window.addEventListener("load", () => {
  let input = document.querySelector("#input");
  let submit = document.querySelector("#submit");
  let resultLabel = document.querySelector("#result");
  window.resultLabel = resultLabel;
  window.g = new Geul("안녕하세요");

  submit.addEventListener("click", () => {
    let val = input.value;
    console.log(val);
    let p = resultLabel.geul(val);

    p.then((msg) => {
      console.log(msg);
    });
  });
});
