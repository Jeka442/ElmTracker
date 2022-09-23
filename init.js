const ElmId = {
    overLayer: "ElmTracker-elementViewContainer",
    containerView: "ElmTracker-elementView",
    activeSpan: "ElmTracker-ActiveSpan",
    follower: "ElmTracker-follower"
}

const ElmClasses = {
    removeAttr: "ElmTracler-removeAttr-btn"
}

const ElmAttrs = {
    dataFor: "data-for",
    removeState: "remove-state"
}

const activeSpan = document.createElement("span");
activeSpan.style = `
        position: absolute;
        opacity: 0;
        `;
activeSpan.id = ElmId.activeSpan;
activeSpan.setAttribute("isActive", "active");
document.body.appendChild(activeSpan);

document.body.addEventListener("mousedown", (e) => {
    const isActive = document.getElementById(ElmId.activeSpan);
    const disableClickFunc = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
    }
    if (isActive.getAttribute("isActive") == 'active') {
        e.target.addEventListener("click", disableClickFunc, true);
        e.target.addEventListener("mousedown", disableClickFunc, true);
        e.target.addEventListener("focus", disableClickFunc, true);
        genView(e.target); // View generator
        isActive.setAttribute("isActive", "progress");
        document.getElementById(ElmId.follower).style.opacity = 0;
        setTimeout(() => {
            e.target.removeEventListener("click", disableClickFunc, true);
            e.target.removeEventListener("mousedown", disableClickFunc, true);
            e.target.removeEventListener("focus", disableClickFunc, true);
        }, 100);
    }
}, true);





const genView = (elm) => {
    // overlayer
    const elementViewContainer = document.createElement("div");
    elementViewContainer.style = `
    position:fixed;
    width:100vw;
    height:100vh;
    top:0px;
    left:0px;
    z-index: 2147483635;
    background-color: rgba(0, 0, 0, 0.2);
`;
    elementViewContainer.id = ElmId.overLayer;

    // element view
    const elementView = document.createElement("div");
    elementView.style = `
    position: absolute;
    top:50%;
    left:50%;
    translate: -50% -50%;
    background-color: #fff;
    border-radius: 12px;
    padding-bottom:20px;
    padding-inline: 40px;
    display:flex;
    flex-direction: column;
    align-items: center;
    direction: ltr;
    gap: 5px;
    width:90vw;
    max-width:700px;
`;
    elementView.id = ElmId.containerView;
    const tagName = elm.tagName.toLowerCase();
    const attributes = elm.getAttributeNames();
    let html = `<h2>${tagName + (elm.id != "" ? `#${elm.id}` : "")}</h2>`;
    for (let attr of attributes) {
        html += `
            <div style="width:100%; display:grid; grid-template-columns: 100px auto 70px; gap:10px; margin-bottom:5px;">
                <b>${attr}:</b> 
                <input data-for="${attr}" style="border:1px solid black; border-radius: 6px; width:100%; flex-grow: 1;" value="${elm.getAttribute(attr)}"/>
                <button data-for="${attr}" class="${ElmClasses.removeAttr}">Remove</button>
            </div>
        `
    }
    elementView.innerHTML = html;
    const btnStyle = `
        border:0px; 
        border-radius:6px; 
        padding: 5px 10px;
        cursor: pointer;
    `;


    const saveBtn = document.createElement("button");
    saveBtn.style = btnStyle;
    saveBtn.innerText = "Save";
    saveBtn.addEventListener("click", () => {
        const inputs = elementView.getElementsByTagName("input");
        for (let input of inputs) {
            let attrName = input.getAttribute(ElmAttrs.dataFor);
            let shouldRemove = input.getAttribute(ElmAttrs.removeState);
            if (shouldRemove) {
                //for default attributes that we cant remove
                elm.setAttribute(attrName, null);
                elm.removeAttribute(attrName);
            } else {
                elm.setAttribute(attrName, input.value);
            }
            removeLayout();
        }

    });

    const hideBtn = document.createElement("button");
    hideBtn.style = btnStyle;
    hideBtn.innerText = "Hide";
    hideBtn.addEventListener("click", () => { elm.style.visibility = 'hidden'; removeLayout() });

    const RemoveBtn = document.createElement("button");
    RemoveBtn.style = btnStyle;
    RemoveBtn.innerText = "Remove";
    RemoveBtn.addEventListener("click", () => { elm.remove(); removeLayout(); });

    const buttonsContainer = document.createElement("div");
    buttonsContainer.style = `
        width:100%;
        display:flex;
        justify-content: center;
        column-gap: 20px;
        margin-top:20px;
    `;
    buttonsContainer.appendChild(saveBtn);
    buttonsContainer.appendChild(hideBtn);
    buttonsContainer.appendChild(RemoveBtn);

    elementView.appendChild(buttonsContainer);

    const closeBtn = document.createElement("span");
    closeBtn.style = `
        position:absolute;
        top:10px;
        left:10px;
        width:30px;
        height:30px;
        cursor:pointer;
        border-radius:50%;
        background-color: rgb(169 169 169);
        display:flex;
        justify-content:center;
        align-items:center;
        font-weight:600;
        font-size: 20px;
    `;
    closeBtn.innerHTML = `&#10006;`;
    closeBtn.addEventListener("click", () => {
        removeLayout();
    })

    elementView.appendChild(genElmTree(elm));

    elementView.appendChild(closeBtn);
    elementViewContainer.appendChild(elementView);
    document.body.append(elementViewContainer);

    document.querySelectorAll(`button.${ElmClasses.removeAttr}`).forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const inp = e.target.previousElementSibling;
            const state = inp.getAttribute(ElmAttrs.removeState);
            if (state) {
                inp.removeAttribute(ElmAttrs.removeState);
                inp.disabled = false;
                e.target.innerText = "Delete";
            } else {
                inp.setAttribute(ElmAttrs.removeState, "true");
                inp.disabled = true;
                e.target.innerText = "Restore";
            }
        })
    });
}


