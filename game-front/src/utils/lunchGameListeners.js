export default ()=>{
    document.addEventListener('keydown', (event) => {
        if ((event.key === "Escape" || event.key === "Esc") && OnGame.val) {
            pauseHandler();
        }
        if (event.key === 'ArrowLeft') {
            keyState.ArrowLeft = true;
        }
        if (event.key === 'ArrowRight') {
            keyState.ArrowRight = true;
        }
        if (event.key === 'ArrowUp') {
            keyState.ArrowUp = true;
        }
        if (event.key === 'ArrowDown') {
            keyState.ArrowDown = true;
        }
        if (!updateInterval) {
            updateInterval = setInterval(updatePaddle, 7);
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowLeft') {
            keyState.ArrowLeft = false;
        }
        if (event.key === 'ArrowRight') {
            keyState.ArrowRight = false;
        }
        if (event.key === 'ArrowUp') {
            keyState.ArrowUp = false;
        }
        if (event.key === 'ArrowDown') {
            keyState.ArrowDown = false;
        }
        if (!keyState.ArrowLeft && !keyState.ArrowRight && !keyState.ArrowUp && !keyState.ArrowDown) {
            clearInterval(updateInterval);
            updateInterval = null;
        }
    });
}