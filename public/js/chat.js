const socket = io();

// socket.on('countUpdated',(count) => {
//     console.log("The count has been updated!", count )
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log("Clicked");

//     socket.emit('increment')

// })
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const urlTemplate = document.querySelector('#url-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // // new message element
    // const  $newMessage = $messages.lastElementChild

    // //Height of the new message
    // const newMessageStyle = getComputedStyle($newMessage)
    // const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    // const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // //Visible Height
    // const visibleHeight = $messages.offsetHeight

    // //height of message container
    // const containerHeight = $messages.scrollHeight

    // //how far have i scrolled
    // const scrolloffset = $messages.scrollTop + visibleHeight

    // if( containerHeight - newMessageHeight <= scrolloffset ) {
    //     $messages.scrollTop = $messages.offsetHeight
    // }
    $messages.scrollTop = $messages.offsetHeight
}

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, { 
        username: message.username,
        message: message.text,
        createdAt : moment(message.createdAt).format('h:mm a') 
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (message) => {
    const html = Mustache.render(urlTemplate, {
        username: message.username, 
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')    
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    $messageFormButton.setAttribute('disabled','disabled')
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            return console.log(error);
        } 
        console.log("The message delivered successfully: ");
    });

})


$sendLocation.addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Browser doesnot support Geolocation!');
    }

    navigator.geolocation.getCurrentPosition((position) => {
        $sendLocation.setAttribute('disabled','disabled')
        let data = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        socket.emit('sendLocation', data, () => {
            $sendLocation.removeAttribute('disabled')

            console.log('Location Shared')
        })
    })
})


socket.emit('join', { username, room }, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})