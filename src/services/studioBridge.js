// Avi Jewelers USA — Universal Visual Studio Bridge
// Enables 100% full-site editing on EVERY element (text, heading, image, background, icon, button, container)

let activeSelectedElement = null;
let currentOverridesCache = {};

export function initStudioBridge(onNavigate) {
  const isEmbedded = window.self !== window.top || window.location.search.includes('preview=true');

  // Load and apply stored overrides on all modes (live & preview)
  applyStoredOverrides();
  setupPersistentObserver();

  if (!isEmbedded) return;

  // Inject luxury visual studio outline styles
  injectStudioStyles();

  // Mouse hover highlighting
  setupHoverListener();

  // Universal Click-to-Inspect listener
  setupClickListener();

  // Universal Double-Click Inline Editor
  setupDoubleClickListener();

  // Studio Parent Message Dispatcher
  setupMessageDispatcher(onNavigate);

  // Announce ready to parent studio
  announceReady();
}

// 1. STYLES
function injectStudioStyles() {
  if (document.getElementById('avi-studio-inspector-styles')) return;
  const styleEl = document.createElement('style');
  styleEl.id = 'avi-studio-inspector-styles';
  styleEl.innerHTML = `
    .avi-studio-hover-target {
      outline: 2px dashed #000000 !important;
      outline-offset: 2px !important;
      cursor: pointer !important;
      transition: outline 0.1s ease !important;
    }
    .avi-studio-selected {
      outline: 2px solid #000000 !important;
      outline-offset: 3px !important;
      box-shadow: 0 0 0 4px rgba(0,0,0,0.2) !important;
      position: relative !important;
    }
    .avi-studio-inline-editing {
      outline: 2px solid #000000 !important;
      background: rgba(255, 255, 255, 0.96) !important;
      color: #000000 !important;
      padding: 2px 6px !important;
      border-radius: 2px !important;
      min-width: 20px !important;
    }
  `;
  document.head.appendChild(styleEl);
}

// 2. HOVER LISTENER
function setupHoverListener() {
  let lastHoverEl = null;
  document.addEventListener('mouseover', (e) => {
    let el = e.target;
    if (!el || el === document.body || el === document.documentElement) return;
    
    // Normalize SVG children to SVG element for cleaner hover
    if (el.tagName.toLowerCase() === 'path' || el.tagName.toLowerCase() === 'circle' || el.tagName.toLowerCase() === 'polygon') {
      el = el.closest('svg') || el;
    }

    if (el.classList.contains('avi-studio-selected')) return;

    if (lastHoverEl && lastHoverEl !== el) {
      lastHoverEl.classList.remove('avi-studio-hover-target');
    }
    el.classList.add('avi-studio-hover-target');
    lastHoverEl = el;
  }, true);

  document.addEventListener('mouseout', (e) => {
    if (e.target && e.target.classList) {
      e.target.classList.remove('avi-studio-hover-target');
    }
  }, true);
}

// 3. CLICK LISTENER
function setupClickListener() {
  document.addEventListener('click', (e) => {
    let target = e.target;
    if (!target || target === document.body || target === document.documentElement) return;

    // Prevent default navigation so links don't unload studio iframe
    e.preventDefault();
    e.stopPropagation();

    // If target is inside an SVG (like a <path>), target the <svg>
    if (['path', 'polygon', 'circle', 'rect', 'line', 'g'].includes(target.tagName.toLowerCase())) {
      target = target.closest('svg') || target;
    }

    selectAndInspectElement(target);
  }, true);
}

// 4. DOUBLE CLICK INLINE EDITING
function setupDoubleClickListener() {
  document.addEventListener('dblclick', (e) => {
    let target = e.target;
    if (!target) return;

    const tag = target.tagName.toLowerCase();
    const isText = ['h1','h2','h3','h4','h5','h6','p','span','strong','em','b','i','a','button','label','li','small','dt','dd','blockquote'].includes(tag)
      || (target.childNodes.length === 1 && target.childNodes[0].nodeType === Node.TEXT_NODE);

    if (isText) {
      e.preventDefault();
      e.stopPropagation();
      target.contentEditable = 'true';
      target.classList.add('avi-studio-inline-editing');
      target.focus();

      // Realtime typing sync
      const onInput = () => {
        const uid = getOrAssignElementId(target);
        window.parent.postMessage({
          type: 'AVI_STUDIO_INLINE_CHANGE',
          elementId: uid,
          content: target.innerHTML,
          textContent: target.innerText
        }, '*');
      };
      target.addEventListener('input', onInput);

      const onBlur = () => {
        target.contentEditable = 'false';
        target.classList.remove('avi-studio-inline-editing');
        target.removeEventListener('input', onInput);
        target.removeEventListener('blur', onBlur);

        const uid = getOrAssignElementId(target);
        const selector = generateElementSelector(target);

        storeSingleOverride(uid, {
          content: target.innerHTML,
          selector
        });

        window.parent.postMessage({
          type: 'AVI_STUDIO_INLINE_CHANGE',
          elementId: uid,
          content: target.innerHTML,
          textContent: target.innerText,
          final: true
        }, '*');
      };

      target.addEventListener('blur', onBlur);
    }
  }, true);
}

