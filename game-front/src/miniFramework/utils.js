const waitUntil = (condition, callback) => {
    const interval = setInterval(() => {

        if (condition()) {
            clearInterval(interval);
            callback()
        }
    }, 100)
}

const initNodes = (obj, templateNode, ctx) => {

    let childNodes = obj.props.nestedElements ? obj.props.nestedElements : []
    addEventListenersFromTemplate(templateNode, obj, ctx,)
    for (let child of childNodes) {

        if (child.all) {
            ctx[child.name] = templateNode.querySelectorAll(child.selector)
            continue
        }
        ctx[child.name] = templateNode.querySelector(child.selector)
    }

    if (obj.shadowDomConfig) {
        ctx.shadow = ctx.attachShadow({ mode: "open" });
        ctx.htmlDirection = document.dir || "ltr";
        ctx.setAttribute("dir", ctx.htmlDirection);
        ctx.shadow.adoptedStyleSheets = obj.shadowDomConfig.shadowDomCssStyle;
        ctx.shadow.append(templateNode);
        return
    }
    // 
    ctx.appendChild(templateNode)
    ctx.nodesAreSet = true

}
const addEventListenersFromTemplate = (tempDiv, obj, ctx) => {


    const allElements = tempDiv.querySelectorAll('*');
    ctx.listeners = []

    allElements.forEach(element => {

        for (let attr of Array.from(element.attributes)) {

            if (!attr.name.startsWith('@')) {
                continue
            }
            const [tmplId, methodName, usGlobalDome] = attr.value.split(".");

            if (tmplId != obj.props.tag) {
                continue
            }
            const eventName = attr.name.substring(1);
            if (usGlobalDome) {
                element = document
            }
            const boundCallback = obj.methods[methodName].bind(ctx)

            element.addEventListener(eventName, boundCallback);
            ctx.listeners.push({ element, eventName, boundCallback })

        }
    });

}
const setRefs = (tempDiv, obj) => {
    const allElements = tempDiv.querySelectorAll('*');

    let refs = {}
    allElements.forEach(element => {

        for (let attr of Array.from(element.attributes)) {
            if (!attr.name.startsWith("ref")) {
                continue
            }
            const [tmplId, elementName] = attr.value.split(".");
            if (tmplId != obj.props.tag) {
                continue
            }
            refs[elementName] = element
        }
    });
    obj.refs = refs;

}


function addIdToAttributes(htmlString, id) {
    // Modèle pour les événements commençant par @
    const eventRegex = /(@\w+[-\w]*\s*=\s*")([^"]*)/g;
    // Modèle pour les attributs ref
    const refRegex = /(ref\s*=\s*")([^"]*)/g;

    // Remplacement des événements
    htmlString = htmlString.replace(eventRegex, `$1${id}.$2`);
    // Remplacement des attributs ref
    htmlString = htmlString.replace(refRegex, `$1${id}.$2`);

    return htmlString;
}


export default {
    setRefs,
    waitUntil,
    initNodes,
    addIdToAttributes
}


