function makeUsersArray() {
    return [
        {
            id: 1,
            name: 'Biz Hight',
            username: 'elizabeth.biz.hight@gmail.com',
            password: 'Go4Admin!'
        },
        {
            id: 2,
            name: 'Demo user',
            username: 'demo.email@gmail.com',
            password: 'Go4Demo!'
        }
    ]
}

function makeMaliciousUser() {
    const maliciousUser = {
        id: 1,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        username: 'Naughty naughty very naughty <script>alert("xss");</script>',
        password: 'Naughty naughty very naughty <script>alert("xss");</script>',

    }
    const expectedUser = {
        ...maliciousUser,
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;', // converts script to render it inert
        username: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;', // converts script to render it inert
        password: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;', // converts script to render it inert
        
    }
    return {
        maliciousUser,
        expectedUser,
    }
}

module.exports = {
    makeUsersArray,
    makeMaliciousUser,
}