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

function makeMaliciousSupply() {
    const maliciousSupply = {
        id: 1,
        user_id: 1,
        supply_name: "Naughty naughty very naughty <script>alert('xss');</script>",
        details: "Naughty naughty very naughty <script>alert('xss');</script>",
        quantity: 1
    }
    const expectedSupply = {
        ...makeMaliciousSupply,
        user_id: 1,
        supply_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;', // converts script to render it inert
        details: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;', // converts script to render it inert
        quantity: 1
    }
    return {
        maliciousSupply,
        expectedSupply,
    }
}

module.exports = {
    makeSuppliesArray,
    makeMaliciousSupply,
}
