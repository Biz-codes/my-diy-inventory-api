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
            done: true
        },
        {
            id: 2,
            user_id: 2,
            project_name: 'Stormy Pants',
            supplies_needed: 'blue thread, jersey knit cotton, pattern',
            tools_needed: 'marking pen, pins, scissors, sewing machine, sewing machine needle',
            instructions: '...',
            delivery_date: '2021-09-30T00:00:00.000Z',
            done: false
        }
    ]
}


module.exports = {
    makeProjectsArray
}