// 5. MESSAGE DISPATCHER FROM ADMIN STUDIO
function setupMessageDispatcher(onNavigate) {
  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || typeof data !== 'object') return;

    switch (data.type) {
      case 'AVI_STUDIO_HANDSHAKE':
        announceReady();
        break;

      case 'AVI_STUDIO_NAVIGATE':
        if (data.viewId && onNavigate) {
          onNavigate(data.viewId);
          setTimeout(() => {
            applyStoredOverrides();
            announceReady();
          }, 150);
        }
        break;

      case 'AVI_STUDIO_SELECT':
        if (data.elementId) {
          const el = findElementByUid(data.elementId, data.selector);
          if (el) {
            selectAndInspectElement(el, false);
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        break;

      case 'AVI_STUDIO_UPDATE_CONTENT':
        if (data.elementId && data.content !== undefined) {
          const el = findElementByUid(data.elementId, data.selector);
          if (el) {
            el.innerHTML = data.content;
            storeSingleOverride(data.elementId, { 
              content: data.content,
              selector: data.selector || generateElementSelector(el)
            });
          }
        }
        break;

      case 'AVI_STUDIO_UPDATE_IMAGE_SRC':
        if (data.elementId && data.src) {
          const el = findElementByUid(data.elementId, data.selector);
          if (el) {
            if (el.tagName.toLowerCase() === 'img') {
              el.src = data.src;
            } else {
              el.style.backgroundImage = `url("${data.src}")`;
            }
            storeSingleOverride(data.elementId, { 
              src: data.src,
              selector: data.selector || generateElementSelector(el)
            });
          }
        }
        break;

      case 'AVI_STUDIO_UPDATE_BG_IMAGE':
        if (data.elementId) {
          const el = findElementByUid(data.elementId, data.selector);
          if (el) {
            if (data.bgUrl) {
              el.style.backgroundImage = `url("${data.bgUrl}")`;
              if (data.bgSize) el.style.backgroundSize = data.bgSize;
              if (data.bgPos) el.style.backgroundPosition = data.bgPos;
              if (data.bgRepeat) el.style.backgroundRepeat = data.bgRepeat;
            } else {
              el.style.backgroundImage = 'none';
            }
            storeSingleOverride(data.elementId, { 
              bgUrl: data.bgUrl || '',
              bgSize: data.bgSize || 'cover',
              bgPos: data.bgPos || 'center',
              selector: data.selector || generateElementSelector(el)
            });
          }
        }
        break;

      case 'AVI_STUDIO_UPDATE_BG_COLOR':
        if (data.elementId && data.bgColor !== undefined) {
          const el = findElementByUid(data.elementId, data.selector);
          if (el) {
            el.style.backgroundColor = data.bgColor;
            storeSingleOverride(data.elementId, {
              bgColor: data.bgColor,
              selector: data.selector || generateElementSelector(el)
            });
          }
        }
        break;

      case 'AVI_STUDIO_UPDATE_ICON':
        if (data.elementId && data.icon) {
          const el = findElementByUid(data.elementId, data.selector);
          if (el) {
            const svg = el.tagName.toLowerCase() === 'svg' ? el : el.querySelector('svg');
            if (svg) {
              if (data.icon.fill) svg.style.fill = data.icon.fill;
              if (data.icon.stroke) svg.style.stroke = data.icon.stroke;
              if (data.icon.width) svg.setAttribute('width', data.icon.width);
              if (data.icon.height) svg.setAttribute('height', data.icon.height);
              if (data.icon.strokeWidth) svg.setAttribute('stroke-width', data.icon.strokeWidth);
            }
            storeSingleOverride(data.elementId, {
              icon: data.icon,
              selector: data.selector || generateElementSelector(el)
            });
          }
        }
        break;

      case 'AVI_STUDIO_UPDATE_STYLE':
        if (data.elementId && data.styles) {
          const el = findElementByUid(data.elementId, data.selector);
          if (el) {
            Object.assign(el.style, data.styles);
            storeSingleOverride(data.elementId, { 
              styles: data.styles,
              selector: data.selector || generateElementSelector(el)
            });
          }
        }
        break;

      case 'AVI_STUDIO_UPDATE_ATTR':
        if (data.elementId && data.attribute && data.value !== undefined) {
          const el = findElementByUid(data.elementId, data.selector);
          if (el) {
            el.setAttribute(data.attribute, data.value);
            storeSingleOverride(data.elementId, { 
              attributes: { [data.attribute]: data.value },
              selector: data.selector || generateElementSelector(el)
            });
          }
        }
        break;

      case 'AVI_STUDIO_RESET_ELEMENT':
        if (data.elementId) {
          removeSingleOverride(data.elementId);
          window.location.reload();
        }
        break;

      default:
        break;
    }
  });
}

