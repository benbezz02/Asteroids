generateRandomCoordinatesOnEdge = function (customEdges) {
    // Select a random edge of the square (top, bottom, left, or right)
    const edges = customEdges || ['top', 'bottom', 'left', 'right'];
    const edge = edges[Math.floor(Math.random() * edges.length)];

    // Generate random coordinates on the selected edge
    let x, y;
    switch (edge) {
        case 'top':
            x = (Math.random() * 28.8 - 14.4).toFixed(1);
            y = 6.9;
            break;
        case 'bottom':
            x = (Math.random() * 28.8 - 14.4).toFixed(1);
            y = -6.9;
            break;
        case 'left':
            x = -14.4;
            y = (Math.random() * 13.8 - 6.9).toFixed(1);
            break;
        case 'right':
            x = 14.4;
            y = (Math.random() * 13.8 - 6.9).toFixed(1);
            break;
    }
    x = parseFloat(x)
    y = parseFloat(y)
    return { x, y };
}