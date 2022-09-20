

const div = document.createElement("span");
div.id = "ElmTracker-follower";
document.body.appendChild(div);
div.style = `position:fixed; background-color:black; color:white; z-index:2147483637; padding-inline:7px`


document.body.addEventListener("mousemove", (e) => {
    const elm = document.getElementById("ElmTracker-ActiveSpan");
    let isVisible = true;
    if (!elm) {
        isVisible = false;
    } else {
        if (elm.getAttribute("isActive") == "active") {
            isVisible = true;
        } else {
            isVisible = false;
        }
    }
    div.style.opacity = isVisible ? 1 : 0;
    if (isVisible) {
        div.innerText = `<${e.target.tagName.toLowerCase()}>`
        let clientW = document.body.clientWidth;
        let offsetFollowerX = (clientW / 2) < e.clientX ? -50 : 20;
        div.style.left = e.clientX + offsetFollowerX + 'px';
        div.style.top = e.clientY + 25 + 'px';
    }
})
