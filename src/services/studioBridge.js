// Avi Jewelers USA — Storefront Visual Studio Bridge
// Connects the live storefront to the Admin Visual Studio iframe

export function initStudioBridge(onNavigate) {
  const isEmbedded = window.self !== window.top || window.location.search.includes('preview=true');

  // Apply any stored published overrides on initial load
  applyStoredOverrides();

  if (!isEmbedded) return;

  // Add visual inspector hover indicator style in preview mode
  const styleEl = document.createElement('style');
  styleEl.id = 'avi-studio-inspector-styles';
  styleEl.innerHTML = `
    [data-edit-id] {
      cursor: pointer !important;
      transition: outline 0.15s ease !important;
    }
    [data-edit-id]:hover {
      outline: 2px dashed #000000 !important;
      outline-offset: 3px !important;
    }
    [data-edit-id].avi-studio-selected {
      outline: 2px solid #000000 !important;
      outline-offset: 4px !important;
      box-shadow: 0 0 0 4px rgba(0,0,0,0.15) !important;
    }
  `;
  document.head.appendChild(styleEl);

  // Listen for clicks on editable elements
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-edit-id]');
    if (!target) return;

    e.preventDefault();
    e.stopPropagation();

    // Mark active selection
    document.querySelectorAll('.avi-studio-selected').forEach(el => el.classList.remove('avi-studio-selected'));
    target.classList.add('avi-studio-selected');

    const editId = target.getAttribute('data-edit-id');
    const computed = window.getComputedStyle(target);

    // Send element metadata back to Admin Studio
    window.parent.postMessage({
      type: 'AVI_STUDIO_ELEMENT_CLICKED',
      elementId: editId,
      tagName: target.tagName.toLowerCase(),
      textContent: target.innerText || '',
      fontSize: computed.fontSize,
      fontFamily: computed.fontFamily,
      color: computed.color,
      backgroundColor: computed.backgroundColor,
      textAlign: computed.textAlign,
      padding: computed.padding,
      margin: computed.margin
    }, '*');
  }, true);

  // Handle messages from Admin Studio Parent
  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || typeof data !== 'object') return;

    switch (data.type) {
      case 'AVI_STUDIO_HANDSHAKE':
        window.parent.postMessage({
          type: 'AVI_STUDIO_READY',
          currentUrl: window.location.href,
          availableEditIds: Array.from(document.querySelectorAll('[data-edit-id]')).map(el => el.getAttribute('data-edit-id'))
        }, '*');
        break;

      case 'AVI_STUDIO_NAVIGATE':
        if (data.viewId && onNavigate) {
          onNavigate(data.viewId);
        }
        break;

      case 'AVI_STUDIO_SELECT':
        document.querySelectorAll('.avi-studio-selected').forEach(el => el.classList.remove('avi-studio-selected'));
        if (data.elementId) {
          const el = document.querySelector(`[data-edit-id="${data.elementId}"]`);
          if (el) {
            el.classList.add('avi-studio-selected');
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        break;

      case 'AVI_STUDIO_UPDATE_CONTENT':
        if (data.elementId && data.content !== undefined) {
          const el = document.querySelector(`[data-edit-id="${data.elementId}"]`);
          if (el) {
            el.innerHTML = data.content;
          }
        }
        break;

      case 'AVI_STUDIO_UPDATE_STYLE':
        if (data.elementId && data.styles) {
          const el = document.querySelector(`[data-edit-id="${data.elementId}"]`);
          if (el) {
            Object.assign(el.style, data.styles);
          }
        }
        break;

      default:
        break;
    }
  });

  // Announce ready after mount
  setTimeout(() => {
    window.parent.postMessage({
      type: 'AVI_STUDIO_READY',
      currentUrl: window.location.href,
      availableEditIds: Array.from(document.querySelectorAll('[data-edit-id]')).map(el => el.getAttribute('data-edit-id'))
    }, '*');
  }, 400);
}

// Helper to apply stored published overrides across reloads
export function applyStoredOverrides() {
  try {
    const raw = localStorage.getItem('avi_site_overrides');
    if (!raw) return;
    const overrides = JSON.parse(raw);
    Object.keys(overrides).forEach(elementId => {
      const data = overrides[elementId];
      const el = document.querySelector(`[data-edit-id="${elementId}"]`);
      if (el) {
        if (data.content !== undefined) el.innerHTML = data.content;
        if (data.styles) Object.assign(el.style, data.styles);
      }
    });
  } catch (err) {
    console.warn('Failed to apply stored studio overrides:', err);
  }
}
