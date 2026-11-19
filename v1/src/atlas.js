/**
 * ZALEI ATLAS OPERATOR v2.1
 * All coordinates are relative to the actual rendered image bounds.
 * Anchors and nodes use % of image width/height.
 * Ports: 4 sides, auto-selected by direction to target.
 */
(function () {
    // ── STATE ───────────────────────────────────────────────
    let state = {
        anchors: [], zones: [], annotations: [], requests: [],
        selectedNodeId: null,
        connectingNodeId: null,
        connectingPortSide: 'left',
        imageRect: null   // actual rendered image bounds
    };

    const _listeners = [];
    const subscribe = fn => _listeners.push(fn);
    const notify    = ()  => _listeners.forEach(fn => fn(state));
    const setState  = ns  => { state = { ...state, ...ns }; notify(); };

    const updateAnnotation = (id, upd) => {
        state.annotations = state.annotations.map(a =>
            a.id === id ? { ...a, ...upd } : a
        );
        notify();
    };

    const updateAnchor = (id, upd) => {
        state.anchors = state.anchors.map(a =>
            a.id === id ? { ...a, ...upd } : a
        );
        notify();
    };

    // ── UTILS ────────────────────────────────────────────────
    const qs   = s => document.querySelector(s);
    const uid  = p => `${p || 'id'}-${Math.random().toString(36).slice(2, 9)}`;
    const svgNS = 'http://www.w3.org/2000/svg';
    const mkEl  = (tag, cls, attrs = {}) => {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
        return e;
    };
    const mkSVG = (tag, attrs = {}) => {
        const e = document.createElementNS(svgNS, tag);
        for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
        return e;
    };

    // Convert rel (0..1) → px relative to image rect
    const toPx = (rx, ry, r) => ({ x: rx * r.width, y: ry * r.height });

    // Convert px relative to image rect → rel (0..1)
    const toRel = (px, py, r) => ({ x: px / r.width, y: py / r.height });

    // Convert event clientX/Y → rel coords based on image rect
    const evToRel = (e, r) => ({
        x: (e.clientX - r.left) / r.width,
        y: (e.clientY - r.top)  / r.height
    });

    // Port pixel position on node card based on side
    // Node is positioned at (nx, ny) = top-left of the card
    const portPx = (ann, side, r) => {
        const nx = ann.nodePosition.x * r.width;
        const ny = ann.nodePosition.y * r.height;
        const W = 160, H = 36;
        if (side === 'right')  return { x: nx + W + 6, y: ny + H / 2 };
        if (side === 'top')    return { x: nx + W / 2, y: ny - 6 };
        if (side === 'bottom') return { x: nx + W / 2, y: ny + H + 6 };
        /* left */             return { x: nx - 6,     y: ny + H / 2 };
    };

    // Auto-detect best port side based on where anchor is relative to node center
    const bestSide = (ann, ax, ay, r) => {
        const nx = ann.nodePosition.x * r.width + 80;  // node center X
        const ny = ann.nodePosition.y * r.height + 18; // node center Y
        const dx = ax - nx, dy = ay - ny;
        return Math.abs(dx) >= Math.abs(dy)
            ? (dx >= 0 ? 'right' : 'left')
            : (dy >= 0 ? 'bottom' : 'top');
    };

    // Bezier from port to anchor based on side
    const bezier = (px, py, ax, ay, side) => {
        const len = Math.max(Math.abs(ax - px), Math.abs(ay - py)) * 0.55;
        let c1x = px, c1y = py, c2x = ax, c2y = ay;
        if (side === 'left')   { c1x = px - len; c2x = ax + len; }
        if (side === 'right')  { c1x = px + len; c2x = ax - len; }
        if (side === 'top')    { c1y = py - len; c2y = ay + len; }
        if (side === 'bottom') { c1y = py + len; c2y = ay - len; }
        return `M${px} ${py} C${c1x} ${c1y},${c2x} ${c2y},${ax} ${ay}`;
    };

    // ── RENDERERS ────────────────────────────────────────────
    const renderAnchors = () => {
        const layer = qs('#anchor-layer');
        const r = state.imageRect;
        if (!layer || !r) return;
        layer.innerHTML = '';
        state.anchors.forEach(a => {
            const dot = mkEl('div', 'anchor-dot', { title: a.label, 'data-id': a.id });
            // Position relative to the layer (which is offset to match the image)
            dot.style.left = `${a.x * 100}%`;
            dot.style.top  = `${a.y * 100}%`;
            layer.appendChild(dot);
        });
    };

    const renderNodes = () => {
        const layer = qs('#node-layer');
        const r = state.imageRect;
        if (!layer || !r) return;
        layer.innerHTML = '';
        state.annotations.forEach(ann => {
            const isSel  = state.selectedNodeId === ann.id;
            const isConn = state.connectingNodeId === ann.id;
            const node = mkEl('div',
                `map-node${isSel ? ' node-selected' : ''}${isConn ? ' node-connecting' : ''}`,
                { 'data-id': ann.id }
            );
            node.style.left = `${ann.nodePosition.x * 100}%`;
            node.style.top  = `${ann.nodePosition.y * 100}%`;

            // 4 ports
            ['left', 'right', 'top', 'bottom'].forEach(side => {
                const p = mkEl('div',
                    `node-port port-${side}${isConn && state.connectingPortSide === side ? ' connecting' : ''}`,
                    { 'data-side': side }
                );
                node.appendChild(p);
            });

            const card = mkEl('div', 'node-card');
            const status = ann.action?.status || 'draft';
            card.innerHTML = `<span class="node-label">${ann.labelText}</span>` +
                             `<span class="node-badge badge-${status}">${status}</span>`;
            node.appendChild(card);
            layer.appendChild(node);
        });
    };

    const renderConnectors = () => {
        const svg  = qs('#annotation-svg');
        const ui   = qs('#connector-ui-layer');
        const r    = state.imageRect;
        if (!svg || !ui || !r) return;
        svg.innerHTML = '';
        ui.innerHTML  = '';

        state.annotations.forEach(ann => {
            const isSel = state.selectedNodeId === ann.id;
            ann.connectors.forEach(conn => {
                const anchor = state.anchors.find(a => a.id === conn.anchorId);
                if (!anchor) return;

                const ax   = anchor.x * r.width;
                const ay   = anchor.y * r.height;
                const side = conn.portSide || bestSide(ann, ax, ay, r);
                const pp   = portPx(ann, side, r);

                // Draw SVG path
                const path = mkSVG('path', {
                    'd': bezier(pp.x, pp.y, ax, ay, side),
                    'class': `connector-path${isSel ? ' connector-path--active' : ''}`
                });
                svg.appendChild(path);

                // Trash button at midpoint of bezier (approximate)
                const mx = (pp.x + ax) / 2;
                const my = (pp.y + ay) / 2;
                const trash = mkEl('div', 'btn-trash');
                trash.style.left = `${(mx / r.width)  * 100}%`;
                trash.style.top  = `${(my / r.height) * 100}%`;
                trash.onclick = e => { e.stopPropagation(); removeConnector(ann.id, conn.id); };
                ui.appendChild(trash);
            });
        });
    };

    // ── ACTIONS ──────────────────────────────────────────────
    const addNode = () => {
        const ann = {
            id: uid('ann'),
            requestText: 'Nueva etiqueta manual',
            labelText: 'Nueva Etiqueta',
            nodePosition: { x: 0.5, y: 0.4 },
            portSide: 'left',
            scope: { level: 'macrozona', zoneId: null, subzoneId: null },
            action: { type: 'label', status: 'draft' },
            connectors: []
        };
        setState({ annotations: [...state.annotations, ann], selectedNodeId: ann.id });
    };

    const addAnchor = () => {
        setState({ anchors: [...state.anchors, { id: uid('anchor'), x: 0.5, y: 0.5, type: 'manual', label: 'Nuevo Punto' }] });
    };

    const deleteNode = id => {
        if (!confirm('¿Eliminar esta etiqueta?')) return;
        setState({ annotations: state.annotations.filter(a => a.id !== id), selectedNodeId: null });
    };

    const removeConnector = (nodeId, connId) => {
        const ann = state.annotations.find(a => a.id === nodeId);
        if (ann) updateAnnotation(nodeId, { connectors: ann.connectors.filter(c => c.id !== connId) });
    };

    const createConnector = (nodeId, anchorId, portSide) => {
        const ann = state.annotations.find(a => a.id === nodeId);
        if (ann && !ann.connectors.find(c => c.anchorId === anchorId)) {
            updateAnnotation(nodeId, {
                connectors: [...ann.connectors, { id: uid('conn'), anchorId, portSide }]
            });
        }
        setState({ connectingNodeId: null, connectingPortSide: 'left' });
        qs('#annotation-stage').style.cursor = '';
    };

    const replaceImage = file => {
        const reader = new FileReader();
        reader.onload = e => { qs('#annotation-image').src = e.target.result; };
        reader.readAsDataURL(file);
    };

    const sendToN8n = async nodeId => {
        const ann = state.annotations.find(a => a.id === nodeId);
        if (!ann) return;
        const btn = qs('#btn-send-n8n');
        const orig = btn.textContent;
        btn.textContent = 'Enviando…';
        btn.disabled = true;
        const payload = {
            timestamp: new Date().toISOString(),
            source: 'Zalei Atlas Operator v2.1',
            annotation: {
                ...ann,
                connectors: ann.connectors.map(c => {
                    const a = state.anchors.find(x => x.id === c.anchorId);
                    return { ...c, anchorLabel: a?.label, anchorPos: a ? { x: a.x, y: a.y } : null };
                })
            }
        };
        try {
            const URL = '/webhook/zalei-atlas';
            await fetch(URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            alert('Enviado a n8n ✓');
            updateAnnotation(nodeId, { action: { ...ann.action, status: 'synced' } });
        } catch (e) {
            alert('Error conectando con n8n. Revisá la URL del webhook.');
        } finally {
            btn.textContent = orig;
            btn.disabled = false;
        }
    };

    // ── INTERACTIONS ─────────────────────────────────────────
    const initSelection = () => {
        const stage = qs('#annotation-stage');
        stage.addEventListener('click', e => {
            // In connecting mode: click anchor to link
            if (state.connectingNodeId) {
                const aDot = e.target.closest('.anchor-dot');
                if (aDot) {
                    createConnector(state.connectingNodeId, aDot.dataset.id, state.connectingPortSide);
                    return;
                }
                if (!e.target.closest('.node-port')) {
                    setState({ connectingNodeId: null });
                    stage.style.cursor = '';
                }
                return;
            }

            // Click on port → enter connecting mode
            const portEl = e.target.closest('.node-port');
            if (portEl) {
                const nodeEl = e.target.closest('.map-node');
                if (!nodeEl) return;
                const side = portEl.dataset.side || 'left';
                setState({ connectingNodeId: nodeEl.dataset.id, selectedNodeId: nodeEl.dataset.id, connectingPortSide: side });
                stage.style.cursor = 'crosshair';
                return;
            }

            // Click on node → select
            const nodeEl = e.target.closest('.map-node');
            if (nodeEl) { setState({ selectedNodeId: nodeEl.dataset.id }); return; }

            // Click background → deselect
            setState({ selectedNodeId: null, connectingNodeId: null });
            stage.style.cursor = '';
        });
    };

    const initDrag = () => {
        let dragId = null, dragType = null, offset = {};
        const stage = qs('#annotation-stage');

        stage.addEventListener('pointerdown', e => {
            if (e.target.closest('.node-port') || e.target.closest('.btn-trash')) return;
            const nEl = e.target.closest('.map-node');
            const aEl = e.target.closest('.anchor-dot');
            if (!nEl && !aEl) return;

            const target = nEl || aEl;
            dragId   = target.dataset.id;
            dragType = nEl ? 'node' : 'anchor';
            target.classList.add('node-dragging');
            target.setPointerCapture(e.pointerId);

            const r   = state.imageRect;
            const rel = evToRel(e, r);
            const cur = dragType === 'node'
                ? state.annotations.find(a => a.id === dragId).nodePosition
                : (() => { const a = state.anchors.find(a => a.id === dragId); return { x: a.x, y: a.y }; })();
            offset = { x: rel.x - cur.x, y: rel.y - cur.y };
            e.stopPropagation();
        });

        stage.addEventListener('pointermove', e => {
            if (!dragId) return;
            const r   = state.imageRect;
            const rel = evToRel(e, r);
            const nx  = rel.x - offset.x;
            const ny  = rel.y - offset.y;
            if (dragType === 'node') updateAnnotation(dragId, { nodePosition: { x: nx, y: ny } });
            else                     updateAnchor(dragId, { x: nx, y: ny });
        });

        stage.addEventListener('pointerup', e => {
            if (!dragId) return;
            const sel = dragType === 'node'
                ? `.map-node[data-id="${dragId}"]`
                : `.anchor-dot[data-id="${dragId}"]`;
            qs(sel)?.classList.remove('node-dragging');
            dragId = null;
        });
    };

    const initInspector = () => {
        const insp = qs('#atlas-inspector');
        const lbl  = qs('#inspector-label');
        qs('#btn-close-inspector').onclick  = () => setState({ selectedNodeId: null });
        qs('#btn-delete-node').onclick      = () => { if (state.selectedNodeId) deleteNode(state.selectedNodeId); };
        qs('#btn-send-n8n').onclick         = () => { if (state.selectedNodeId) sendToN8n(state.selectedNodeId); };
        lbl.oninput = e => { if (state.selectedNodeId) updateAnnotation(state.selectedNodeId, { labelText: e.target.value }); };

        subscribe(s => {
            if (!s.selectedNodeId) { insp.classList.add('hidden'); return; }
            const ann = s.annotations.find(a => a.id === s.selectedNodeId);
            if (!ann) { insp.classList.add('hidden'); return; }
            insp.classList.remove('hidden');
            qs('#inspector-request').textContent = ann.requestText || '—';
            lbl.value = ann.labelText;
            qs('#inspector-scope').textContent = `${ann.scope?.level || '—'} · ${ann.scope?.zoneId || 'N/A'}`;
            qs('#inspector-status').textContent = ann.action?.status || '—';
        });
    };

    const initPersistence = () => {
        const KEY = 'zalei_atlas_v2';
        qs('#btn-save').onclick = () => {
            localStorage.setItem(KEY, JSON.stringify({ annotations: state.annotations, anchors: state.anchors }));
            const b = qs('#btn-save');
            b.textContent = '✓ Guardado';
            setTimeout(() => b.textContent = 'Guardar', 1600);
        };
        qs('#btn-export').onclick = () => {
            const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
            Object.assign(document.createElement('a'), {
                href: URL.createObjectURL(blob),
                download: `zalei-${new Date().toISOString().slice(0, 10)}.json`
            }).click();
        };
        qs('#input-import').onchange = e => {
            const reader = new FileReader();
            reader.onload = ev => {
                const d = JSON.parse(ev.target.result);
                setState({ annotations: d.annotations || [], anchors: d.anchors || state.anchors });
            };
            if (e.target.files[0]) reader.readAsText(e.target.files[0]);
        };
        qs('#btn-add-node').onclick          = addNode;
        qs('#btn-add-anchor').onclick        = addAnchor;
        qs('#input-replace-img').onchange    = e => { if (e.target.files[0]) replaceImage(e.target.files[0]); };

        // Load saved
        const saved = localStorage.getItem(KEY);
        if (saved) {
            const d = JSON.parse(saved);
            setState({ annotations: d.annotations || [], anchors: d.anchors || window.ANCHORS_SEED || [] });
        }
    };

    // ── BOOT ─────────────────────────────────────────────────
    const boot = () => {
        const img   = qs('#annotation-image');
        const stage = qs('#annotation-stage');

        // Position all layers exactly over the visible image
        const syncLayers = () => {
            const r = img.getBoundingClientRect();
            const s = stage.getBoundingClientRect();
            const offL = r.left - s.left;
            const offT = r.top  - s.top;
            // All overlay layers share the same offset & size as the image
            ['#annotation-svg', '#anchor-layer', '#node-layer', '#connector-ui-layer'].forEach(sel => {
                const el = qs(sel);
                if (!el) return;
                el.style.left   = `${offL}px`;
                el.style.top    = `${offT}px`;
                el.style.width  = `${r.width}px`;
                el.style.height = `${r.height}px`;
            });
            state.imageRect = r;
            notify();
        };

        new ResizeObserver(syncLayers).observe(stage);
        img.addEventListener('load', syncLayers);
        if (img.complete) syncLayers();
        else img.onload = syncLayers;

        // Load seeds
        setState({
            anchors:     window.ANCHORS_SEED     || [],
            zones:       window.ZONES_SEED       || [],
            annotations: window.ANNOTATIONS_SEED || [],
            requests:    window.REQUESTS_SEED    || []
        });

        initSelection();
        initDrag();
        initInspector();
        initPersistence();

        subscribe(() => { renderAnchors(); renderNodes(); renderConnectors(); });
        notify();
    };

    window.addEventListener('DOMContentLoaded', boot);
})();
