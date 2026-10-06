// Avi Jewelers — Admin Studio Main Application Controller (ES6 Module)
import { authPinManager } from './modules/authPin.js';
import { supabaseAdapter } from './modules/supabaseClient.js';
import { visualStudioBridge, STORE_PAGES } from './modules/visualStudioBridge.js';
import { catalogManager } from './modules/catalogManager.js';
import { ordersManager } from './modules/ordersManager.js';
import { crmManager } from './modules/crmManager.js';
import { settingsManager } from './modules/settingsManager.js';

class AdminStudioApp {
  constructor() {
    this.currentView = 'overview';
    this.init();
  }

  async init() {
    this.setupAuth();
    this.setupNavigation();
    this.setupCloudStatus();
    this.setupModals();
    this.setupStudioControls();
    this.setupCatalogControls();
    this.setupOrdersControls();
    this.setupCrmControls();
    this.setupSettingsControls();
  }

  // Toast Helper
  showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'admin-toast';
    toast.innerHTML = `<span>✦</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // =========================================================================
  // AUTH & PIN LOCK
  // =========================================================================
  setupAuth() {
    const pinForm = document.getElementById('pin-form');
    const pinInput = document.getElementById('pin-input');
    const pinError = document.getElementById('pin-error');
    const pinScreen = document.getElementById('pin-lock-screen');
    const adminRoot = document.getElementById('admin-root');

    authPinManager.onAuthChange((isAuth) => {
      if (isAuth) {
        pinScreen.style.display = 'none';
        adminRoot.style.display = 'flex';
        this.renderAllViews();
      } else {
        pinScreen.style.display = 'flex';
        adminRoot.style.display = 'none';
        pinInput.value = '';
        pinInput.focus();
      }
    });

    pinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const val = pinInput.value;
      const res = await authPinManager.verifyPin(val);
      if (res.success) {
        pinError.style.display = 'none';
      } else {
        pinError.innerText = res.error;
        pinError.style.display = 'block';
        pinInput.value = '';
        pinInput.focus();
      }
    });

    document.getElementById('btn-lock-sidebar').addEventListener('click', () => {
      authPinManager.lockSession('User manual lock');
    });

    // Change PIN modal handlers
    const pinModal = document.getElementById('change-pin-modal');
    const btnChangePin = document.getElementById('btn-change-pin');
    const btnClosePinModal = document.getElementById('btn-close-pin-modal');
    const changePinForm = document.getElementById('change-pin-form');
    const changePinMsg = document.getElementById('change-pin-msg');

    btnChangePin.addEventListener('click', () => {
      pinModal.style.display = 'flex';
      changePinMsg.style.display = 'none';
    });
    btnClosePinModal.addEventListener('click', () => {
      pinModal.style.display = 'none';
    });

    changePinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const curr = document.getElementById('input-curr-pin').value;
      const next = document.getElementById('input-new-pin').value;
      const res = await authPinManager.changePin(curr, next);
      if (res.success) {
        this.showToast('Passcode updated successfully.');
        pinModal.style.display = 'none';
        changePinForm.reset();
      } else {
        changePinMsg.innerText = res.error;
        changePinMsg.style.display = 'block';
      }
    });
  }

  // =========================================================================
  // NAVIGATION & CLOUD BADGE
  // =========================================================================
  setupNavigation() {
    const navItems = document.querySelectorAll('.admin-nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const viewId = item.getAttribute('data-view');
        this.switchView(viewId);
      });
    });

    // Delegate inline navigation triggers
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-nav]');
      if (target) {
        const viewId = target.getAttribute('data-nav');
        this.switchView(viewId);
      }
    });
  }

  switchView(viewId) {
    this.currentView = viewId;

    // Update nav active classes
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-view') === viewId);
    });

    // Update Header title
    const titles = {
      overview: 'Overview Dashboard',
      studio: 'Visual Studio (Elementor-Style Bridge)',
      pages: 'Pages & View Templates Directory',
      products: 'Products Catalog (WooCommerce-Style)',
      inventory: 'Inventory & Stock Control',
      orders: 'Client Orders & Armored Dispatches',
      inquiries: 'Custom Inquiries & Bespoke CRM',
      appointments: 'Showroom & Zoom Consultations',
      settings: 'Atelier Settings & Backups'
    };
    document.getElementById('view-title').innerText = titles[viewId] || 'Admin Studio';

    // Toggle panels
    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.style.display = panel.id === `view-${viewId}` ? 'block' : 'none';
    });

    // Special view triggers
    if (viewId === 'studio') {
      const iframe = document.getElementById('studio-preview-iframe');
      visualStudioBridge.setIframe(iframe);
    }
  }

  setupCloudStatus() {
    const indicator = document.getElementById('cloud-indicator');
    const label = document.getElementById('cloud-status-text');

    supabaseAdapter.onStatusChange((status) => {
      label.innerText = `Supabase: ${status}`;
      if (status === 'Online') {
        indicator.className = 'status-indicator-dot';
      } else {
        indicator.className = 'status-indicator-dot offline';
      }
    });
  }

  // =========================================================================
  // VIEW RENDERERS
  // =========================================================================
  renderAllViews() {
    this.renderOverview();
    this.renderPages();
    this.renderProducts();
    this.renderInventory();
    this.renderOrders();
    this.renderInquiries();
    this.renderAppointments();
    this.updateCounters();
  }

  updateCounters() {
    document.getElementById('counter-products').innerText = catalogManager.products.length;
    document.getElementById('counter-orders').innerText = ordersManager.orders.length;
    document.getElementById('counter-inquiries').innerText = crmManager.inquiries.length;
    document.getElementById('counter-appointments').innerText = crmManager.appointments.length;
  }

  renderOverview() {
    // 1. Calculate metrics
    const totalSales = ordersManager.orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
    document.getElementById('metric-sales').innerText = `$${totalSales.toLocaleString()}`;
    document.getElementById('metric-orders').innerText = ordersManager.orders.length;
    document.getElementById('metric-inquiries').innerText = crmManager.inquiries.length;
    document.getElementById('metric-appts').innerText = crmManager.appointments.length;

    // 2. Overview Recent Orders Table
    const ordersTbl = document.getElementById('overview-orders-table');
    ordersTbl.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Order Ref</th>
            <th>Client</th>
            <th>Status</th>
            <th>Total (USD)</th>
          </tr>
        </thead>
        <tbody>
          ${ordersManager.orders.slice(0, 4).map(o => `
            <tr>
              <td><strong>${o.id}</strong></td>
              <td>${o.customer_name}</td>
              <td><span class="badge-monochrome badge-published">${o.fulfillment_status}</span></td>
              <td>$${Number(o.total).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // 3. Overview Inquiries
    const inqList = document.getElementById('overview-inquiries-list');
    inqList.innerHTML = crmManager.inquiries.slice(0, 3).map(i => `
      <div style="border-bottom: 1px solid var(--admin-border-subtle); padding: 10px 0;">
        <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600;">
          <span>${i.firstName} ${i.lastName}</span>
          <span class="badge-monochrome badge-pending">${i.status}</span>
        </div>
        <div style="font-size: 11px; color: var(--admin-text-muted); margin-top: 2px;">
          ${i.ringType || 'Bespoke'} • ${i.metal || 'Gold'} • ${i.budgetRange || ''}
        </div>
      </div>
    `).join('');
  }

