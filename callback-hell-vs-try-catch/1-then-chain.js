// 1-then-chain.js — ordering a pizza with .then()
//
// Run it:  node 1-then-chain.js              (pepperoni, works)
//          node 1-then-chain.js pineapple    (step 2 fails)

const { makeDough, addTopping, bake, deliver } = require('./pizza')

const topping = process.argv[2] || 'pepperoni'
const address = '123 Main St'

makeDough()
    .then(dough => {
        return addTopping(dough, topping)
            .then(pizza => {
                return bake(pizza)
                    .then(hotPizza => {
                        return deliver(hotPizza, address)
                            .then(result => {
                                console.log(`Enjoy your ${result}!`)
                            })
                    })
            })
    })
    .catch(error => {
        console.log('Order failed:', error.message)
    })

// Every step needs the answer from the step before, so each .then goes INSIDE the last one.
// Four steps, four levels deep. This is what people call "callback hell".
