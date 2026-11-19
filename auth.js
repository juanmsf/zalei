/**
 * Zalei & Dashboard — Auth Guard (PIN: 2572)
 */
(function () {
  const SESSION_KEY = 'zalei_auth_2572';
  const PASSCODE = '2572';

  if (sessionStorage.getItem(SESSION_KEY) === '1' || localStorage.getItem(SESSION_KEY) === '1') {
    return;
  }

  // Hide document body immediately until authenticated
  const hideStyle = document.createElement('style');
  hideStyle.id = 'zalei-auth-hide-style';
  hideStyle.textContent = `
    html, body {
      overflow: hidden !important;
    }
    body > *:not(#zalei-auth-overlay) {
      filter: blur(18px) brightness(0.25) !important;
      pointer-events: none !important;
      user-select: none !important;
    }
    #zalei-auth-overlay {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      background: radial-gradient(circle at 50% 0%, rgba(210, 178, 113, 0.16), transparent 45%),
                  radial-gradient(circle at 80% 90%, rgba(99, 102, 241, 0.14), transparent 40%),
                  rgba(7, 9, 15, 0.94);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #f4f4f6;
    }
    .zalei-auth-card {
      width: 100%;
      max-width: 390px;
      background: rgba(17, 20, 29, 0.92);
      border: 1px solid rgba(210, 178, 113, 0.28);
      border-radius: 22px;
      padding: 34px 28px 30px;
      box-shadow: 0 28px 80px rgba(0, 0, 0, 0.7), 0 0 35px rgba(210, 178, 113, 0.1);
      text-align: center;
      animation: zaleiAuthFadeIn 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes zaleiAuthFadeIn {
      from { opacity: 0; transform: translateY(12px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes zaleiAuthShake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-8px); }
      40%, 80% { transform: translateX(8px); }
    }
    .zalei-auth-shake {
      animation: zaleiAuthShake 0.35s ease;
    }
    .zalei-auth-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 999px;
      background: rgba(210, 178, 113, 0.12);
      border: 1px solid rgba(210, 178, 113, 0.35);
      color: #e6c885;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .zalei-auth-title {
      margin: 0 0 8px;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.01em;
      color: #ffffff;
    }
    .zalei-auth-sub {
      margin: 0 0 24px;
      font-size: 14px;
      color: #9ba1b6;
      line-height: 1.45;
    }
    .zalei-auth-input-wrap {
      position: relative;
      margin-bottom: 14px;
    }
    .zalei-auth-input {
      width: 100%;
      box-sizing: border-box;
      background: rgba(8, 10, 16, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 14px;
      padding: 15px 16px;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.38em;
      text-align: center;
      color: #ffffff;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .zalei-auth-input:focus {
      border-color: #d2b271;
      box-shadow: 0 0 0 3px rgba(210, 178, 113, 0.2);
    }
    .zalei-auth-input::placeholder {
      letter-spacing: 0.25em;
      color: #495066;
      font-weight: 500;
    }
    .zalei-auth-btn {
      width: 100%;
      box-sizing: border-box;
      border: none;
      border-radius: 14px;
      padding: 14px 18px;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.03em;
      cursor: pointer;
      background: linear-gradient(135deg, #d8b56d 0%, #b89146 100%);
      color: #0b0d13;
      box-shadow: 0 10px 25px rgba(216, 181, 109, 0.25);
      transition: transform 0.15s, filter 0.15s;
    }
    .zalei-auth-btn:hover {
      filter: brightness(1.08);
      transform: translateY(-1px);
    }
    .zalei-auth-btn:active {
      transform: translateY(0);
    }
    .zalei-auth-error {
      min-height: 20px;
      margin-top: 12px;
      font-size: 13px;
      font-weight: 600;
      color: #ff6b7a;
    }
  `;
  (document.head || document.documentElement).appendChild(hideStyle);

  function mountGate() {
    if (document.getElementById('zalei-auth-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'zalei-auth-overlay';
    overlay.innerHTML = `
      <div class="zalei-auth-card" id="zalei-auth-card">
        <div class="zalei-auth-badge">🔒 Acceso Protegido</div>
        <h2 class="zalei-auth-title">ZALEI &amp; DASHBOARD</h2>
        <p class="zalei-auth-sub">Ingresá el código de acceso para visualizar el portal completo y herramientas 3D.</p>
        <form id="zalei-auth-form" autocomplete="off">
          <div class="zalei-auth-input-wrap">
            <input
              type="password"
              id="zalei-auth-input"
              class="zalei-auth-input"
              inputmode="numeric"
              maxlength="8"
              placeholder="••••"
              autofocus
            />
          </div>
          <button type="submit" class="zalei-auth-btn">Desbloquear Portal</button>
          <div class="zalei-auth-error" id="zalei-auth-error"></div>
        </form>
      </div>
    `;
    (document.body || document.documentElement).appendChild(overlay);

    const form = document.getElementById('zalei-auth-form');
    const input = document.getElementById('zalei-auth-input');
    const errorEl = document.getElementById('zalei-auth-error');
    const card = document.getElementById('zalei-auth-card');

    function unlock() {
      sessionStorage.setItem(SESSION_KEY, '1');
      localStorage.setItem(SESSION_KEY, '1');
      overlay.remove();
      hideStyle.remove();
    }

    input.addEventListener('input', function () {
      errorEl.textContent = '';
      if (input.value.trim() === PASSCODE) {
        unlock();
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (input.value.trim() === PASSCODE) {
        unlock();
      } else {
        errorEl.textContent = 'Contraseña incorrecta. Intentá de nuevo.';
        card.classList.remove('zalei-auth-shake');
        void card.offsetWidth;
        card.classList.add('zalei-auth-shake');
        input.value = '';
        input.focus();
      }
    });

    setTimeout(() => input.focus(), 50);
  }

  if (document.body) {
    mountGate();
  } else {
    document.addEventListener('DOMContentLoaded', mountGate);
  }
})();