  // =========================================================================
  // VISUAL STUDIO BRIDGE & INSPECTOR
  // =========================================================================
  setupStudioControls() {
    const pageSelect = document.getElementById('studio-page-select');
    pageSelect.innerHTML = STORE_PAGES.map(p => `<option value="${p.id}">${p.label}</option>`).join('');

    pageSelect.addEventListener('change', (e) => {
      visualStudioBridge.setPage(e.target.value);
    });

    // Breakpoints
    const frameContainer = document.getElementById('studio-frame-container');
    document.getElementById('bp-desktop').addEventListener('click', () => { frameContainer.style.width = '100%'; });
    document.getElementById('bp-laptop').addEventListener('click', () => { frameContainer.style.width = '1024px'; });
    document.getElementById('bp-tablet').addEventListener('click', () => { frameContainer.style.width = '768px'; });
    document.getElementById('bp-mobile').addEventListener('click', () => { frameContainer.style.width = '390px'; });

    // Undo / Redo
    document.getElementById('btn-studio-undo').addEventListener('click', () => visualStudioBridge.undo());
    document.getElementById('btn-studio-redo').addEventListener('click', () => visualStudioBridge.redo());

    // Save Draft & Publish
    document.getElementById('btn-studio-save-draft').addEventListener('click', () => {
      visualStudioBridge.saveDraft();
      this.showToast('Visual Studio drafts saved to local cache.');
    });

    document.getElementById('btn-studio-publish').addEventListener('click', async () => {
      await visualStudioBridge.publishOverrides();
      this.showToast('Overrides published live to storefront! ✦');
    });

    // Inspector Tabs
    const tabs = document.querySelectorAll('.inspector-tab');
    tabs.forEach(t => {
      t.addEventListener('click', () => {
        tabs.forEach(tab => tab.classList.remove('active'));
        t.classList.add('active');
        const tabId = t.getAttribute('data-tab');
        document.getElementById('tab-pane-content').style.display = tabId === 'content' ? 'block' : 'none';
        document.getElementById('tab-pane-style').style.display = tabId === 'style' ? 'block' : 'none';
        document.getElementById('tab-pane-advanced').style.display = tabId === 'advanced' ? 'block' : 'none';
      });
    });

    // Element Selection Listener from Iframe
    visualStudioBridge.subscribe((event, data) => {
      if (event === 'ready') {
        this.renderNavigatorList(data || visualStudioBridge.sections);
      }
      if (event === 'element_selected') {
        this.populateInspector(data);
      }
      if (event === 'inline_change') {
        const textInput = document.getElementById('inspector-text-input');
        if (textInput && visualStudioBridge.selectedElementId === data.elementId) {
          textInput.value = data.textContent || data.content || '';
        }
      }
    });

    // Reset Element Overrides button
    const btnReset = document.getElementById('btn-inspector-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (visualStudioBridge.selectedElementId && confirm('Reset custom edits on this element?')) {
          visualStudioBridge.resetElement(visualStudioBridge.selectedElementId);
        }
      });
    }

    // Content: Text / Heading input
    const textInput = document.getElementById('inspector-text-input');
    textInput.addEventListener('input', () => {
      if (visualStudioBridge.selectedElementId) {
        visualStudioBridge.updateElementContent(visualStudioBridge.selectedElementId, textInput.value);
      }
    });

    // Content: Image Src & Preview
    const imgSrcInput = document.getElementById('inspector-img-src');
    const imgPreview = document.getElementById('inspector-img-preview');
    imgSrcInput.addEventListener('input', () => {
      if (visualStudioBridge.selectedElementId) {
        visualStudioBridge.updateImageSrc(visualStudioBridge.selectedElementId, imgSrcInput.value);
        if (imgSrcInput.value) {
          imgPreview.src = imgSrcInput.value;
          imgPreview.style.display = 'block';
        } else {
          imgPreview.style.display = 'none';
        }
      }
    });

    // Content: Image Local File Upload
    const imgFileInput = document.getElementById('inspector-img-file');
    const btnUploadImg = document.getElementById('btn-upload-img');
    if (btnUploadImg && imgFileInput) {
      btnUploadImg.addEventListener('click', () => imgFileInput.click());
      imgFileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file && visualStudioBridge.selectedElementId) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target.result;
            imgSrcInput.value = dataUrl;
            imgPreview.src = dataUrl;
            imgPreview.style.display = 'block';
            visualStudioBridge.updateImageSrc(visualStudioBridge.selectedElementId, dataUrl);
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Content: Image Alt Text
    const imgAltInput = document.getElementById('inspector-img-alt');
    imgAltInput.addEventListener('input', () => {
      if (visualStudioBridge.selectedElementId) {
        visualStudioBridge.updateAttribute(visualStudioBridge.selectedElementId, 'alt', imgAltInput.value);
      }
    });

    // Content: Image Object Fit
    const imgFitSelect = document.getElementById('inspector-img-fit');
    imgFitSelect.addEventListener('change', () => {
      if (visualStudioBridge.selectedElementId) {
        visualStudioBridge.updateElementStyle(visualStudioBridge.selectedElementId, { objectFit: imgFitSelect.value });
      }
    });

    // Content: Background Image URL
    const bgSrcInput = document.getElementById('inspector-bg-src');
    const bgSizeSelect = document.getElementById('inspector-bg-size');
    const bgPosSelect = document.getElementById('inspector-bg-pos');

    bgSrcInput.addEventListener('input', () => {
      if (visualStudioBridge.selectedElementId) {
        visualStudioBridge.updateBackgroundImage(visualStudioBridge.selectedElementId, bgSrcInput.value, bgSizeSelect.value, bgPosSelect.value);
      }
    });

    // Content: Background Local File Upload
    const bgFileInput = document.getElementById('inspector-bg-file');
    const btnUploadBg = document.getElementById('btn-upload-bg');
    if (btnUploadBg && bgFileInput) {
      btnUploadBg.addEventListener('click', () => bgFileInput.click());
      bgFileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file && visualStudioBridge.selectedElementId) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target.result;
            bgSrcInput.value = dataUrl;
            visualStudioBridge.updateBackgroundImage(visualStudioBridge.selectedElementId, dataUrl, bgSizeSelect.value, bgPosSelect.value);
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Clear Background Image button
    const btnClearBg = document.getElementById('btn-clear-bg-img');
    if (btnClearBg) {
      btnClearBg.addEventListener('click', () => {
        if (visualStudioBridge.selectedElementId) {
          bgSrcInput.value = '';
          visualStudioBridge.updateBackgroundImage(visualStudioBridge.selectedElementId, '');
        }
      });
    }

    bgSizeSelect.addEventListener('change', () => {
      if (visualStudioBridge.selectedElementId) {
        visualStudioBridge.updateElementStyle(visualStudioBridge.selectedElementId, { backgroundSize: bgSizeSelect.value });
      }
    });

    bgPosSelect.addEventListener('change', () => {
      if (visualStudioBridge.selectedElementId) {
        visualStudioBridge.updateElementStyle(visualStudioBridge.selectedElementId, { backgroundPosition: bgPosSelect.value });
      }
    });

    // Content: Background Color
    const bgColorPicker = document.getElementById('inspector-bg-color-picker');
    const bgColorText = document.getElementById('inspector-bg-color-text');
    if (bgColorPicker && bgColorText) {
      bgColorPicker.addEventListener('input', () => {
        bgColorText.value = bgColorPicker.value;
        if (visualStudioBridge.selectedElementId) {
          visualStudioBridge.updateBackgroundColor(visualStudioBridge.selectedElementId, bgColorPicker.value);
        }
      });
      bgColorText.addEventListener('input', () => {
        if (visualStudioBridge.selectedElementId) {
          visualStudioBridge.updateBackgroundColor(visualStudioBridge.selectedElementId, bgColorText.value);
        }
      });
    }

    // Content: Icon / SVG properties
    const iconFillInput = document.getElementById('inspector-icon-fill');
    const iconStrokeInput = document.getElementById('inspector-icon-stroke');
    const iconSizeInput = document.getElementById('inspector-icon-size');
    const iconStrokeWidthInput = document.getElementById('inspector-icon-stroke-width');

    const updateIcon = () => {
      if (visualStudioBridge.selectedElementId) {
        visualStudioBridge.updateIconProperties(visualStudioBridge.selectedElementId, {
          fill: iconFillInput.value,
          stroke: iconStrokeInput.value,
          width: iconSizeInput.value,
          height: iconSizeInput.value,
          strokeWidth: iconStrokeWidthInput.value
        });
      }
    };
    if (iconFillInput) iconFillInput.addEventListener('input', updateIcon);
    if (iconStrokeInput) iconStrokeInput.addEventListener('input', updateIcon);
    if (iconSizeInput) iconSizeInput.addEventListener('input', updateIcon);
    if (iconStrokeWidthInput) iconStrokeWidthInput.addEventListener('input', updateIcon);

    // Content: Link / Href & Target
    const linkInput = document.getElementById('inspector-link-input');
    const linkTargetCheck = document.getElementById('inspector-link-target');
    linkInput.addEventListener('input', () => {
      if (visualStudioBridge.selectedElementId) {
        visualStudioBridge.updateAttribute(visualStudioBridge.selectedElementId, 'href', linkInput.value);
      }
    });
    if (linkTargetCheck) {
      linkTargetCheck.addEventListener('change', () => {
        if (visualStudioBridge.selectedElementId) {
          visualStudioBridge.updateAttribute(visualStudioBridge.selectedElementId, 'target', linkTargetCheck.checked ? '_blank' : '');
        }
      });
    }

    // Style: Font Size
    const fontSizeInput = document.getElementById('inspector-font-size');
    fontSizeInput.addEventListener('change', () => {
      if (visualStudioBridge.selectedElementId && fontSizeInput.value) {
        visualStudioBridge.updateElementStyle(visualStudioBridge.selectedElementId, { fontSize: fontSizeInput.value });
      }
    });

    // Style: Font Weight
    const fontWeightSelect = document.getElementById('inspector-font-weight');
    fontWeightSelect.addEventListener('change', () => {
      if (visualStudioBridge.selectedElementId) {
        visualStudioBridge.updateElementStyle(visualStudioBridge.selectedElementId, { fontWeight: fontWeightSelect.value });
      }
    });

    // Style: Font Family
    const fontFamilySelect = document.getElementById('inspector-font-family');
    fontFamilySelect.addEventListener('change', () => {
      if (visualStudioBridge.selectedElementId && fontFamilySelect.value !== 'inherit') {
        visualStudioBridge.updateElementStyle(visualStudioBridge.selectedElementId, { fontFamily: fontFamilySelect.value });
      }
    });

    // Style: Text Align
    const textAlignSelect = document.getElementById('inspector-text-align');
    textAlignSelect.addEventListener('change', () => {
      if (visualStudioBridge.selectedElementId) {
        visualStudioBridge.updateElementStyle(visualStudioBridge.selectedElementId, { textAlign: textAlignSelect.value });
      }
    });

    // Style: Text Color
    const colorPicker = document.getElementById('inspector-color-picker');
    const colorText = document.getElementById('inspector-color-text');
    const colorSelect = document.getElementById('inspector-color-select');

    if (colorPicker && colorText) {
      colorPicker.addEventListener('input', () => {
        colorText.value = colorPicker.value;
        if (visualStudioBridge.selectedElementId) {
          visualStudioBridge.updateElementStyle(visualStudioBridge.selectedElementId, { color: colorPicker.value });
        }
      });
      colorText.addEventListener('input', () => {
        if (visualStudioBridge.selectedElementId) {
          visualStudioBridge.updateElementStyle(visualStudioBridge.selectedElementId, { color: colorText.value });
        }
      });
    }
    if (colorSelect) {
      colorSelect.addEventListener('change', () => {
        if (visualStudioBridge.selectedElementId && colorSelect.value) {
          colorText.value = colorSelect.value;
          visualStudioBridge.updateElementStyle(visualStudioBridge.selectedElementId, { color: colorSelect.value });
        }
      });
    }

    // Style: Padding
    const paddingInput = document.getElementById('inspector-padding');
    paddingInput.addEventListener('change', () => {
      if (visualStudioBridge.selectedElementId && paddingInput.value) {
        visualStudioBridge.updateElementStyle(visualStudioBridge.selectedElementId, { padding: paddingInput.value });
      }
    });

    // Style: Margin
    const marginInput = document.getElementById('inspector-margin');
    marginInput.addEventListener('change', () => {
      if (visualStudioBridge.selectedElementId && marginInput.value) {
        visualStudioBridge.updateElementStyle(visualStudioBridge.selectedElementId, { margin: marginInput.value });
      }
    });

    // Style: Border Radius
    const radiusInput = document.getElementById('inspector-radius');
    radiusInput.addEventListener('change', () => {
      if (visualStudioBridge.selectedElementId && radiusInput.value) {
        visualStudioBridge.updateElementStyle(visualStudioBridge.selectedElementId, { borderRadius: radiusInput.value });
      }
    });

    // Style: Border
    const borderInput = document.getElementById('inspector-border');
    borderInput.addEventListener('change', () => {
      if (visualStudioBridge.selectedElementId && borderInput.value) {
        visualStudioBridge.updateElementStyle(visualStudioBridge.selectedElementId, { border: borderInput.value });
      }
    });

    // Style: Opacity
    const opacityInput = document.getElementById('inspector-opacity');
    const opacityVal = document.getElementById('inspector-opacity-val');
    opacityInput.addEventListener('input', () => {
      if (opacityVal) opacityVal.innerText = opacityInput.value;
      if (visualStudioBridge.selectedElementId) {
        visualStudioBridge.updateElementStyle(visualStudioBridge.selectedElementId, { opacity: opacityInput.value });
      }
    });

    // Advanced: Letter Spacing
    const letterSpacingInput = document.getElementById('inspector-letter-spacing');
    letterSpacingInput.addEventListener('change', () => {
      if (visualStudioBridge.selectedElementId) {
        visualStudioBridge.updateElementStyle(visualStudioBridge.selectedElementId, { letterSpacing: letterSpacingInput.value });
      }
    });

    // Advanced: Line Height
    const lineHeightInput = document.getElementById('inspector-line-height');
    lineHeightInput.addEventListener('change', () => {
      if (visualStudioBridge.selectedElementId) {
        visualStudioBridge.updateElementStyle(visualStudioBridge.selectedElementId, { lineHeight: lineHeightInput.value });
      }
    });

    // Advanced: Text Transform
    const transformSelect = document.getElementById('inspector-transform');
    transformSelect.addEventListener('change', () => {
      if (visualStudioBridge.selectedElementId) {
        visualStudioBridge.updateElementStyle(visualStudioBridge.selectedElementId, { textTransform: transformSelect.value });
      }
    });

    // Advanced: Raw CSS Style
    const rawStyleInput = document.getElementById('inspector-raw-style');
    if (rawStyleInput) {
      rawStyleInput.addEventListener('change', () => {
        if (visualStudioBridge.selectedElementId && rawStyleInput.value) {
          try {
            const parts = rawStyleInput.value.split(';').filter(Boolean);
            const styleObj = {};
            parts.forEach(p => {
              const [k, v] = p.split(':');
              if (k && v) {
                const camelKey = k.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
                styleObj[camelKey] = v.trim();
              }
            });
            visualStudioBridge.updateElementStyle(visualStudioBridge.selectedElementId, styleObj);
          } catch (err) {
            console.warn('Invalid raw style string');
          }
        }
      });
    }
  }

  populateInspector(data) {
    document.getElementById('inspector-no-selection').style.display = 'none';
    document.getElementById('inspector-controls').style.display = 'block';
    
    // Set Header Badge & ID
    const badge = document.getElementById('inspector-type-badge');
    badge.innerText = (data.elementType || data.tagName || 'ELEMENT').toUpperCase();
    document.getElementById('inspector-selected-id').innerText = data.elementId || 'Selected Element';

    // Populate Breadcrumbs
    const bc = document.getElementById('inspector-breadcrumbs');
    if (bc && data.breadcrumbs && data.breadcrumbs.length > 0) {
      bc.innerHTML = data.breadcrumbs.map((b, idx) => `
        <span style="background: #181818; border: 1px solid var(--admin-border); padding: 2px 6px; border-radius: 3px; cursor: pointer; color: ${b.id === data.elementId ? '#FFFFFF' : '#8C8C8C'}; font-weight: ${b.id === data.elementId ? '600' : '400'};" data-bc-id="${b.id}" data-bc-selector="${b.selector || ''}">
          ${b.label}
        </span>
      `).join('<span style="color:#444">/</span>');
      bc.querySelectorAll('[data-bc-id]').forEach(chip => {
        chip.addEventListener('click', () => {
          const id = chip.getAttribute('data-bc-id');
          const sel = chip.getAttribute('data-bc-selector');
          visualStudioBridge.selectElement(id, sel);
        });
      });
    }

    // Determine element characteristics
    const isImage = data.elementType === 'image' || data.tagName === 'img';
    const isIcon = data.elementType === 'icon' || data.tagName === 'svg';
    const isLink = data.elementType === 'link' || data.elementType === 'button' || Boolean(data.href);

    // Show/hide blocks
    document.getElementById('ctrl-text-block').style.display = (!isImage && !isIcon) ? 'block' : 'none';
    document.getElementById('ctrl-image-block').style.display = isImage ? 'block' : 'none';
    document.getElementById('ctrl-bg-block').style.display = 'block'; // Always available for all elements/containers
    document.getElementById('ctrl-icon-block').style.display = isIcon ? 'block' : 'none';
    document.getElementById('ctrl-link-block').style.display = isLink ? 'block' : 'none';

    // Populate Text
    const textInput = document.getElementById('inspector-text-input');
    textInput.value = data.textContent || '';

    // Populate Image
    if (isImage) {
      const imgSrc = document.getElementById('inspector-img-src');
      imgSrc.value = data.src || '';
      const imgPrev = document.getElementById('inspector-img-preview');
      if (data.src) {
        imgPrev.src = data.src;
        imgPrev.style.display = 'block';
      } else {
        imgPrev.style.display = 'none';
      }
      document.getElementById('inspector-img-alt').value = data.alt || '';
      if (data.objectFit) document.getElementById('inspector-img-fit').value = data.objectFit;
    }

    // Populate Background
    const bgSrc = document.getElementById('inspector-bg-src');
    bgSrc.value = data.bgImage || '';
    if (data.bgSize) document.getElementById('inspector-bg-size').value = data.bgSize;
    if (data.bgPos) document.getElementById('inspector-bg-pos').value = data.bgPos;
    const bgColorText = document.getElementById('inspector-bg-color-text');
    if (bgColorText) bgColorText.value = data.bgColor || '';

    // Populate Icon
    if (isIcon) {
      const iconFill = document.getElementById('inspector-icon-fill');
      if (iconFill) iconFill.value = data.iconFill || '';
      const iconStroke = document.getElementById('inspector-icon-stroke');
      if (iconStroke) iconStroke.value = data.iconStroke || '';
      const iconSize = document.getElementById('inspector-icon-size');
      if (iconSize) iconSize.value = data.iconWidth ? `${data.iconWidth}px` : '';
      const iconStrokeWidth = document.getElementById('inspector-icon-stroke-width');
      if (iconStrokeWidth) iconStrokeWidth.value = data.iconStrokeWidth || '';
    }

    // Populate Link / Href
    const linkInput = document.getElementById('inspector-link-input');
    linkInput.value = data.href || '';
    const linkTarget = document.getElementById('inspector-link-target');
    if (linkTarget) linkTarget.checked = (data.target === '_blank');

    // Populate Styles
    document.getElementById('inspector-font-size').value = data.fontSize || '';
    const colorText = document.getElementById('inspector-color-text');
    if (colorText) colorText.value = data.color || '';
    document.getElementById('inspector-padding').value = data.padding || '';
    document.getElementById('inspector-margin').value = data.margin || '';
    document.getElementById('inspector-radius').value = data.borderRadius || '';
    document.getElementById('inspector-border').value = data.border || '';
    document.getElementById('inspector-opacity').value = data.opacity || '1';
    const opacityVal = document.getElementById('inspector-opacity-val');
    if (opacityVal) opacityVal.innerText = data.opacity || '1.0';
    if (data.letterSpacing) document.getElementById('inspector-letter-spacing').value = data.letterSpacing;
    if (data.lineHeight) document.getElementById('inspector-line-height').value = data.lineHeight;
  }

  renderNavigatorList(sections) {
    const list = document.getElementById('inspector-navigator-list');
    if (!sections || sections.length === 0) {
      list.innerHTML = `<span style="color: var(--admin-text-muted);">Click on any element on the storefront to edit</span>`;
      return;
    }
    list.innerHTML = sections.map(s => `
      <div style="padding: 7px 10px; background-color: #141414; border: 1px solid var(--admin-border); border-radius: 3px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" data-nav-element="${s.id}">
        <span style="font-weight: 500;">${s.label || s.id}</span>
        <span style="font-size: 10px; color: var(--admin-text-muted); text-transform: uppercase;">${s.tag}</span>
      </div>
    `).join('');

    list.querySelectorAll('[data-nav-element]').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-nav-element');
        visualStudioBridge.selectElement(id);
      });
    });
  }

  // =========================================================================
  // PAGES DIRECTORY
  // =========================================================================
  renderPages() {
    const wrapper = document.getElementById('pages-table-wrapper');
    wrapper.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Page / Template</th>
            <th>Route ID</th>
            <th>Status</th>
            <th style="text-align: right;">Studio Action</th>
          </tr>
        </thead>
        <tbody>
          ${STORE_PAGES.map(p => `
            <tr>
              <td><strong>${p.label}</strong></td>
              <td><code>${p.path}</code></td>
              <td><span class="badge-monochrome badge-published">Published</span></td>
              <td style="text-align: right;">
                <button class="admin-btn admin-btn-secondary admin-btn-sm" data-edit-page="${p.id}">
                  Edit in Studio ✦
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    wrapper.querySelectorAll('[data-edit-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-edit-page');
        document.getElementById('studio-page-select').value = pId;
        this.switchView('studio');
        visualStudioBridge.setPage(pId);
      });
    });
  }

  // =========================================================================
  // PRODUCTS CATALOG & MODAL
  // =========================================================================
  setupCatalogControls() {
    const searchInput = document.getElementById('product-search');
    const categorySelect = document.getElementById('product-filter-category');

    searchInput.addEventListener('input', () => this.renderProducts());
    categorySelect.addEventListener('change', () => this.renderProducts());

    // Add Product Modal open
    document.getElementById('btn-add-product').addEventListener('click', () => {
      this.openProductModal(null);
    });

    document.getElementById('btn-close-product-modal').addEventListener('click', () => {
      document.getElementById('product-modal').style.display = 'none';
    });

    document.getElementById('btn-cancel-product').addEventListener('click', () => {
      document.getElementById('product-modal').style.display = 'none';
    });

    // Form submit
    document.getElementById('product-modal-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const productData = {
        id: document.getElementById('prod-form-id').value || undefined,
        title: document.getElementById('prod-form-title').value,
        name: document.getElementById('prod-form-title').value,
        category: document.getElementById('prod-form-category').value,
        shape: document.getElementById('prod-form-shape').value,
        price: parseFloat(document.getElementById('prod-form-price').value) || 0,
        compareAtPrice: parseFloat(document.getElementById('prod-form-compare-price').value) || undefined,
        stock_quantity: parseInt(document.getElementById('prod-form-stock').value, 10) || 10,
        stoneType: document.getElementById('prod-form-stone').value,
        badge: document.getElementById('prod-form-stone').value === 'lab-diamond' ? 'IGI Certified Lab Diamond' : 'GRA Certified Moissanite',
        carat: document.getElementById('prod-form-carat').value,
        leadTime: document.getElementById('prod-form-leadtime').value,
        primaryImage: document.getElementById('prod-form-image').value,
        description: document.getElementById('prod-form-description').value,
        isBestSeller: document.getElementById('prod-form-bestseller').checked,
        isFeatured: document.getElementById('prod-form-featured').checked
      };

      await catalogManager.saveProduct(productData);
      document.getElementById('product-modal').style.display = 'none';
      this.renderProducts();
      this.renderInventory();
      this.updateCounters();
      this.showToast('Product saved successfully.');
    });

    // CSV Export & Import
    document.getElementById('btn-export-csv').addEventListener('click', () => {
      const csv = catalogManager.exportCSV();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `avi_jewelers_catalog_${Date.now()}.csv`);
      link.click();
      this.showToast('CSV Export generated.');
    });

    const csvModal = document.getElementById('csv-modal');
    document.getElementById('btn-import-csv-open').addEventListener('click', () => {
      csvModal.style.display = 'flex';
    });
    document.getElementById('btn-close-csv-modal').addEventListener('click', () => {
      csvModal.style.display = 'none';
    });

    document.getElementById('btn-load-sample-csv').addEventListener('click', () => {
      document.getElementById('csv-paste-area').value = 
`title,category,shape,stoneType,price,compareAtPrice,sku,stock_quantity,carat,primaryImage
The Magnificent Oval Solitaire,engagement-rings,oval,lab-diamond,3400,4200,AVI-OVL-01,10,2.50 Carat,https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85
The Chicago Emerald Bezel,engagement-rings,emerald,moissanite,2200,2800,AVI-EMR-02,5,3.00 Carat,https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=800&q=85`;
    });

    document.getElementById('btn-run-csv-import').addEventListener('click', async () => {
      const text = document.getElementById('csv-paste-area').value;
      try {
        await catalogManager.importCSV(text);
        csvModal.style.display = 'none';
        this.renderProducts();
        this.renderInventory();
        this.updateCounters();
        this.showToast('CSV Imported successfully!');
      } catch (err) {
        alert(err.message);
      }
    });
  }

  renderProducts() {
    const query = (document.getElementById('product-search').value || '').toLowerCase();
    const cat = document.getElementById('product-filter-category').value;

    const filtered = catalogManager.products.filter(p => {
      const matchQ = (p.title || p.name || '').toLowerCase().includes(query) || (p.sku || '').toLowerCase().includes(query);
      const matchCat = cat === 'all' || p.category === cat;
      return matchQ && matchCat;
    });

    const wrapper = document.getElementById('products-table-wrapper');
    wrapper.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Jewelry Piece</th>
            <th>Category & Cut</th>
            <th>Stone / Badge</th>
            <th>Stock</th>
            <th>Price (USD)</th>
            <th>Featured</th>
            <th style="text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(p => `
            <tr>
              <td style="display: flex; align-items: center; gap: 10px;">
                <img src="${p.primaryImage}" alt="" style="width: 36px; height: 36px; object-fit: cover; border-radius: 3px; border: 1px solid var(--admin-border);">
                <div>
                  <div style="font-weight: 600;">${p.title || p.name}</div>
                  <div style="font-size: 10px; color: var(--admin-text-muted);">ID: ${p.id}</div>
                </div>
              </td>
              <td>
                <div>${p.category}</div>
                <div style="font-size: 10px; color: var(--admin-text-muted); text-transform: capitalize;">${p.shape || 'Standard'} Cut</div>
              </td>
              <td><span class="badge-monochrome badge-published">${p.badge || p.stoneType || 'Diamond'}</span></td>
              <td><span class="badge-monochrome ${p.stock_quantity > 0 ? 'badge-instock' : 'badge-outofstock'}">${p.stock_quantity || 10} In Stock</span></td>
              <td style="font-weight: 600;">$${Number(p.price).toLocaleString()}</td>
              <td>${p.isFeatured ? '★ Featured' : '—'}</td>
              <td style="text-align: right;">
                <div style="display: inline-flex; gap: 4px;">
                  <button class="admin-btn-icon" data-edit-prod="${p.id}" title="Edit Piece">✎</button>
                  <button class="admin-btn-icon" data-dup-prod="${p.id}" title="Duplicate Piece">⧉</button>
                  <button class="admin-btn-icon" data-del-prod="${p.id}" title="Delete Piece">✕</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // Row action listeners
    wrapper.querySelectorAll('[data-edit-prod]').forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = catalogManager.products.find(p => p.id === btn.getAttribute('data-edit-prod'));
        this.openProductModal(prod);
      });
    });

    wrapper.querySelectorAll('[data-dup-prod]').forEach(btn => {
      btn.addEventListener('click', async () => {
        await catalogManager.duplicateProduct(btn.getAttribute('data-dup-prod'));
        this.renderProducts();
        this.updateCounters();
        this.showToast('Product duplicated.');
      });
    });

    wrapper.querySelectorAll('[data-del-prod]').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this piece?')) {
          await catalogManager.deleteProduct(btn.getAttribute('data-del-prod'));
          this.renderProducts();
          this.renderInventory();
          this.updateCounters();
          this.showToast('Product removed.');
        }
      });
    });
  }

  openProductModal(product) {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('product-modal-title');
    
    if (product) {
      title.innerText = 'Edit Jewelry Piece';
      document.getElementById('prod-form-id').value = product.id;
      document.getElementById('prod-form-title').value = product.title || product.name || '';
      document.getElementById('prod-form-category').value = product.category || 'engagement-rings';
      document.getElementById('prod-form-shape').value = product.shape || 'oval';
      document.getElementById('prod-form-price').value = product.price || '';
      document.getElementById('prod-form-compare-price').value = product.compareAtPrice || '';
      document.getElementById('prod-form-stock').value = product.stock_quantity || 10;
      document.getElementById('prod-form-stone').value = product.stoneType || 'lab-diamond';
      document.getElementById('prod-form-carat').value = product.carat || '';
      document.getElementById('prod-form-leadtime').value = product.leadTime || 'Ships in 2-3 weeks';
      document.getElementById('prod-form-image').value = product.primaryImage || '';
      document.getElementById('prod-form-description').value = product.description || '';
      document.getElementById('prod-form-bestseller').checked = !!product.isBestSeller;
      document.getElementById('prod-form-featured').checked = !!product.isFeatured;
    } else {
      title.innerText = 'Add New Jewelry Piece';
      document.getElementById('product-modal-form').reset();
      document.getElementById('prod-form-id').value = '';
      document.getElementById('prod-form-stock').value = 10;
      document.getElementById('prod-form-leadtime').value = 'Ships in 2-3 weeks';
      document.getElementById('prod-form-image').value = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85';
    }

    modal.style.display = 'flex';
  }

  // =========================================================================
  // INVENTORY & STOCK
  // =========================================================================
  renderInventory() {
    const wrapper = document.getElementById('inventory-table-wrapper');
    wrapper.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Piece Title</th>
            <th>SKU</th>
            <th>Stock On Hand</th>
            <th>Stock Status</th>
            <th style="text-align: right;">Inventory Adjustment</th>
          </tr>
        </thead>
        <tbody>
          ${catalogManager.products.map(p => `
            <tr>
              <td><strong>${p.title || p.name}</strong></td>
              <td><code>${p.sku || `AVI-SKU-${p.id.slice(-4)}`}</code></td>
              <td style="font-weight: 600;">${p.stock_quantity || 10} units</td>
              <td>
                <span class="badge-monochrome ${(p.stock_quantity || 10) > 3 ? 'badge-instock' : 'badge-lowstock'}">
                  ${(p.stock_quantity || 10) > 3 ? 'In Stock' : 'Low Stock Alert'}
                </span>
              </td>
              <td style="text-align: right;">
                <button class="admin-btn admin-btn-secondary admin-btn-sm" data-restock="${p.id}">
                  + Restock Units
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    wrapper.querySelectorAll('[data-restock]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-restock');
        const prod = catalogManager.products.find(p => p.id === id);
        if (prod) {
          prod.stock_quantity = (prod.stock_quantity || 10) + 5;
          await catalogManager.saveProduct(prod);
          this.renderInventory();
          this.renderProducts();
          this.showToast(`Restocked 5 units for "${prod.title || prod.name}"`);
        }
      });
    });
  }

  // =========================================================================
  // CLIENT ORDERS & INVOICES
  // =========================================================================
  setupOrdersControls() {}

  renderOrders() {
    const wrapper = document.getElementById('orders-table-wrapper');
    wrapper.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Order Ref</th>
            <th>Client Name</th>
            <th>Fulfillment Status</th>
            <th>Payment Status</th>
            <th>Total (USD)</th>
            <th style="text-align: right;">Print & Actions</th>
          </tr>
        </thead>
        <tbody>
          ${ordersManager.orders.map(o => `
            <tr>
              <td><strong>${o.id}</strong></td>
              <td>
                <div>${o.customer_name}</div>
                <div style="font-size: 10px; color: var(--admin-text-muted);">${o.customer_email}</div>
              </td>
              <td>
                <select class="admin-status-select" data-order-status="${o.id}" style="padding: 3px 6px; font-size: 11px; width: auto;">
                  <option value="processing" ${o.fulfillment_status === 'processing' ? 'selected' : ''}>Processing</option>
                  <option value="in_transit" ${o.fulfillment_status === 'in_transit' ? 'selected' : ''}>FedEx In Transit</option>
                  <option value="delivered" ${o.fulfillment_status === 'delivered' ? 'selected' : ''}>Delivered</option>
                  <option value="cancelled" ${o.fulfillment_status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
              </td>
              <td><span class="badge-monochrome badge-published">${o.payment_status}</span></td>
              <td style="font-weight: 600;">$${Number(o.total).toLocaleString()}</td>
              <td style="text-align: right;">
                <button class="admin-btn admin-btn-secondary admin-btn-sm" data-print-invoice="${o.id}">
                  Print Invoice
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    wrapper.querySelectorAll('[data-order-status]').forEach(sel => {
      sel.addEventListener('change', async () => {
        const orderId = sel.getAttribute('data-order-status');
        await ordersManager.updateOrderStatus(orderId, sel.value);
        this.showToast(`Order #${orderId} status updated to ${sel.value}`);
      });
    });

    wrapper.querySelectorAll('[data-print-invoice]').forEach(btn => {
      btn.addEventListener('click', () => {
        ordersManager.printInvoice(btn.getAttribute('data-print-invoice'));
      });
    });
  }

  // =========================================================================
  // BESPOKE CUSTOM INQUIRIES CRM
  // =========================================================================
  setupCrmControls() {}

  renderInquiries() {
    const container = document.getElementById('inquiries-crm-container');
    container.innerHTML = crmManager.inquiries.map(inq => `
      <div style="background-color: var(--admin-card); border: 1px solid var(--admin-border); border-radius: 6px; padding: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h4 style="font-family: var(--admin-font-serif); font-size: 16px; font-weight: 600;">
                ${inq.firstName} ${inq.lastName}
              </h4>
              <span class="badge-monochrome badge-published">Ref: ${inq.referenceId}</span>
            </div>
            <div style="font-size: 11px; color: var(--admin-text-muted); margin-top: 3px;">
              Email: ${inq.email} • Phone: ${inq.phone || 'N/A'}
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 11px; color: var(--admin-text-muted);">Status:</span>
            <select class="crm-status-select" data-inq-ref="${inq.referenceId}" style="width: auto; padding: 4px 8px; font-size: 11px;">
              <option value="New" ${inq.status === 'New' ? 'selected' : ''}>New Submission</option>
              <option value="Reviewing" ${inq.status === 'Reviewing' ? 'selected' : ''}>Reviewing Sketches</option>
              <option value="CAD In Progress" ${inq.status === 'CAD In Progress' ? 'selected' : ''}>CAD In Progress</option>
              <option value="Cast & Handset" ${inq.status === 'Cast & Handset' ? 'selected' : ''}>Cast & Handset</option>
              <option value="Completed" ${inq.status === 'Completed' ? 'selected' : ''}>Completed & Delivered</option>
            </select>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; background-color: #0A0A0A; padding: 10px; border-radius: 4px; font-size: 11px; margin-bottom: 12px; border: 1px solid var(--admin-border-subtle);">
          <div><strong>Shape:</strong> ${(inq.ringShape || 'Round').toUpperCase()}</div>
          <div><strong>Setting:</strong> ${inq.ringType || 'Solitaire'}</div>
          <div><strong>Precious Metal:</strong> ${inq.metal || '14k Gold'}</div>
          <div><strong>Stone:</strong> ${inq.stonePreference || 'Lab Diamond'}</div>
          <div><strong>Budget:</strong> ${inq.budgetRange || '$5,000+'}</div>
          <div><strong>Ring Size:</strong> ${inq.ringSize || '6.5'}</div>
        </div>

        ${inq.description ? `<p style="font-size: 12px; color: var(--admin-text-secondary); margin-bottom: 10px;"><strong>Client Note:</strong> ${inq.description}</p>` : ''}
        ${inq.inspoLink ? `<div style="font-size: 11px; color: #FFFFFF; margin-bottom: 12px;"><strong>Inspo Link:</strong> <a href="${inq.inspoLink}" target="_blank" style="color: #FFFFFF; text-decoration: underline;">${inq.inspoLink}</a></div>` : ''}

        <div style="display: flex; gap: 8px;">
          <a href="tel:${inq.phone}" class="admin-btn admin-btn-secondary admin-btn-sm">Call Client</a>
          <a href="mailto:${inq.email}" class="admin-btn admin-btn-secondary admin-btn-sm">Email Consultation</a>
          <a href="https://wa.me/${(inq.phone || '').replace(/[^0-9]/g, '')}" target="_blank" class="admin-btn admin-btn-secondary admin-btn-sm">WhatsApp Concierge</a>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('[data-inq-ref]').forEach(sel => {
      sel.addEventListener('change', async () => {
        const refId = sel.getAttribute('data-inq-ref');
        await crmManager.updateInquiryStatus(refId, sel.value);
        this.showToast(`Inquiry #${refId} updated to ${sel.value}`);
      });
    });
  }

  renderAppointments() {
    const wrapper = document.getElementById('appointments-table-wrapper');
    wrapper.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Type</th>
            <th>Date & Time</th>
            <th>Special Notes</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${crmManager.appointments.map(a => `
            <tr>
              <td>
                <div style="font-weight: 600;">${a.fullName}</div>
                <div style="font-size: 10px; color: var(--admin-text-muted);">${a.email} • ${a.phone}</div>
              </td>
              <td><span class="badge-monochrome badge-published">${a.type}</span></td>
              <td>
                <div style="font-weight: 600;">${a.date}</div>
                <div style="font-size: 10px; color: var(--admin-text-muted);">${a.time}</div>
              </td>
              <td>${a.notes || '—'}</td>
              <td><span class="badge-monochrome badge-success">${a.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // =========================================================================
  // SETTINGS, BACKUP & RESTORE
  // =========================================================================
  setupSettingsControls() {
    const form = document.getElementById('settings-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      settingsManager.saveSettings({
        brandName: document.getElementById('setting-brand-name').value,
        address: document.getElementById('setting-address').value,
        phone: document.getElementById('setting-phone').value,
        email: document.getElementById('setting-email').value
      });
      this.showToast('Store settings saved.');
    });

    // Backup Download
    document.getElementById('btn-export-backup').addEventListener('click', () => {
      const json = settingsManager.generateBackupJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `avi_jewelers_backup_${Date.now()}.json`);
      link.click();
      this.showToast('Full archive JSON downloaded.');
    });

    // Restore Backup
    const fileInput = document.getElementById('backup-file-input');
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target.result;
        const inspect = settingsManager.inspectBackupJSON(text);
        if (!inspect.valid) {
          alert(`Restore Error: ${inspect.error}`);
          return;
        }

        const msg = `Backup summary:
• Products: ${inspect.summary.productCount}
• Orders: ${inspect.summary.orderCount}
• Inquiries: ${inspect.summary.inquiryCount}

Do you want to proceed and merge this archive into your store?`;

        if (confirm(msg)) {
          await settingsManager.executeRestore(inspect.payload, 'merge');
          this.renderAllViews();
          this.showToast('Backup restored successfully!');
        }
      };
      reader.readAsText(file);
    });

    // Cache Reset
    document.getElementById('btn-reset-cache').addEventListener('click', () => {
      if (confirm('Reset only Avi Jewelers local browser cache? This will clear local drafts.')) {
        const cleared = settingsManager.resetNamespacedCache();
        this.showToast(`Cleared ${cleared} local cache items.`);
        setTimeout(() => window.location.reload(), 1000);
      }
    });
  }

  setupModals() {}
}

// Start application
window.addEventListener('DOMContentLoaded', () => {
  new AdminStudioApp();
});
