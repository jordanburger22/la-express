# .then() chains vs try/catch

One pizza order, written two ways. The four steps are in `pizza.js`: make dough, add a topping,
bake, deliver. Each one takes a second. Each step needs the result of the one before it.

## Run it

No `npm install`. There are no dependencies.

```bash
node 1-then-chain.js             # works
node 2-try-catch.js              # same output

node 1-then-chain.js pineapple   # the chef refuses, so step 2 fails
node 2-try-catch.js pineapple    # same error
```

## Compare them side by side

```js
// .then()                                    // async/await + try/catch
makeDough()                                   try {
  .then(dough => {                              const dough = await makeDough()
    return addTopping(dough, topping)           const pizza = await addTopping(dough, topping)
      .then(pizza => {                          const hotPizza = await bake(pizza)
        return bake(pizza)                      const result = await deliver(hotPizza, address)
          .then(hotPizza => {                   console.log(`Enjoy your ${result}!`)
            return deliver(hotPizza, address)  } catch (error) {
              ...                               console.log('Order failed:', error.message)
                                              }
```

Both do exactly the same thing. The right side reads top to bottom, like normal code.

## Try this

Add a fifth step to `pizza.js`, like `addGarlicKnots(pizza)`, and use it in both files.
Count how much each file has to change.
