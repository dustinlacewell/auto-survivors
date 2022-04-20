import Peer from 'peerjs'
import 'phaser'
import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'

const DEFAULT_WIDTH = 1280
const DEFAULT_HEIGHT = 720

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#ffffff',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [PreloadScene, MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 400 }
    }
  }
}

window.addEventListener('load', () => {
  const peer = new Peer();
  peer.on('open', id => {
    const conn = peer.connect('as-server');
    conn.on('open', () => {
      console.log('Connected to server');
      conn.send(`Hello from ${id}`);
    });
    conn.on('close', () => {
      console.log('Disconnected from server');
    })
    conn.on('data', data => console.log(data))
  })
  const game = new Phaser.Game(config)
})
