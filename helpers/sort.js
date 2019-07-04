/* istanbul ignore file */
const sortScore = arr => {
    arr.sort((a,b) => {
        if(a.score.total > b.score.total) {
            return -1
        }
        else if(a.score.total < b.score.total) {
            return 1
        }
        else return 0
    })

    return arr
}

module.exports = sortScore
