// 2-try-catch.js — the exact same pizza order with async/await and try/catch
//
// Run it:  node 2-try-catch.js              (pepperoni, works)
//          node 2-try-catch.js pineapple    (step 2 fails)

const { makeDough, addTopping, bake, deliver } = require('./pizza')

const topping = process.argv[2] || 'pepperoni'
const address = '123 Main St'

async function orderPizza() {
    try {
        const dough = await makeDough()
        const pizza = await addTopping(dough, topping)
        const hotPizza = await bake(pizza)
        const result = await deliver(hotPizza, address)
        console.log(`Enjoy your ${result}!`)
    } catch (error) {
        console.log('Order failed:', error.message)
    }
}

orderPizza()

// await waits for the Promise and hands back its value, so each step is one line.
// If any step fails, the code jumps straight to catch.
// This is the same try/catch shape as every route in our Express server.
