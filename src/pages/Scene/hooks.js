function positionCamera (color) {
    if (color === 'white' || color === 'black') {
        return [0, 80, 100]
    } else {
        return [0, 120, 0]
    }
}

export {
    positionCamera
}