/**
 * Example of using EmulatorJS in a modern frontend framework (like React, Vue, etc.)
 * This is a conceptual example showing how you might integrate EmulatorJS
 * into a component-based architecture.
 */

import { EmulatorJS } from '../src/index.js';

class EmulatorComponent {
  constructor(containerElement) {
    this.container = containerElement;
    this.emulator = null;
    this.mountPoint = null;
  }

  /**
   * Initialize the component
   */
  init() {
    // Create mount point for the emulator
    this.mountPoint = document.createElement('div');
    this.mountPoint.id = 'emulator-mount';
    this.mountPoint.style.width = '100%';
    this.mountPoint.style.height = '100%';
    this.container.appendChild(this.mountPoint);
  }

  /**
   * Load a game into the emulator
   * @param {Object} gameConfig - Game configuration
   */
  async loadGame(gameConfig) {
    try {
      // Destroy existing emulator
      if (this.emulator) {
        this.emulator.destroy();
      }

      // Show loading state
      this.showLoading();

      // Create new emulator instance
      this.emulator = new EmulatorJS('emulator-mount', {
        gameUrl: gameConfig.url,
        system: gameConfig.system,
        gameName: gameConfig.name,
        dataPath: gameConfig.dataPath || './data/',
        startOnLoad: true,
        disableDatabases: true,
        ...gameConfig.options
      });

      // Load the emulator
      await this.emulator.load();

      // Set up event listeners
      this.setupEventListeners();

      console.log('Game loaded successfully:', gameConfig.name);
    } catch (error) {
      console.error('Failed to load game:', error);
      this.showError(error.message);
    }
  }

  /**
   * Set up emulator event listeners
   */
  setupEventListeners() {
    if (!this.emulator) return;

    this.emulator.on('ready', () => {
      console.log('Emulator is ready');
      this.onReady();
    });

    this.emulator.on('start', () => {
      console.log('Game started');
      this.onStart();
    });

    this.emulator.on('loadState', (saveState) => {
      console.log('State loaded');
      this.onLoadState(saveState);
    });

    this.emulator.on('saveState', (saveState) => {
      console.log('State saved');
      this.onSaveState(saveState);
    });
  }

  /**
   * Show loading state
   */
  showLoading() {
    this.mountPoint.innerHTML = `
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: #666;
        font-size: 18px;
      ">
        Loading emulator...
      </div>
    `;
  }

  /**
   * Show error state
   */
  showError(message) {
    this.mountPoint.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: #ff0000;
        font-size: 18px;
      ">
        <div>Error loading emulator:</div>
        <div>${message}</div>
      </div>
    `;
  }

  /**
   * Handle emulator ready event
   */
  onReady() {
    // Override in implementation
  }

  /**
   * Handle game start event
   */
  onStart() {
    // Override in implementation
  }

  /**
   * Handle state load event
   */
  onLoadState(saveState) {
    // Override in implementation
  }

  /**
   * Handle state save event
   */
  onSaveState(saveState) {
    // Override in implementation
  }

  /**
   * Load a save state
   * @param {string} stateData - Save state data
   */
  async loadState(stateData) {
    if (this.emulator && typeof this.emulator.loadState === 'function') {
      return this.emulator.loadState(stateData);
    }
  }

  /**
   * Save current state
   * @returns {Promise} Promise that resolves with the save state data
   */
  async saveState() {
    if (this.emulator && typeof this.emulator.saveState === 'function') {
      return this.emulator.saveState();
    }
  }

  /**
   * Destroy the component and clean up
   */
  destroy() {
    if (this.emulator) {
      this.emulator.destroy();
      this.emulator = null;
    }

    if (this.mountPoint && this.mountPoint.parentNode) {
      this.mountPoint.parentNode.removeChild(this.mountPoint);
      this.mountPoint = null;
    }
  }
}

// Example usage in a framework-like environment
export function createEmulatorApp(containerElement, games) {
  const app = {
    component: new EmulatorComponent(containerElement),
    games: games,
    
    init() {
      this.component.init();
      this.renderGameList();
    },
    
    renderGameList() {
      // This would typically be handled by your framework's templating system
      const gameList = document.createElement('div');
      gameList.innerHTML = `
        <h3>Available Games</h3>
        <div id="game-list">
          ${this.games.map(game => `
            <button onclick="app.loadGame('${game.id}')" 
                    style="margin: 5px; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
              ${game.name}
            </button>
          `).join('')}
        </div>
      `;
      
      containerElement.parentNode.insertBefore(gameList, containerElement);
    },
    
    async loadGame(gameId) {
      const game = this.games.find(g => g.id === gameId);
      if (game) {
        await this.component.loadGame(game);
      }
    }
  };

  // Make app globally accessible for the example buttons
  window.app = app;
  
  return app;
}

// Example game data
export const exampleGames = [
  {
    id: 'tank',
    name: '90 Tank',
    url: '90坦克.nes',
    system: 'nes',
    options: {
      debug: false
    }
  },
  {
    id: 'mario',
    name: 'Super Mario',
    url: '93超级魂.nes',
    system: 'nes',
    options: {
      debug: false
    }
  },
  {
    id: 'f1',
    name: 'F-1 Race',
    url: 'F-1赛车.nes',
    system: 'nes',
    options: {
      debug: false
    }
  }
];

export default { EmulatorComponent, createEmulatorApp, exampleGames };