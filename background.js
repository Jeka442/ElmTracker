chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const oldActiveSpan = document.getElementById("ElmTracker-ActiveSpan");
      if (!oldActiveSpan ? true : false) {
        const activeSpan = document.createElement("span");
        activeSpan.style = `
        position: absolute;
        opacity: 0;
        `;
        activeSpan.id = "ElmTracker-ActiveSpan";
        activeSpan.setAttribute("isActive", "active");
        document.body.appendChild(activeSpan);

        document.body.addEventListener("mousedown", (e) => {
          const isActive = document.getElementById("ElmTracker-ActiveSpan");
          const disableClickFunc = (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
          }
          if (isActive.getAttribute("isActive") == 'active') {
            e.target.addEventListener("click", disableClickFunc, true);
            e.target.addEventListener("mousedown", disableClickFunc, true);
            e.target.addEventListener("focus", disableClickFunc, true);
            console.log(e.target.tagName); // here will be the magic
            setTimeout(() => {
              e.target.removeEventListener("click", disableClickFunc, true);
              e.target.removeEventListener("mousedown", disableClickFunc, true);
              e.target.removeEventListener("focus", disableClickFunc, true);
            }, 100);
          }
        }, true)
        return "active";
      } else {
        const isActivated = oldActiveSpan.getAttribute("isActive") == "active" ? true : false;
        if (isActivated) {
          oldActiveSpan.setAttribute("isActive", "false");
          return "";
        }
        oldActiveSpan.setAttribute("isActive", "active");
        return "active";
      }
    }
  }).then((res) => {
    chrome.action.setBadgeText({ text: res[0].result, tabId: tab.id });
  })
});