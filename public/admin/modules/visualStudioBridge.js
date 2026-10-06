// Avi Jewelers — Elementor-Style Visual Studio Bridge (ES6 Module)
import { supabaseAdapter } from './supabaseClient.js';
import { storageAdapter } from './storageAdapter.js';

export const STORE_PAGES = [
  { id: 'home', label: 'Home — Atelier Showcase', path: '/' },
  { id: 'custom', label: 'Custom Atelier / Design Your Ring', path: '/#custom' },
  { id: 'shop', label: 'Shop / Fine Collections', path: '/#shop' },
  { id: 'product-detail', label: 'Product Details (PDP)', path: '/#product-detail' },
  { id: 'about', label: 'About Avi Jewelers', path: '/#about' },
  { id: 'contact', label: 'Contact & Consultation', path: '/#contact' },
  { id: 'policies', label: 'Atelier Policies & Warranty', path: '/#policies' },
  { id: 'checkout', label: 'Checkout (Presentation Mode)', path: '/#checkout' },
  { id: 'account', label: 'Client Portal (Preview Mode)', path: '/#account' }
];

class VisualStudioBridge {
  constructor() {
    this.currentPage = 'home';
    this.currentBreakpoint = 'desktop'; // desktop | laptop | tablet | mobile
    this.selectedElementId = null;
    this.iframeElement = null;
    this.overrides = storageAdapter.getItem('site_overrides', {});
    this.draftOverrides = { ...this.overrides };
    this.historyStack = [];
    this.historyIndex = -1;
    this.elementTree = [];
    this.listeners = [];

    this.setupWindowListener();
  }

  setIframe(iframe) {
    this.iframeElement = iframe;
    this.handshake();
  }

  handshake() {
    if (!this.iframeElement || !this.iframeElement.contentWindow) return;
    this.iframeElement.contentWindow.postMessage({ type: 'AVI_STUDIO_HANDSHAKE' }, '*');
  }

  setupWindowListener() {
    window.addEventListener('message', (event) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'AVI_STUDIO_READY') {
        this.elementTree = data.availableEditIds || [];
        this.applyAllOverridesToIframe();
        this.notify('ready');
      }

      if (data.type === 'AVI_STUDIO_ELEMENT_CLICKED') {
        this.selectedElementId = data.elementId;
        this.notify('element_selected', data);
      }
    });
  }

  setPage(pageId) {
    this.currentPage = pageId;
    if (this.iframeElement && this.iframeElement.contentWindow) {
      this.iframeElement.contentWindow.postMessage({
        type: 'AVI_STUDIO_NAVIGATE',
        viewId: pageId
      }, '*');
    }
    this.notify('page_changed', pageId);
  }

  setBreakpoint(bp) {
    this.currentBreakpoint = bp;
    this.notify('breakpoint_changed', bp);
  }

  selectElement(elementId) {
    this.selectedElementId = elementId;
    if (this.iframeElement && this.iframeElement.contentWindow) {
      this.iframeElement.contentWindow.postMessage({
        type: 'AVI_STUDIO_SELECT',
        elementId
      }, '*');
    }
    this.notify('element_selected', { elementId });
  }

  updateElementContent(elementId, content) {
    if (!this.draftOverrides[elementId]) this.draftOverrides[elementId] = {};
    this.draftOverrides[elementId].content = content;

    // Send to iframe
    if (this.iframeElement && this.iframeElement.contentWindow) {
      this.iframeElement.contentWindow.postMessage({
        type: 'AVI_STUDIO_UPDATE_CONTENT',
        elementId,
        content
      }, '*');
    }

    this.recordHistory();
    this.notify('draft_updated');
  }

  updateElementStyle(elementId, styles) {
    if (!this.draftOverrides[elementId]) this.draftOverrides[elementId] = {};
    if (!this.draftOverrides[elementId].styles) this.draftOverrides[elementId].styles = {};
    Object.assign(this.draftOverrides[elementId].styles, styles);

    // Send to iframe
    if (this.iframeElement && this.iframeElement.contentWindow) {
      this.iframeElement.contentWindow.postMessage({
        type: 'AVI_STUDIO_UPDATE_STYLE',
        elementId,
        styles: this.draftOverrides[elementId].styles
      }, '*');
    }

    this.recordHistory();
    this.notify('draft_updated');
  }

  applyAllOverridesToIframe() {
    Object.keys(this.draftOverrides).forEach(elId => {
      const item = this.draftOverrides[elId];
      if (item.content !== undefined) {
        this.iframeElement.contentWindow.postMessage({
          type: 'AVI_STUDIO_UPDATE_CONTENT',
          elementId: elId,
          content: item.content
        }, '*');
      }
      if (item.styles) {
        this.iframeElement.contentWindow.postMessage({
          type: 'AVI_STUDIO_UPDATE_STYLE',
          elementId: elId,
          styles: item.styles
        }, '*');
      }
    });
  }

  recordHistory() {
    this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);
    this.historyStack.push(JSON.stringify(this.draftOverrides));
    this.historyIndex = this.historyStack.length - 1;
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.draftOverrides = JSON.parse(this.historyStack[this.historyIndex]);
      this.applyAllOverridesToIframe();
      this.notify('draft_updated');
    }
  }

  redo() {
    if (this.historyIndex < this.historyStack.length - 1) {
      this.historyIndex++;
      this.draftOverrides = JSON.parse(this.historyStack[this.historyIndex]);
      this.applyAllOverridesToIframe();
      this.notify('draft_updated');
    }
  }

  saveDraft() {
    storageAdapter.setItem('site_overrides_draft', this.draftOverrides);
    return true;
  }

  async publishOverrides() {
    this.overrides = { ...this.draftOverrides };
    storageAdapter.setItem('site_overrides', this.overrides);
    // Also save in storefront accessible standard key
    localStorage.setItem('avi_site_overrides', JSON.stringify(this.overrides));

    // Sync to Supabase Cloud if online
    try {
      const records = Object.keys(this.overrides).map(elId => ({
        element_id: elId,
        page_key: this.currentPage,
        content: this.overrides[elId].content || '',
        styles: this.overrides[elId].styles || {},
        is_published: true
      }));

      for (const rec of records) {
        await supabaseAdapter.saveSiteOverride(rec).catch(() => null);
      }
    } catch (e) {
      console.warn('Could not sync published overrides to Supabase:', e);
    }

    this.notify('published');
    return true;
  }

  subscribe(fn) {
    this.listeners.push(fn);
  }

  notify(event, payload) {
    this.listeners.forEach(fn => fn(event, payload));
  }
}

export const visualStudioBridge = new VisualStudioBridge();