// 6. SELECT AND INSPECT ELEMENT
function selectAndInspectElement(target, notifyParent = true) {
  document.querySelectorAll('.avi-studio-selected').forEach(el => el.classList.remove('avi-studio-selected'));
  target.classList.add('avi-studio-selected');
  activeSelectedElement = target;

  const uid = getOrAssignElementId(target);
  const selector = generateElementSelector(target);
  const tag = target.tagName.toLowerCase();
  const computed = window.getComputedStyle(target);

  // Classify element type
  let elementType = 'container';
  if (tag === 'img') {
    elementType = 'image';
  } else if (['h1','h2','h3','h4','h5','h6'].includes(tag)) {
    elementType = 'heading';
  } else if (['p','span','em','strong','b','i','label','li','small','dt','dd','blockquote'].includes(tag)) {
    elementType = 'text';
  } else if (tag === 'button' || (tag === 'a' && target.classList.contains('btn')) || target.getAttribute('role') === 'button') {
    elementType = 'button';
  } else if (tag === 'a') {
    elementType = 'link';
  } else if (tag === 'svg' || target.querySelector('svg')) {
    elementType = 'icon';
  } else if (['section','header','footer','nav','main','article','aside'].includes(tag)) {
    elementType = 'section';
  } else if (computed.backgroundImage && computed.backgroundImage !== 'none') {
    elementType = 'background';
  }

  // Extract clean background image URL
  let bgCleanUrl = '';
  if (computed.backgroundImage && computed.backgroundImage.includes('url(')) {
    const match = computed.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
    if (match && match[1]) bgCleanUrl = match[1];
  }

  // Extract icon info if SVG
  let iconFill = '';
  let iconStroke = '';
  let iconWidth = '';
  let iconHeight = '';
  let iconStrokeWidth = '';
  const svgEl = tag === 'svg' ? target : target.querySelector('svg');
  if (svgEl) {
    iconFill = svgEl.getAttribute('fill') || computed.fill || '';
    iconStroke = svgEl.getAttribute('stroke') || computed.stroke || '';
    iconWidth = svgEl.getAttribute('width') || '';
    iconHeight = svgEl.getAttribute('height') || '';
    iconStrokeWidth = svgEl.getAttribute('stroke-width') || '';
  }

  // Generate parent breadcrumbs hierarchy
  const breadcrumbs = [];
  let curr = target;
  while (curr && curr !== document.body && curr !== document.documentElement) {
    const currUid = getOrAssignElementId(curr);
    const currTag = curr.tagName.toLowerCase();
    let label = curr.getAttribute('data-edit-id') || curr.id || currTag;
    if (curr.className && typeof curr.className === 'string') {
      const cls = curr.className.split(' ').filter(c => !c.startsWith('avi-studio'))[0];
      if (cls) label += '.' + cls;
    }
    breadcrumbs.unshift({
      id: currUid,
      selector: generateElementSelector(curr),
      tag: currTag,
      label
    });
    curr = curr.parentElement;
  }

  const payload = {
    type: 'AVI_STUDIO_ELEMENT_CLICKED',
    elementId: uid,
    selector,
    elementType,
    tagName: tag,
    textContent: target.innerText || '',
    innerHTML: target.innerHTML || '',
    src: tag === 'img' ? target.src : '',
    alt: tag === 'img' ? (target.alt || '') : '',
    objectFit: computed.objectFit || 'cover',
    bgImage: bgCleanUrl,
    bgColor: computed.backgroundColor,
    bgSize: computed.backgroundSize || 'cover',
    bgPos: computed.backgroundPosition || 'center',
    href: target.getAttribute('href') || '',
    target: target.getAttribute('target') || '',
    iconFill,
    iconStroke,
    iconWidth,
    iconHeight,
    iconStrokeWidth,
    fontSize: computed.fontSize,
    fontFamily: computed.fontFamily,
    fontWeight: computed.fontWeight,
    color: computed.color,
    textAlign: computed.textAlign,
    lineHeight: computed.lineHeight,
    letterSpacing: computed.letterSpacing,
    padding: computed.padding,
    margin: computed.margin,
    borderRadius: computed.borderRadius,
    border: computed.border,
    opacity: computed.opacity,
    breadcrumbs
  };

  if (notifyParent) {
    window.parent.postMessage(payload, '*');
  }
}

