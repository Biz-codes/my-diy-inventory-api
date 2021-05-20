function makeToolsArray() {
    return [
        {
            id: 1,
            user_id: 2,
            tool_name: 'hammer',
            details: 'small, yellow grip',
            quantity: 2
        },
        {
            id: 2,
            user_id: 2,
            tool_name: 'paintbrush',
            details: 'large',
            quantity: 10
        },
        {
            id: 3,
            user_id: 2,
            tool_name: 'sandpaper',
            details: 'fine',
            quantity: 5
        },
        {
            id: 4,
            user_id: 2,
            tool_name: 'sewing machine',
            details: 'singer',
            quantity: 1
        },
    ]
}

module.exports = {
    makeToolsArray
}

