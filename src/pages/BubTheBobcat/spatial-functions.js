// object x, y coords are always bottom left... add width or height to get other sides
export const doObjectsIntersect = (a, b) => doObjectsIntersectX(a, b) && doObjectsIntersectY(a, b)
export const doObjectsIntersectX = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x
export const doObjectsIntersectY = (a, b) => a.y + a.height > b.y && a.y < b.y + b.height
export const isAAboveB = (a, b) => a.y >= b.y + b.height && doObjectsIntersectX(a, b)

// x|    |x+width
//    x|     |x+width
