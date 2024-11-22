const canvas = document.getElementById('canvas');
let pageId
window.onload = () => {
    pageId = Math.floor(Math.random() * 100)
    console.log(pageId)
}
const ctx = canvas.getContext('2d');
const ws = new WebSocket('ws://localhost:8080');
let pseudo = ""

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = `${x},${y}`;
    const pixelData = { action: 'draw', data: { id, x, y, color: '#FD0065' }, id: pageId };
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(pixelData));
    } else {
        console.error('WebSocket is not open: ', ws.readyState);
    }
});

canvas.addEventListener('dblclick', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = `${x},${y}`;
    const pixelData = { action: 'draw', data: { id, x, y, color: '#FFE0F4' }, id: pageId };
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(pixelData));
    } else {
        console.error('WebSocket is not open: ', ws.readyState);
    }
});

const chat = document.getElementById('chat');

ws.onmessage = (event) => {
    const { action, data, pseudo: sender } = JSON.parse(event.data);
    console.log(action, data)
    if(action == 'draw'){
        ctx.fillStyle = data.color;
        ctx.fillRect(data.x, data.y, 10, 10);  
    }
    else if (action == 'init'){
        Object.values(data).forEach(p => {
            console.log(p.color, p.x, p.y)
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, 10, 10);  
        })
    }
    else if (action === 'chat') {  
        console.log(sender),
        console.log(data.message);
        const messagerie = document.createElement('p');
        messagerie.textContent = `${sender} : ${data.message}`;
        chat.appendChild(messagerie); 
    }
};

ws.onclose = (event) => {
    console.log('WebSocket is closed: ', event.reason);
};

ws.onerror = (error) => {
    console.error('WebSocket error: ', error);
};

const formulaire = document.getElementById('formulaire');
const chatform = document.getElementById('chatform');
const pseudoInput = document.getElementById('pseudo');

// Afficher le canvas lorsque le bouton "Valider" est cliqué
formulaire.addEventListener('submit', (event) => {
    event.preventDefault(); 
    if (pseudoInput.value.trim() !== '') {
        canvas.style.display = 'block'; 
        pseudo = document.getElementById('pseudo').value.trim();
        console.log(pseudo)
        ws.send(JSON.stringify({ action: 'add', pseudo: pseudo}));
        
    } else {
        alert("Veuillez entrer un pseudo !");
    }
});

const messageInput = document.getElementById('message');


// Afficher le canvas lorsque le bouton "Envoyer" est cliqué
chatform.addEventListener('submit', (event) => {
    event.preventDefault(); 
    if (messageInput.value.trim() !== '') {
        let message = document.getElementById('message').value;
        ws.send(JSON.stringify({ action: 'chat', pseudo, data: { message } })); 
    } else {
        alert("Veuillez entrer un message !");
    }
});