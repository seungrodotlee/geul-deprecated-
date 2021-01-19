croquis.loaded(() => {
  (async () => {
    await croquis.attachElement(
      croquis.landing,
      document.body,
      "appear-by-fade"
    );
    await croquis.example.geul("한글을 더 아름답게");
    await croquis.example.reverse("한글을 더 ", 1000);
    await croquis.example.add("한글답게");
  })();

  let last = null;
  let type = "geul";

  let currentColor = croquis.getCookie("colorMode");
  console.log(currentColor);
  if (currentColor != null && currentColor == "dark") {
    document.body.classList.add("dark-mode");
    croquis.colorChanger.textContent = "WhiteMode";
  } else {
    currentColor = "white";
  }

  croquis.colorChanger.addEventListener("click", () => {
    console.log(currentColor);
    if (currentColor == "dark") {
      currentColor = "white";
      croquis.setCookie("colorMode", "white", 7);
      document.body.classList.remove("dark-mode");
      croquis.colorChanger.textContent = "WhiteMode";
    } else if (currentColor == "white") {
      currentColor = "dark";
      croquis.setCookie("colorMode", "dark", 7);
      document.body.classList.add("dark-mode");
      croquis.colorChanger.textContent = "DarkMode";
    }
  });

  croquis.input.addEventListener("keydown", (e) => {
    last = e;

    setTimeout(async () => {
      if (last == e) {
        let val = croquis.input.value;
        let toast = croquis.newToast(`타이핑이 시작됩니다: ${val}`);
        toast.autoCloseAt(4000);

        try {
          //await croquis.result.geul(val);
          await croquis.result[type](val);
        } catch (err) {
          toast.body.parentElement.removeChild(toast.body);
          toast = croquis.newToast(`타이핑에 실패했습니다: ${val}`, "error");
          toast.autoCloseAt(4000);
        }
      }
    }, 500);
  });

  croquis.typeSelector.addSelectEventListener((e, b) => {
    type = b.dataset.title;

    if (type == "add") {
      croquis.input.value = "";
    }
  });

  croquis.startBtn.addEventListener("click", async () => {
    await croquis.removeElement(croquis.landing, "hidden-by-fade");
    croquis.attachElement(croquis.demoArea, document.body, "appear-by-fade");
  });

  croquis.backBtn.addEventListener("click", async () => {
    await croquis.removeElement(croquis.demoArea, "hidden-by-fade");
    croquis.attachElement(croquis.landing, document.body, "appear-by-fade");
  });
});