// 7. DETERMINISTIC IDENTIFIERS & CSS SELECTORS
export function getOrAssignElementId(el) {
  if (el.getAttribute('data-edit-id')) {
    return el.getAttribute('data-edit-id');
  }
  if (el.getAttribute('data-avi-uid')) {
    return el.getAttribute('data-avi-uid');
  }
  if (el.id) {
    return el.id;
  }

  const selector = generateElementSelector(el);
  const uid = 'avi-' + btoa(selector).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
  el.setAttribute('data-avi-uid', uid);
  return uid;
}

export function generateElementSelector(el) {
  if (el.getAttribute('data-edit-id')) {
    return `[data-edit-id="${el.getAttribute('data-edit-id')}"]`;
  }
  if (el.id) {
    return `#${CSS.escape(el.id)}`;
  }

  const path = [];
  let curr = el;
  while (curr && curr.nodeType === Node.ELEMENT_NODE && curr !== document.documentElement && curr !== document.body) {
    if (curr.getAttribute('data-edit-id')) {
      path.unshift(`[data-edit-id="${curr.getAttribute('data-edit-id')}"]`);
      break;
    }
    if (curr.id) {
      path.unshift(`#${CSS.escape(curr.id)}`);
      break;
    }

    const tag = curr.tagName.toLowerCase();
    let sibling = curr;
    let nth = 1;
    while ((sibling = sibling.previousElementSibling)) {
      if (sibling.tagName.toLowerCase() === tag) nth++;
    }
    path.unshift(`${tag}:nth-of-type(${nth})`);

    // Stop at major landmarks
    if (['header', 'footer', 'main', 'nav', 'section'].includes(tag)) {
      break;
    }
    curr = curr.parentElement;
  }

  return path.join(' > ');
}

// 8. ROBUST FIND ELEMENT
export function findElementByUid(uid, selectorFallback) {
  if (!uid) return null;
  try {
    // 1. By data-edit-id
    let el = document.querySelector(`[data-edit-id="${CSS.escape(uid)}"]`);
    if (el) return el;

    // 2. By data-avi-uid
    el = document.querySelector(`[data-avi-uid="${CSS.escape(uid)}"]`);
    if (el) return el;

    // 3. By HTML id
    el = document.getElementById(uid);
    if (el) return el;

    // 4. By selectorFallback
    if (selectorFallback) {
      el = document.querySelector(selectorFallback);
      if (el) return el;
    }

    // 5. Try uid as raw selector
    el = document.querySelector(uid);
    if (el) return el;
  } catch (err) {
    // Suppress CSS escape errors
  }
  return null;
}

// 9. OVERRIDES STORAGE & SYNCHRONIZATION
function storeSingleOverride(elementId, changes) {
  try {
    const raw = localStorage.getItem('avi_site_overrides');
    const overrides = raw ? JSON.parse(raw) : {};
    overrides[elementId] = {
      ...(overrides[elementId] || {}),
      ...changes
    };
    currentOverridesCache = overrides;
    localStorage.setItem('avi_site_overrides', JSON.stringify(overrides));
  } catch (e) {
    console.warn('Error storing override:', e);
  }
}

