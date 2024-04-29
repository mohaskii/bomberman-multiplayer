import miniFramework from "./miniFramework.js";
import miniFrameworkStates from "./miniFrameworkStates.js";

import utils from "./utils.js";

const newComponent = (obj) => {
  const template = document.createElement("template");

  template.innerHTML = utils.addIdToAttributes(obj.template, obj.props.tag);

  let templateNode = document.importNode(template.content, true);
  // utils.setRefs(templateNode, obj)
  let lolo = 0;

  class component extends HTMLElement {
    static get observedAttributes() {
      return obj.props.observedAttribute ? obj.props.observedAttribute : [];
    }
    get isReady() {
      return this.obj.state.isReady;
    }
    constructor(objArgs = {}) {
      super();
      if (lolo) {
        template.innerHTML = utils.addIdToAttributes(
          obj.template,
          obj.props.tag
        );
        templateNode = document.importNode(template.content, true);
      } else {
        lolo++;
      }

      this.args = objArgs;

      this.nodesAreSet = false;

      this.state = obj.state ? obj.state : {};
      this.router = obj.router ? obj.router : undefined;
      this.keysListeners = [];
      //set custom attributes
      let c = obj.props.customAttributes ? obj.props.customAttributes : [];
      for (let customAttributes of c) {
        this[customAttributes.attribute] = customAttributes.value;
      }

      //retrieve children nodes and  apply shadowDom configs

      utils.initNodes(obj, templateNode, this);

      //set methods
      if (obj.methods) {
        for (let methodName in obj.methods) {
          if (typeof obj.methods[methodName] == "boolean") {
            continue;
          }
          this[methodName] = obj.methods[methodName].bind(this);
        }
      }
      utils.setRefs(this, obj);
      this.refs = obj.refs;
      // set class properties

      let className = obj.props.class ? obj.props.class.join(" ") : "";
      if (obj.props.class) this.classList.add(className);
    }

    //hooks settings

    attributeChangedCallback(property, oldValue, newValue) {
      if (!obj.hooks) {
        return;
      }
      let callback = obj.hooks.attributesObservedOnchange.bind(this);

      callback(oldValue, newValue, property);
    }

    connectedCallback() {
      if (!obj.hooks) {
        return;
      }
      if (obj.hooks.init) {
        let initCallback = obj.hooks.init.bind(this);
        initCallback(this.args);
      }
      if (obj.hooks.onConnected) {
        let callback = obj.hooks.onConnected.bind(this);
        callback();
      }
    }

    disconnectedCallback() {
      this.listeners.forEach((l) => {
        l.element.removeEventListener(l.eventName, l.boundCallback);
      });

      if (!obj.hooks) {
        return;
      }
      if (obj.hooks.onDisconnected) {
        let callback = obj.hooks.onDisconnected.bind(this);
        callback();
      }
    }
  }

  //define the new element on the dom

  customElements.define(obj.props.tag, component);
  (miniFramework.virtualDom.customElementsConstructor[obj.props.tag] =
    window.customElements.get(obj.props.tag)),
    obj.props.tag;
};

export { newComponent };
