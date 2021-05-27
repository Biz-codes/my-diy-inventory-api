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

function makeMaliciousTool() {
    const maliciousTool = {
        id: 1,
        user_id: 1,
        tool_name: "Naughty naughty very naughty <script>alert('xss');</script>",
        details: "Naughty naughty very naughty <script>alert('xss');</script>",
        quantity: 1
    }
    const expectedTool = {
        ...maliciousTool,
        user_id: 1,
        tool_name: 'Naughty naughty very naughty &lt;script&gt;alert(\'xss\');&lt;/script&gt;', // converts script to render it inert
        details: 'Naughty naughty very naughty &lt;script&gt;alert(\'xss\');&lt;/script&gt;', // converts script to render it inert
        quantity: 1
    }
    return {
        maliciousTool,
        expectedTool,
    }
}

module.exports = {
    makeToolsArray,
    makeMaliciousTool
}

