function makeSuppliesArray() {
    return [
        {
            id: 1,
            supply_name: 'fabric - cotton - jersey knit',
            details: 'blue, yards',
            quantity: 3,
            user_id: 2
        },
        {
            id: 2,
            supply_name: 'nails',
            details: '...',
            quantity: 50,
            user_id: 2
        },
        {
            id: 3,
            supply_name: 'origami paper',
            details: 'multicolor, sheets',
            quantity: 30,
            user_id: 2
        },
        {
            id: 4,
            supply_name: 'thread',
            details: 'green, spools',
            quantity: 1,
            user_id: 2
        },
    ]
}

module.exports = {
    makeSuppliesArray
}