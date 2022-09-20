

const div = document.createElement("span");
div.id = "ElmTracker-follower";
document.body.appendChild(div);
div.style = `position:fixed; background-color:black; color:white; z-index:2147483637; padding-inline:7px`


document.body.addEventListener("mousemove", (e) => {
    const elm = document.getElementById("ElmTracker-ActiveSpan");
    if (!elm) {
        div.style.opacity = 0;
    } else {
        if (elm.getAttribute("isActive") == "active") {
            div.style.opacity = 1;
        } else {
            div.style.opacity = 0;
        }
    }
    div.innerText = `<${e.target.tagName.toLowerCase()}>`
    let clientW = document.body.clientWidth;
    let offsetFollowerX = (clientW / 2) < e.clientX ? -50 : 20;
    div.style.left = e.clientX + offsetFollowerX + 'px';
    div.style.top = e.clientY + 25 + 'px';
})
