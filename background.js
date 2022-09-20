// Detect click on icon
chrome.action.onClicked.addListener(({ id }) => {
  chrome.scripting.executeScript({
    target: { tabId: id },
    func: () => {
      const elm = document.getElementById("ElmTracker-ActiveSpan");
      if (!elm) return "first";
      let activeState = elm.getAttribute("isActive");
      if (activeState == "active" || activeState == "progress") {
        elm.setAttribute("isActive", "false");
        return "de-active";
      } else {
        elm.setAttribute("isActive", "active");
        return "active";
      }
    }
  }).then((res) => {
    switch (res[0].result) {
      case "first":
        chrome.action.setBadgeText({ tabId: id, text: "active" });
        chrome.scripting.executeScript({ target: { tabId: id }, files: ["init.js"] });
        break;
      case "active":
        chrome.action.setBadgeText({ tabId: id, text: "active" });
        break;
      case "de-active":
        chrome.action.setBadgeText({ tabId: id, text: "" });
        chrome.scripting.executeScript({
          target: { tabId: id },
          func: () => {
            const layout = document.getElementById("ElmTracker-elementViewContainer");
            if (layout) layout.remove();
          }
        })
        break;

    }
  })
})