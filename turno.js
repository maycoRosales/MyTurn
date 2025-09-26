let contadorJugadores = 1;

const btnMas = document.getElementById('btnMas');
btnMas.addEventListener("click", agregarJugador);


const playPause = document.getElementById('pauseCheckbox');
playPause.addEventListener("click", soundPlayPause);

const closeButtom = document.getElementById('close');
closeButtom.addEventListener("click", closedWindows);
closeButtom.addEventListener("mouseover", soundClosed);
let soundClose = new Audio();
soundClose.src = "src/soundClose.mp3";

function closedWindows(){
    document.location.reload();
}
function soundClosed(){
    soundClose.play();
}

function soundPlayPause(){
    let soundpause = new Audio();
    soundpause.src = "src/soundpause.mp3";
    soundpause.play();
}

function agregarJugador() {
    contadorJugadores++;
    const jugadoresContainer = document.getElementById('jugadores-container');
    const nuevoJugadorDiv = document.createElement('div');
    nuevoJugadorDiv.className = 'jugador-input';
    nuevoJugadorDiv.innerHTML = `
                <br><br>
                <div class="brutalist-container">
                    <input
                        placeholder="NAME HERE"
                        class="brutalist-input smooth-type jugador"
                        id="jugador${contadorJugadores}"
                        type="text"
                    />
                    <input type="color" id="color${contadorJugadores}" class="color" value="#f561cd">
                    <label for="jugador${contadorJugadores}" class="brutalist-label">PLAYER ${contadorJugadores}</label>
                </div>
    `;
    jugadoresContainer.appendChild(nuevoJugadorDiv);
}

function alternarTurno(jugadores, tiempoTurno) {
    let turnoActual = 0; // Comenzamos con el turno del primer jugador
    const outputDiv = document.getElementById('output');
    const pauseCheckbox = document.getElementById('pauseCheckbox');

    function mostrarTurno() {
        let tiempoRestante = tiempoTurno;
        const nuevoDiv = document.createElement('div');

        // Función para mostrar el tiempo restante
        function mostrarTiempo() {
            if (pauseCheckbox.checked) {
                setTimeout(mostrarTiempo, 1000); // Revisa cada segundo si el checkbox sigue marcado
                return;
            }
            let remaining = new Audio();
            remaining.src = "src/remaining.mp3";
            let soundNext = new Audio();
            soundNext.src = "src/soundNext.mp3";
            let tiempo = `
            <div id="jugadorcolor" style="background-color:${jugadores[turnoActual].color}">
                <h1>${jugadores[turnoActual].nombre}</h1>
                <h4>${Math.floor(tiempoRestante/60).toString().padStart(2, '0')} : ${(tiempoRestante%60).toString().padStart(2, '0')}</h4>
                <label class="container">
            </div>
            `;
            let tiempoRojo = `
            <div id="jugadorcolor" style="background-color:${jugadores[turnoActual].color}">
                <h1>${jugadores[turnoActual].nombre}</h1>
                <h4 style="color:red">${Math.floor(tiempoRestante/60).toString().padStart(2, '0')} : ${(tiempoRestante%60).toString().padStart(2, '0')}</h4>
                <label class="container">
            </div>
            `;
            if (tiempoRestante > 10) {
                nuevoDiv.innerHTML = tiempo;
                outputDiv.appendChild(nuevoDiv);
                tiempoRestante--;
                setTimeout(mostrarTiempo, 1000); // Llamamos a mostrarTiempo cada segundo   
            } else if (tiempoRestante > 0) {
                nuevoDiv.innerHTML = tiempoRojo;
                outputDiv.appendChild(nuevoDiv);
                remaining.play();
                tiempoRestante--;
                setTimeout(mostrarTiempo, 1000); // Llamamos a mostrarTiempo cada segundo
            } else {
                outputDiv.removeChild(nuevoDiv);
                turnoActual = (turnoActual + 1) % jugadores.length; // Cambiamos al siguiente jugador
                soundNext.play();
                mostrarTurno(); // Llamamos recursivamente para el siguiente turno
            }
        }
        // Iniciamos el contador de tiempo
        mostrarTiempo();
    }
    // Iniciamos el juego mostrando el primer turno
    mostrarTurno();
}

function iniciarJuego() {
    class Player{
        constructor(nombre, color) {
            this.nombre = nombre;
            this.color = color;
        }
    }
    const jugadoresInputs = document.getElementsByClassName('jugador');
    const coloresInputs = document.getElementsByClassName('color');
    const listaJugadores = [];
    for (let i = 0; i < jugadoresInputs.length; i++) {
        listaJugadores.push(new Player(jugadoresInputs[i].value, coloresInputs[i].value));
    }
    const tiempoTurnoInput = document.getElementById('tiempoTurno').value;
    const unidadTiempo = document.querySelector('input[name="unidadTiempo"]:checked').value;
    let tiempoTurno = parseInt(tiempoTurnoInput);

    if (unidadTiempo === "minutos") {
        tiempoTurno *= 60; // Convertimos minutos a segundos
    }

    if (listaJugadores.length > 0 && !isNaN(tiempoTurno)) {
        document.getElementById('inputCard').style.display = 'none';
        document.getElementById('output').style.display = 'flex';
        document.getElementById('pause').style.display = 'flex';
        alternarTurno(listaJugadores, tiempoTurno);
    } else {
        alert("Por favor, ingresa los nombres de los jugadores y el tiempo por turno.");
    }
}