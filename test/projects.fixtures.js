function makeProjectsArray() {
    return [
        {
            id: 1,
            user_id: 2,
            project_name: 'Raised Bed',
            supplies_needed: 'chicken wire, screws, staples, wood',
            tools_needed: 'drill, staple gun',
            instructions: '...',
            delivery_date: '2019-07-04T00:00:00.000Z',
            done: "to-do it myself"
        },
        {
            id: 2,
            user_id: 2,
            project_name: 'Stormy Pants',
            supplies_needed: 'blue thread, jersey knit cotton, pattern',
            tools_needed: 'marking pen, pins, scissors, sewing machine, sewing machine needle',
            instructions: '...',
            delivery_date: '2021-09-30T00:00:00.000Z',
            done: "DONE it myself!"
        }
    ]
}

function makeMaliciousProject() {
    const maliciousProject = {
        id: 1,
        user_id: 1,
        project_name: "Naughty naughty very naughty <script>alert('xss');</script>",
        supplies_needed: "Naughty naughty very naughty <script>alert('xss');</script>",
        tools_needed: "Naughty naughty very naughty <script>alert('xss');</script>",
        instructions: "Naughty naughty very naughty <script>alert('xss');</script>",
        delivery_date: '2019-07-04T00:00:00.000Z',
        done: "to-do it myself",
    }
    const expectedProject = {
        ...maliciousProject,
        user_id: 1,
        project_name: 'Naughty naughty very naughty &lt;script&gt;alert(\'xss\');&lt;/script&gt;', // converts script to render it inert
        supplies_needed: 'Naughty naughty very naughty &lt;script&gt;alert(\'xss\');&lt;/script&gt;', // converts script to render it inert
        tools_needed: 'Naughty naughty very naughty &lt;script&gt;alert(\'xss\');&lt;/script&gt;', // converts script to render it inert
        instructions: 'Naughty naughty very naughty &lt;script&gt;alert(\'xss\');&lt;/script&gt;', // converts script to render it inert
        delivery_date: '2019-07-04T00:00:00.000Z',
        done: "to-do it myself"
    }
    return {
        maliciousProject,
        expectedProject,
    }
}

module.exports = {
    makeProjectsArray,
    makeMaliciousProject
}