const users = []

const addUser = ({ id, username, room}) => {
    //Clean the date 
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data
    if(!username || !room) {
        return {
           error: 'Username and room are required!' 
        }
    }

    //Checking for existing user
    const existingUser = users.find((user) => {
        return user.username === username && user.room === room
    })

    //Validate username
    if(existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    //Store the user
    const user = { id, username, room}
    users.push(user)
    console.log(users)
    return { user }
}

const getUser = (id) => {
    return users.find((user) => user.id === id )
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}