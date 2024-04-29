import { virtualDom } from "./vDomConstructor.js";
import { newComponent } from "./componentModel.js";
import all from "../components/all.js";



export default {
    components: all,
    virtualDom,
    newComponent,
    componentsReady: false,
    run() {
        for (let component of this.components) {
            newComponent(component)
        }
        this.componentsReady = true;
        const appTag = all.find((element) => element.props.app === true).props.tag
        const AppElement = window.customElements.get(appTag)
        document.body.appendChild(new AppElement())

    }
}