function removeSingleOverride(elementId) {
  try {
    const raw = localStorage.getItem('avi_site_overrides');
    if (!raw) return;
    const overrides = JSON.parse(raw);
    delete overrides[elementId];
    currentOverridesCache = overrides;
    localStorage.setItem('avi_site_overrides', JSON.stringify(overrides));
  } catch (e) {
    console.warn('Error removing override:', e);
  }
}

// 10. APPLY STORED OVERRIDES
export function applyStoredOverrides() {
  try {
    const raw = localStorage.getItem('avi_site_overrides');
    if (!raw) return;
    const overrides = JSON.parse(raw);
    currentOverridesCache = overrides;

    Object.keys(overrides).forEach(elementId => {
      const data = overrides[elementId];
      const el = findElementByUid(elementId, data.selector);
      if (!el) return;

      // Assign data-avi-uid so subsequent queries are instant
      el.setAttribute('data-avi-uid', elementId);

      // Apply content
      if (data.content !== undefined) {
        el.innerHTML = data.content;
      }

      // Apply Image src
      if (data.src) {
        if (el.tagName.toLowerCase() === 'img') {
          el.src = data.src;
        } else {
          el.style.backgroundImage = `url("${data.src}")`;
        }
      }

      // Apply Background Image
      if (data.bgUrl !== undefined) {
        if (data.bgUrl) {
          el.style.backgroundImage = `url("${data.bgUrl}")`;
          if (data.bgSize) el.style.backgroundSize = data.bgSize;
          if (data.bgPos) el.style.backgroundPosition = data.bgPos;
        } else {
          el.style.backgroundImage = 'none';
        }
      }

      // Apply Background Color
      if (data.bgColor !== undefined) {
        el.style.backgroundColor = data.bgColor;
      }

      // Apply Icon styles
      if (data.icon) {
        const svg = el.tagName.toLowerCase() === 'svg' ? el : el.querySelector('svg');
        if (svg) {
          if (data.icon.fill) svg.style.fill = data.icon.fill;
          if (data.icon.stroke) svg.style.stroke = data.icon.stroke;
          if (data.icon.width) svg.setAttribute('width', data.icon.width);
          if (data.icon.height) svg.setAttribute('height', data.icon.height);
          if (data.icon.strokeWidth) svg.setAttribute('stroke-width', data.icon.strokeWidth);
        }
      }

      // Apply CSS styles
      if (data.styles) {
        Object.assign(el.style, data.styles);
      }

      // Apply HTML attributes
      if (data.attributes) {
        Object.keys(data.attributes).forEach(attr => {
          el.setAttribute(attr, data.attributes[attr]);
        });
      }
    });
  } catch (err) {
    console.warn('Failed to apply stored studio overrides:', err);
  }
}

// 11. MUTATION OBSERVER (DEBOUNCED)
let observerDebounce = null;
function setupPersistentObserver() {
  const observer = new MutationObserver((mutations) => {
    // Avoid infinite loops triggered by our own inline-editing or style class additions
    const shouldIgnore = mutations.every(m => 
      m.target && m.target.classList && (
        m.target.classList.contains('avi-studio-selected') ||
        m.target.classList.contains('avi-studio-hover-target') ||
        m.target.classList.contains('avi-studio-inline-editing')
      )
    );
    if (shouldIgnore) return;

    if (observerDebounce) clearTimeout(observerDebounce);
    observerDebounce = setTimeout(() => {
      applyStoredOverrides();
    }, 60);
  });

  observer.observe(document.body, { childList: true, subtree: true, attributes: false });
}

// 12. ANNOUNCE READY & COLLECT SECTIONS
function announceReady() {
  window.parent.postMessage({
    type: 'AVI_STUDIO_READY',
    currentUrl: window.location.href,
    sections: collectPageSections()
  }, '*');
}

function collectPageSections() {
  const sections = [];
  document.querySelectorAll('header, section, footer, [data-edit-id]').forEach((sec, idx) => {
    const label = sec.getAttribute('data-edit-id') || sec.id || sec.className?.split?.(' ')?.[0] || sec.tagName.toLowerCase() + ` (#${idx + 1})`;
    sections.push({
      id: sec.getAttribute('data-edit-id') || getOrAssignElementId(sec),
      selector: generateElementSelector(sec),
      tag: sec.tagName.toLowerCase(),
      label
    });
  });
  return sections;
}