const removeLayout = () => {
    const elementViewContainer = document.getElementById(ElmId.overLayer);
    document.getElementById(ElmId.activeSpan).setAttribute("isActive", "active");
    document.getElementById(ElmId.follower).style.opacity = 1;
    if (elementViewContainer) elementViewContainer.remove();
}


const genElmTree = (elm) => {
    const elmTree = [];
    let parent = elm;
    while (parent.nodeName != "HTML") {
        elmTree.push(parent);
        parent = parent.parentElement;
    }
    const container = document.createElement("div");
    container.style = `
        max-width: 700px;
    `;
    const tree = document.createElement("div");
    tree.style = `
    display:flex;
    flex-direction: row;
    justify-content: center;
    column-gap: 15px;
    flex-wrap: wrap;
    `;

    const treeHeader = document.createElement("h2");
    treeHeader.style = `
        padding:10px;
        margin:0px;
        width:100%;
        text-align:center;
    `;
    treeHeader.innerText = "Elements tree"
    container.appendChild(treeHeader);
    elmTree.reverse().map((elm, index) => {
        let span = document.createElement("span");
        span.innerText = elm.nodeName.toLowerCase() + (elm.id != "" ? `#${elm.id}` : "");
        span.style = `
            cursor:pointer;
            font-weight:${index == elmTree.length - 1 ? 700 : 400};
        `;
        span.addEventListener("click", () => {
            const elementViewContainer = document.getElementById(ElmId.overLayer);
            elementViewContainer.remove();
            genView(elm);
        })
        var border;
        span.addEventListener("mouseenter", () => {
            border = elm.style.border;
            elm.style.border = "4px dotted red";
        })
        span.addEventListener("mouseleave", () => {
            elm.style.border = border ? border : "initial";
        })
        tree.appendChild(span);
    });
    container.append(tree);
    return container;
}