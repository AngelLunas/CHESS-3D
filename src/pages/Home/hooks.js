function calculateTopScene (gameData) {
    if (gameData.colorPlayer || gameData.playing || gameData.waitingGame || gameData.createRoom || gameData.roomFriend || gameData.endGame) {
        return 0
    } else {
        return null;
    }
}

export {
    calculateTopScene
}