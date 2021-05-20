function makeSuppliesArray() {
    return [
        {
            id: 1,
            user_id: 2,
            supply_name: 'fabric - cotton - jersey knit',
            details: 'blue, yards',
            quantity: 3
        },
        {
            id: 2,
            user_id: 2,
            supply_name: 'nails',
            details: '...',
            quantity: 50
        },
        {
            id: 3,
            user_id: 2,
            supply_name: 'origami paper',
            details: 'multicolor, sheets',
            quantity: 30
        },
        {
            id: 4,
            user_id: 2,
            supply_name: 'thread',
            details: 'green, spools',
            quantity: 1
        },
    ]
}

module.exports = {
    makeSuppliesArray
}