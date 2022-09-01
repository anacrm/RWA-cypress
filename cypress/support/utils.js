const randomString = () => {
    return Math.random().toString(36).substring(2);
}

const randomNumber = () => {
    return Math.random().toString(10).substring(2);
}

module.exports = {
    randomString,
    randomNumber
};