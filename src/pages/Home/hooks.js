function calculateTopScene (gameData) {
    if ((gameData.waitingGame && gameData.createRoom === false && gameData.roomFriend === false) || gameData.endGame || gameData.createRoom || gameData.playing) {
        return 0
    } else {
        return null;
    }
}

export {
    calculateTopScene
}