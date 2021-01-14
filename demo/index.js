window.addEventListener("load", () => {
  croquis.submit.addEventListener("click", () => {
    let val = croquis.input.value;
    let p = croquis.result.geul(val);

    let toast = croquis.newToast(`타이핑이 시작됩니다: ${val}`);
    toast.autoCloseAt(4000);
    p.then((msg) => {
      console.log(msg);
    });
  });
});
