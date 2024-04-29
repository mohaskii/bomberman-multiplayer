export default {

    template : 
    `<div ref = "container" id="gameHeader">
        <menu-header ref= "menuHeader" style = "display :none" ></menu-header>
        <header-ongame ref="ongameHeader"></header-ongame style="display:none">
    </div>`,
    props : {
        tag : `game-header-template`
    },
    methods: {
        activeMenuMode (){
            this.refs.menuHeader.style.display = 'block';
        },
        activeOnGameHeader(){
            this.refs.ongameHeader.style.display = 'block';
        }
    },
}