import _ from 'underscore'; 
import { crearDeck } from './usecases/crear-deck';
import { pedirCarta } from './usecases/pedir-carta';
import { valorCarta } from './usecases/valor-carta';

// Ejemplo de patrón módulo
(() => {
  'use strict'

  let deck     = [];
  const tipos  = ['C', 'D', 'H', 'S'],
    especiales = ['A', 'K', 'Q', 'J'];

  let puntosJugadores = [];

  // Referencias del HTML
  const btnPedir      = document.querySelector('#btnPedir'),
        btnDetener    = document.querySelector('#btnDetener'),
        btnNuevoJuego = document.querySelector('#btnNuevoJuego');

  const divCartasJugadores = document.querySelectorAll('.divCards'),
        puntosHTML         = document.querySelectorAll('small');

  // Esta función inicializa el juego
  const inicializarJuego = (numJugadores = 2) => {
    deck = crearDeck( tipos, especiales );

    puntosJugadores = [];
    for (let i = 0; i < numJugadores; i++) {
      puntosJugadores.push(0);
    }

    puntosHTML.forEach(elem => elem.innerHTML = 0);
    divCartasJugadores.forEach(elem => elem.innerHTML = '');

    btnPedir.disabled   = false;
    btnDetener.disabled = false;
  }

  // Turno: 0 = Primer jugador y el último será la computadora
  const acumularPuntos = (carta, turno) => {
    puntosJugadores[turno] = puntosJugadores[turno] + valorCarta( carta );
    puntosHTML[turno].innerHTML = puntosJugadores[turno];
    return puntosJugadores[turno];
  }

  const crearCarta = (carta, turno) => {
    const imgCarta = document.createElement('img');
    imgCarta.src = `assets/cartas/${carta}.png`; // (3H, JD etc..)
    imgCarta.classList.add('card');
    divCartasJugadores[turno].append(imgCarta);
  }

  const determinarGanador = () => {

    const [puntosMinimos, puntosComputadora] = puntosJugadores;

    setTimeout(() => {
      if (puntosComputadora === puntosMinimos) {
        alert('Nadie gana');
      }
      else if (puntosMinimos > 21) {
        alert('Computadora gana');
      }
      else if (puntosComputadora > 21) {
        alert('Jugador gana');
      }
      else {
        alert('Computadora gana');
      }
    }, 100);
  }

  // Turno de la computadora
  const turnoComputadora = (puntosMinimos) => {

    let puntosComputadora = 0;

    do {
      const carta = pedirCarta( deck );
      puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
      crearCarta(carta, puntosJugadores.length - 1);
    }
    while ((puntosComputadora < puntosMinimos) && puntosMinimos <= 21);

    determinarGanador();
  }

  // Eventos
  btnPedir.addEventListener('click', () => {
    const carta = pedirCarta( deck );
    const puntosJugador = acumularPuntos(carta, 0);

    crearCarta(carta, 0);

    if (puntosJugador > 21) {
      console.warn('Lo siento mucho, perdiste');
      btnPedir.disabled = true;
      btnDetener.disabled = true;
      turnoComputadora(puntosJugador);
    }
    else if (puntosJugador === 21) {
      console.warn('21, genial!');
      btnPedir.disabled = true;
      btnDetener.disabled = true;
      turnoComputadora(puntosJugador);
    }
  });


  btnDetener.addEventListener('click', () => {
    btnPedir.disabled = true;
    btnDetener.disabled = true;

    turnoComputadora(puntosJugadores[0]);
  });

  btnNuevoJuego.addEventListener('click', () => {

    inicializarJuego();

  });

})();