// Avi Jewelers — Universal Visual Studio Bridge (ES6 Module)
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
    this.selectedElementSelector = null;
    this.selectedElementData = null;
    this.iframeElement = null;
    this.overrides = storageAdapter.getItem('site_overrides', {});
    this.draftOverrides = { ...this.overrides };
    this.historyStack = [];
    this.historyIndex = -1;
    this.sections = [];
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
        this.sections = data.sections || [];
        this.applyAllOverridesToIframe();
        this.notify('ready', this.sections);
      }

      if (data.type === 'AVI_STUDIO_ELEMENT_CLICKED') {
        this.selectedElementId = data.elementId;
        this.selectedElementSelector = data.selector;
        this.selectedElementData = data;
        this.notify('element_selected', data);
      }

      if (data.type === 'AVI_STUDIO_INLINE_CHANGE') {
        if (data.elementId) {
          if (!this.draftOverrides[data.elementId]) this.draftOverrides[data.elementId] = {};
          this.draftOverrides[data.elementId].content = data.content;
          if (data.final) {
            this.recordHistory();
          }
          this.notify('inline_change', data);
        }
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

  selectElement(elementId, selector = null) {
    this.selectedElementId = elementId;
    this.selectedElementSelector = selector;
    if (this.iframeElement && this.iframeElement.contentWindow) {
      this.iframeElement.contentWindow.postMessage({
        type: 'AVI_STUDIO_SELECT',
        elementId,
        selector
      }, '*');
    }
    this.notify('element_selected', { elementId, selector });
  }

  // Update text / heading content
  updateElementContent(elementId, content) {
    if (!this.draftOverrides[elementId]) this.draftOverrides[elementId] = {};
    this.draftOverrides[elementId].content = content;
    this.draftOverrides[elementId].selector = this.selectedElementSelector;

    if (this.iframeElement && this.iframeElement.contentWindow) {
      this.iframeElement.contentWindow.postMessage({
        type: 'AVI_STUDIO_UPDATE_CONTENT',
        elementId,
        selector: this.selectedElementSelector,
        content
      }, '*');
    }

    this.recordHistory();
    this.notify('draft_updated');
  }

  // Update image source (<img>)
  updateImageSrc(elementId, src) {
    if (!this.draftOverrides[elementId]) this.draftOverrides[elementId] = {};
    this.draftOverrides[elementId].src = src;
    this.draftOverrides[elementId].selector = this.selectedElementSelector;

    if (this.iframeElement && this.iframeElement.contentWindow) {
      this.iframeElement.contentWindow.postMessage({
        type: 'AVI_STUDIO_UPDATE_IMAGE_SRC',
        elementId,
        selector: this.selectedElementSelector,
        src
      }, '*');
    }

    this.recordHistory();
    this.notify('draft_updated');
  }

  // Update background image (CSS backgroundImage)
  updateBackgroundImage(elementId, bgUrl, bgSize = 'cover', bgPos = 'center') {
    if (!this.draftOverrides[elementId]) this.draftOverrides[elementId] = {};
    this.draftOverrides[elementId].bgUrl = bgUrl;
    this.draftOverrides[elementId].bgSize = bgSize;
    this.draftOverrides[elementId].bgPos = bgPos;
    this.draftOverrides[elementId].selector = this.selectedElementSelector;

    if (this.iframeElement && this.iframeElement.contentWindow) {
      this.iframeElement.contentWindow.postMessage({
        type: 'AVI_STUDIO_UPDATE_BG_IMAGE',
        elementId,
        selector: this.selectedElementSelector,
        bgUrl,
        bgSize,
        bgPos
      }, '*');
    }

    this.recordHistory();
    this.notify('draft_updated');
  }

  // Update background color
  updateBackgroundColor(elementId, bgColor) {
    if (!this.draftOverrides[elementId]) this.draftOverrides[elementId] = {};
    this.draftOverrides[elementId].bgColor = bgColor;
    this.draftOverrides[elementId].selector = this.selectedElementSelector;

    if (this.iframeElement && this.iframeElement.contentWindow) {
      this.iframeElement.contentWindow.postMessage({
        type: 'AVI_STUDIO_UPDATE_BG_COLOR',
        elementId,
        selector: this.selectedElementSelector,
        bgColor
      }, '*');
    }

    this.recordHistory();
    this.notify('draft_updated');
  }

  // Update icon SVG properties
  updateIconProperties(elementId, icon) {
    if (!this.draftOverrides[elementId]) this.draftOverrides[elementId] = {};
    this.draftOverrides[elementId].icon = {
      ...(this.draftOverrides[elementId].icon || {}),
      ...icon
    };
    this.draftOverrides[elementId].selector = this.selectedElementSelector;

    if (this.iframeElement && this.iframeElement.contentWindow) {
      this.iframeElement.contentWindow.postMessage({
        type: 'AVI_STUDIO_UPDATE_ICON',
        elementId,
        selector: this.selectedElementSelector,
        icon: this.draftOverrides[elementId].icon
      }, '*');
    }

    this.recordHistory();
    this.notify('draft_updated');
  }

  // Update CSS styles
  updateElementStyle(elementId, styles) {
    if (!this.draftOverrides[elementId]) this.draftOverrides[elementId] = {};
    if (!this.draftOverrides[elementId].styles) this.draftOverrides[elementId].styles = {};
    Object.assign(this.draftOverrides[elementId].styles, styles);
    this.draftOverrides[elementId].selector = this.selectedElementSelector;

    if (this.iframeElement && this.iframeElement.contentWindow) {
      this.iframeElement.contentWindow.postMessage({
        type: 'AVI_STUDIO_UPDATE_STYLE',
        elementId,
        selector: this.selectedElementSelector,
        styles: this.draftOverrides[elementId].styles
      }, '*');
    }

    this.recordHistory();
    this.notify('draft_updated');
  }

  // Update attributes (href, alt, target)
  updateAttribute(elementId, attribute, value) {
    if (!this.draftOverrides[elementId]) this.draftOverrides[elementId] = {};
    if (!this.draftOverrides[elementId].attributes) this.draftOverrides[elementId].attributes = {};
    this.draftOverrides[elementId].attributes[attribute] = value;
    this.draftOverrides[elementId].selector = this.selectedElementSelector;

    if (this.iframeElement && this.iframeElement.contentWindow) {
      this.iframeElement.contentWindow.postMessage({
        type: 'AVI_STUDIO_UPDATE_ATTR',
        elementId,
        selector: this.selectedElementSelector,
        attribute,
        value
      }, '*');
    }

    this.recordHistory();
    this.notify('draft_updated');
  }

  // Reset element overrides
  resetElement(elementId) {
    if (this.draftOverrides[elementId]) {
      delete this.draftOverrides[elementId];
    }
    if (this.overrides[elementId]) {
      delete this.overrides[elementId];
      storageAdapter.setItem('site_overrides', this.overrides);
      localStorage.setItem('avi_site_overrides', JSON.stringify(this.overrides));
    }

    if (this.iframeElement && this.iframeElement.contentWindow) {
      this.iframeElement.contentWindow.postMessage({
        type: 'AVI_STUDIO_RESET_ELEMENT',
        elementId
      }, '*');
    }

    this.recordHistory();
    this.notify('draft_updated');
  }

  applyAllOverridesToIframe() {
    if (!this.iframeElement || !this.iframeElement.contentWindow) return;

    Object.keys(this.draftOverrides).forEach(elId => {
      const item = this.draftOverrides[elId];
      if (item.content !== undefined) {
        this.iframeElement.contentWindow.postMessage({
          type: 'AVI_STUDIO_UPDATE_CONTENT',
          elementId: elId,
          selector: item.selector,
          content: item.content
        }, '*');
      }
      if (item.src) {
        this.iframeElement.contentWindow.postMessage({
          type: 'AVI_STUDIO_UPDATE_IMAGE_SRC',
          elementId: elId,
          selector: item.selector,
          src: item.src
        }, '*');
      }
      if (item.bgUrl !== undefined) {
        this.iframeElement.contentWindow.postMessage({
          type: 'AVI_STUDIO_UPDATE_BG_IMAGE',
          elementId: elId,
          selector: item.selector,
          bgUrl: item.bgUrl,
          bgSize: item.bgSize,
          bgPos: item.bgPos
        }, '*');
      }
      if (item.bgColor !== undefined) {
        this.iframeElement.contentWindow.postMessage({
          type: 'AVI_STUDIO_UPDATE_BG_COLOR',
          elementId: elId,
          selector: item.selector,
          bgColor: item.bgColor
        }, '*');
      }
      if (item.icon) {
        this.iframeElement.contentWindow.postMessage({
          type: 'AVI_STUDIO_UPDATE_ICON',
          elementId: elId,
          selector: item.selector,
          icon: item.icon
        }, '*');
      }
      if (item.styles) {
        this.iframeElement.contentWindow.postMessage({
          type: 'AVI_STUDIO_UPDATE_STYLE',
          elementId: elId,
          selector: item.selector,
          styles: item.styles
        }, '*');
      }
      if (item.attributes) {
        Object.keys(item.attributes).forEach(attr => {
          this.iframeElement.contentWindow.postMessage({
            type: 'AVI_STUDIO_UPDATE_ATTR',
            elementId: elId,
            selector: item.selector,
            attribute: attr,
            value: item.attributes[attr]
          }, '*');
        });
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
    localStorage.setItem('avi_site_overrides', JSON.stringify(this.overrides));

    // Sync to Supabase Cloud
    try {
      const records = Object.keys(this.overrides).map(elId => ({
        element_id: elId,
        page_key: this.currentPage,
        content: this.overrides[elId].content || '',
        styles: {
          ...(this.overrides[elId].styles || {}),
          src: this.overrides[elId].src,
          bgUrl: this.overrides[elId].bgUrl,
          bgColor: this.overrides[elId].bgColor,
          icon: this.overrides[elId].icon,
          selector: this.overrides[elId].selector,
          attributes: this.overrides[elId].attributes
        },
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
