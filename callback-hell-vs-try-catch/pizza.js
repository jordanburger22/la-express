// pizza.js — four steps to make a pizza. Each one takes a second and returns a Promise.
//
// A Promise is a value that shows up later. resolve(x) means "it worked, here's x".
// reject(error) means "it failed".

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function makeDough() {
    return wait(1000).then(() => {
        console.log('1. dough made')
        return 'dough'
    })
}

function addTopping(dough, topping) {
    return wait(1000).then(() => {
        if (topping === 'pineapple') {
            throw new Error('the chef refuses to put pineapple on a pizza')
        }
        console.log(`2. ${topping} added`)
        return `${topping} pizza`
    })
}

function bake(pizza) {
    return wait(1000).then(() => {
        console.log('3. baked')
        return `hot ${pizza}`
    })
}

function deliver(pizza, address) {
    return wait(1000).then(() => {
        console.log(`4. delivered to ${address}`)
        return `${pizza} at ${address}`
    })
}

module.exports = { makeDough, addTopping, bake, deliver }
