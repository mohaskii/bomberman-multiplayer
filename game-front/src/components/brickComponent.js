export default {
    template: `
    <img ref = "brick" class = "brick" src="" alt="">
    `,
    props: {
        tag: 'bricks-img',
    },
    hooks: {
        init(objArg) {

            let x = objArg.coords.x
            let y = objArg.coords.y
            
            this.x = x 
            this.y = y
            
            let brickElement = this.refs.brick

            brickElement.src = objArg.src

            brickElement.style.top = `${y * 5}%`
            brickElement.style.left = `${x * 5}%`
        }
    }

}
// document.getElementById().style.top