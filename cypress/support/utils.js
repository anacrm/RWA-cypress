const randomString = () => {
    return Math.random().toString(36).substring(2);
}

const randomNumber = () => {
    return Math.random().toString(10).substring(2);
}

const paymentValue = () => {
    return "5";
}

const toNumber = (stringValue) => {
    return parseFloat(stringValue.substr(1).replace(',', ''))

}

module.exports = {
    toNumber,
    randomString,
    randomNumber,
    paymentValue
};