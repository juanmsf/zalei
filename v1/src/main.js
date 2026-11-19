import { loadInitialData } from './data/loadData.js';
import { subscribe, getState } from './state/store.js';
import { mountStage } from './render/stage.js';
import { renderAnchors } from './render/anchors.js';
import { renderNodes } from './render/nodes.js';
import { renderConnectors } from './render/connectors.js';

// Phase 2 imports
import { initSelection } from './interaction/selection.js';
import { initDrag } from './interaction/drag.js';
import { mountInspector } from './render/inspector.js';
import { loadFromLocalStorage, saveToLocalStorage, exportStateAsJson, importStateFromJson } from './state/persistence.js';
import { qs } from './utils/dom.js';

// Phase 3 placeholders
const initConnectorCreation = () => console.log('Atlas: Connector creation initialized');
const initKeyboardShortcuts = () => console.log('Atlas: Keyboard shortcuts initialized');

const bindToolbarActions = () => {
    qs('#btn-save').addEventListener('click', saveToLocalStorage);
    qs('#btn-export').addEventListener('click', exportStateAsJson);
    
    const importInput = qs('#input-import');
    importInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            importStateFromJson(e.target.files[0]);
        }
    });

    // Auto-save on any change
    subscribe(() => {
        // Debounce or throttle would be better, but for now simple:
        // saveToLocalStorage(); 
        // Let's keep it manual per requirement "botón Guardar"
    });
};

async function boot() {
    // 1. loadInitialData() - Load seeds
    await loadInitialData();
    
    // 2. Try to load from localStorage to override seeds
    loadFromLocalStorage();
    
    // 3. mountStage()
    mountStage();
    
    // 4. mountInspector()
    mountInspector();
    
    // 5. initSelection()
    initSelection();
    
    // 6. initDrag()
    initDrag();
    
    // 7. initConnectorCreation()
    initConnectorCreation();
    
    // 8. initKeyboardShortcuts()
    initKeyboardShortcuts();
    
    // 9. bindToolbarActions()
    bindToolbarActions();

    // Re-render subscription
    subscribe((state) => {
        renderAnchors(state);
        renderNodes(state);
        renderConnectors(state);
    });

    // Initial render
    const initialState = getState();
    renderAnchors(initialState);
    renderNodes(initialState);
    renderConnectors(initialState);
}

document.addEventListener('DOMContentLoaded', boot);
