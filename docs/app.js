/**
 * STATISTIK TEKNIK DENGAN R — WEB E-BOOK APPLICATION
 * Core logic: Navigation, Rendering, Theme Management, Full-Text Search,
 * Code Highlighting & Copy, and Presentation Modal.
 */

(function () {
  'use strict';

  // Application State
  let chaptersData = [];
  let currentChapterIndex = 1; // Default to Bab 1
  let currentSlideIndex = 0;
  let activePresentationSlides = [];

  // DOM Elements
  const appHeader = document.getElementById('appHeader');
  const sidebarNav = document.getElementById('sidebarNav');
  const readerContainer = document.getElementById('readerContainer');
  const subTocNav = document.getElementById('subTocNav');
  const readingProgressBar = document.getElementById('readingProgressBar');
  const readCountText = document.getElementById('readCountText');
  const sidePptDownloadBtn = document.getElementById('sidePptDownloadBtn');
  const headerPptBtn = document.getElementById('headerPptBtn');
  const toast = document.getElementById('toast');

  // Search Elements
  const searchTriggerBtn = document.getElementById('searchTriggerBtn');
  const searchModal = document.getElementById('searchModal');
  const searchCloseBtn = document.getElementById('searchCloseBtn');
  const globalSearchInput = document.getElementById('globalSearchInput');
  const searchResultsContainer = document.getElementById('searchResultsContainer');

  // Presentation Modal Elements
  const slideModal = document.getElementById('slideModal');
  const slideModalCloseBtn = document.getElementById('slideModalCloseBtn');
  const slideModalTitle = document.getElementById('slideModalTitle');
  const slideStage = document.getElementById('slideStage');
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const slideCounter = document.getElementById('slideCounter');
  const modalPptDownloadBtn = document.getElementById('modalPptDownloadBtn');

  // Mobile Menu Elements
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  // Theme & Font Controls
  const themeButtons = document.querySelectorAll('.theme-btn');
  const fontToggleBtn = document.getElementById('fontToggleBtn');
  const fontIncBtn = document.getElementById('fontIncBtn');
  const fontDecBtn = document.getElementById('fontDecBtn');

  // Helper: Mapping filenames to PPT download paths
  const PPT_MAPPING = {
    1: 'Bab01_Pengantar_Statistik_Teknik_dan_R.pptx',
    2: 'Bab02_Struktur_Data_dan_Manipulasi_Data_di_R.pptx',
    3: 'Bab03_Statistika_Deskriptif_dan_Eksplorasi_Data.pptx',
    4: 'Bab04_Visualisasi_Data_dengan_R.pptx',
    5: 'Bab05_Teori_Probabilitas_dan_Distribusi_Diskrit.pptx',
    6: 'Bab06_Distribusi_Kontinu_dan_Teorema_Limit_Pusat.pptx',
    7: 'Bab07_Estimasi_Parameter_dan_Interval_Kepercayaan.pptx',
    8: 'Bab08_Uji_Hipotesis_Satu_dan_Dua_Sampel.pptx',
    9: 'Bab09_ANOVA_dan_Uji_Non_Parametrik.pptx',
    10: 'Bab10_Regresi_Linear_Sederhana_dan_Berganda.pptx',
    11: 'Bab11_Regresi_Logistik_dan_Model_Lanjut.pptx',
    12: 'Bab12_Simulasi_Monte_Carlo.pptx',
    13: 'Bab13_Bootstrap_dan_Metode_Resampling.pptx',
    14: 'Bab14_Analisis_Multivariat_dan_Pengantar_ML_Statistik.pptx',
    15: 'Bab15_Proyek_Akhir_Studi_Kasus_Analisis_Data_Komprehensif.pptx'
  };

  // LocalStorage Helpers
  function getCompletedChapters() {
    try {
      return JSON.parse(localStorage.getItem('stat_teknik_completed') || '[]');
    } catch (e) {
      return [];
    }
  }

  function setChapterCompleted(num) {
    if (!num) return;
    const list = getCompletedChapters();
    if (!list.includes(num)) {
      list.push(num);
      localStorage.setItem('stat_teknik_completed', JSON.stringify(list));
      updateReadingStats();
      renderSidebar();
    }
  }

  function updateReadingStats() {
    const list = getCompletedChapters();
    if (readCountText) {
      readCountText.textContent = `${list.length} / 15 Bab Selesai`;
    }
  }

  // Toast message
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  // Syntax Highlighter for R code
  function highlightRCode(rawCode) {
    if (!rawCode) return '';
    let escaped = rawCode
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Comments
    escaped = escaped.replace(/(#.*$)/gm, '<span class="token-comment">$1</span>');

    // Keywords
    const keywords = ['function', 'if', 'else', 'repeat', 'while', 'for', 'in', 'next', 'break', 'TRUE', 'FALSE', 'NULL', 'Inf', 'NaN', 'NA', 'library', 'require', 'install.packages'];
    const kwRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    escaped = escaped.replace(kwRegex, '<span class="token-keyword">$1</span>');

    // Strings
    escaped = escaped.replace(/(".*?"|'.*?')/g, '<span class="token-string">$1</span>');

    // Numbers
    escaped = escaped.replace(/\b(\d+(\.\d+)?L?)\b/g, '<span class="token-number">$1</span>');

    return escaped;
  }

  // Calculate Reading Time (words / 200 wpm)
  function estimateReadingTime(ch) {
    let text = ch.title + ' ';
    (ch.objectives || []).forEach(o => text += o + ' ');
    (ch.sections || []).forEach(s => {
      text += s.title + ' ';
      (s.blocks || []).forEach(b => text += (b.content || '') + ' ');
    });
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(2, Math.ceil(words / 180));
    return `${minutes} menit baca`;
  }

  // Render Sidebar navigation with Parts
  function renderSidebar() {
    sidebarNav.innerHTML = '';
    const completed = getCompletedChapters();

    // Grouping into Parts
    const partOrder = [
      'PANDUAN & SILABUS PERKULIAHAN',
      'BAGIAN I — FONDASI STATISTIKA & LINGKUNGAN R',
      'BAGIAN II — PROBABILITAS DAN INFERENSI STATISTIK',
      'BAGIAN III — UJI HIPOTESIS, ANOVA, DAN REGRESI',
      'BAGIAN IV — KOMPUTASI STATISTIK LANJUT',
      'BAGIAN V — PROYEK AKHIR DAN EVALUASI KOMPREHENSIF'
    ];

    const partGroups = {};
    partOrder.forEach(p => partGroups[p] = []);

    chaptersData.forEach((ch, idx) => {
      let p = ch.part;
      if (ch.is_outline) p = 'PANDUAN & SILABUS PERKULIAHAN';
      if (!partGroups[p]) partGroups[p] = [];
      partGroups[p].push({ ...ch, originalIndex: idx });
    });

    partOrder.forEach(partName => {
      const items = partGroups[partName];
      if (!items || items.length === 0) return;

      const groupEl = document.createElement('div');
      groupEl.className = 'nav-part-group';

      let shortPartName = partName;
      if (partName.includes('—')) {
        shortPartName = partName.split('—')[0].trim();
      }

      groupEl.innerHTML = `
        <div class="nav-part-title" title="${partName}">
          <span>${shortPartName}</span>
          <span class="nav-part-badge">${items.length}</span>
        </div>
        <ul class="nav-chapter-list"></ul>
      `;

      const listEl = groupEl.querySelector('.nav-chapter-list');

      items.forEach(item => {
        const li = document.createElement('li');
        const isActive = item.originalIndex === currentChapterIndex;
        const isDone = completed.includes(item.chapter_num);

        li.className = `nav-chapter-item ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`;
        li.dataset.index = item.originalIndex;

        const pillText = item.is_outline ? 'RPS' : String(item.chapter_num);
        const subMeta = item.is_outline ? 'Silabus' : (item.pertemuan ? item.pertemuan.split('—')[0].trim() : `Pertemuan ${item.chapter_num}`);

        li.innerHTML = `
          <div class="chapter-number-pill">${pillText}</div>
          <div class="chapter-info-col">
            <div class="chapter-title-text" title="${item.title}">${item.title}</div>
            <div class="chapter-sub-meta">${subMeta}</div>
          </div>
          <div class="chapter-status-check">✓</div>
        `;

        li.addEventListener('click', () => {
          selectChapter(item.originalIndex);
          if (window.innerWidth <= 860) {
            closeMobileMenu();
          }
        });

        listEl.appendChild(li);
      });

      sidebarNav.appendChild(groupEl);
    });
  }

  // Render Sub-TOC ("Pada Bab Ini")
  function renderSubToc(ch) {
    subTocNav.innerHTML = '';
    const sections = ch.sections || [];

    if (sections.length === 0) {
      subTocNav.innerHTML = '<div style="color:var(--text-muted); font-size:0.8rem;">Tidak ada sub-bab</div>';
      return;
    }

    // Top anchor: Overview
    const topLink = document.createElement('a');
    topLink.className = 'sub-toc-link active';
    topLink.href = '#chapterOverview';
    topLink.textContent = 'Pengantar & Tujuan';
    topLink.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('chapterOverview')?.scrollIntoView({ behavior: 'smooth' });
    });
    subTocNav.appendChild(topLink);

    sections.forEach(sec => {
      const a = document.createElement('a');
      a.className = 'sub-toc-link';
      a.href = `#sec-${sec.num}`;
      a.textContent = `${sec.num} ${sec.title}`;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(`sec-${sec.num}`);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
      subTocNav.appendChild(a);
    });

    if (ch.praktikum && ch.praktikum.steps && ch.praktikum.steps.length > 0) {
      const prakLink = document.createElement('a');
      prakLink.className = 'sub-toc-link';
      prakLink.href = '#praktikumSection';
      prakLink.textContent = 'Kegiatan Praktikum';
      prakLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('praktikumSection')?.scrollIntoView({ behavior: 'smooth' });
      });
      subTocNav.appendChild(prakLink);
    }

    if (ch.summary && ch.summary.length > 0) {
      const sumLink = document.createElement('a');
      sumLink.className = 'sub-toc-link';
      sumLink.href = '#summarySection';
      sumLink.textContent = 'Rangkuman Poin';
      sumLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('summarySection')?.scrollIntoView({ behavior: 'smooth' });
      });
      subTocNav.appendChild(sumLink);
    }

    if (ch.evaluasi && (ch.evaluasi.teori.length > 0 || ch.evaluasi.praktik.length > 0)) {
      const evalLink = document.createElement('a');
      evalLink.className = 'sub-toc-link';
      evalLink.href = '#evaluasiSection';
      evalLink.textContent = 'Latihan Evaluasi';
      evalLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('evaluasiSection')?.scrollIntoView({ behavior: 'smooth' });
      });
      subTocNav.appendChild(evalLink);
    }
  }

  // Render the selected Chapter Content
  function renderChapterContent(ch) {
    const num = ch.chapter_num;
    const isOutline = ch.is_outline;
    const pptFile = PPT_MAPPING[num] || 'Bab01_Pengantar_Statistik_Teknik_dan_R.pptx';
    const pptDownloadPath = `./ppt/${pptFile}`;

    // Update Right Sidebar PPT Download Button
    if (sidePptDownloadBtn) {
      if (!isOutline && num >= 1) {
        sidePptDownloadBtn.href = pptDownloadPath;
        sidePptDownloadBtn.style.display = 'inline-flex';
        sidePptDownloadBtn.setAttribute('download', pptFile);
      } else {
        sidePptDownloadBtn.style.display = 'none';
      }
    }

    // Update Header PPT Quick Button
    if (headerPptBtn) {
      headerPptBtn.onclick = () => {
        openPresentationModal(ch);
      };
    }

    const readTime = estimateReadingTime(ch);

    let html = `
      <article class="reader-content" id="chapterOverview">
        <!-- Hero Header -->
        <header class="chapter-hero">
          <span class="chapter-hero-badge">${ch.part || 'BUKU AJAR STATISTIK TEKNIK'}</span>
          <h1 class="chapter-hero-title">${ch.title}</h1>
          
          <div class="chapter-meta-pills">
            ${ch.pertemuan ? `<span class="meta-pill"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>${ch.pertemuan}</span>` : ''}
            ${ch.cpmk ? `<span class="meta-pill meta-pill-cpmk"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>${ch.cpmk.split('—')[0].trim()}</span>` : ''}
            ${ch.alokasi_waktu ? `<span class="meta-pill"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>${ch.alokasi_waktu}</span>` : ''}
            <span class="meta-pill"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>${readTime}</span>
          </div>

          <div class="chapter-action-bar">
            ${!isOutline ? `
              <a href="${pptDownloadPath}" class="btn btn-primary btn-sm" download="${pptFile}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>Unduh Slide PPTX (Bab ${num})</span>
              </a>
              <button class="btn btn-secondary btn-sm" onclick="window.appOpenPresentation()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                <span>Mode Presentasi Slide</span>
              </button>
            ` : ''}
            <button class="btn btn-outline btn-sm" onclick="window.print()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              <span>Cetak / PDF</span>
            </button>
          </div>
        </header>
    `;

    // Learning Objectives
    if (ch.objectives && ch.objectives.length > 0) {
      html += `
        <section class="callout callout-objectives">
          <div class="callout-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
          </div>
          <div class="callout-body">
            <div class="callout-title">Tujuan Pembelajaran</div>
            <p style="margin-bottom:0.5rem; font-size:0.95rem; color:var(--text-secondary);">Setelah mempelajari bab ini, mahasiswa diharapkan mampu:</p>
            <ul class="objectives-list">
              ${ch.objectives.map((obj, i) => `
                <li class="objective-item">
                  <span class="objective-badge">${i + 1}</span>
                  <span>${obj}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </section>
      `;
    }

    // Sections & Sub-babs
    const sections = ch.sections || [];
    sections.forEach(sec => {
      html += `<section id="sec-${sec.num}" class="chapter-sub-section">`;
      html += `<h2><span style="color:var(--brand-teal);">${sec.num}</span> ${sec.title}</h2>`;

      (sec.blocks || []).forEach(block => {
        if (block.type === 'paragraph') {
          html += `<p>${block.content}</p>`;
        } else if (block.type === 'list_item') {
          html += `<ul><li>${block.content}</li></ul>`;
        } else if (block.type === 'heading_3') {
          html += `<h3>${block.content}</h3>`;
        } else if (block.type === 'code') {
          const rawCode = block.content || '';
          const hlCode = highlightRCode(rawCode);
          html += `
            <div class="code-container">
              <div class="code-header">
                <div class="terminal-dots">
                  <div class="terminal-dot dot-red"></div>
                  <div class="terminal-dot dot-yellow"></div>
                  <div class="terminal-dot dot-green"></div>
                </div>
                <div class="code-caption">${block.caption || 'Skrip R'}</div>
                <button class="copy-code-btn" data-code="${encodeURIComponent(rawCode)}">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  <span>Salin</span>
                </button>
              </div>
              <div class="code-body">
                <pre><code>${hlCode}</code></pre>
              </div>
            </div>
          `;
        } else if (block.type === 'output') {
          html += `
            <div class="output-container">
              <div class="output-header">Konsol Output R</div>
              <div class="output-body">
                <pre><code>${block.content}</code></pre>
              </div>
            </div>
          `;
        } else if (block.type === 'table') {
          html += `
            <div class="table-wrapper">
              <table class="content-table">
                <thead>
                  <tr>${(block.headers || []).map(h => `<th>${h}</th>`).join('')}</tr>
                </thead>
                <tbody>
                  ${(block.rows || []).map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
                </tbody>
              </table>
            </div>
          `;
        }
      });

      html += `</section>`;
    });

    // Praktikum Section
    if (ch.praktikum && ch.praktikum.steps && ch.praktikum.steps.length > 0) {
      html += `
        <section id="praktikumSection" class="praktikum-section">
          <div class="praktikum-section-title">${ch.praktikum.title || 'Kegiatan Praktikum R'}</div>
          ${ch.praktikum.intro ? `<p class="praktikum-intro">${ch.praktikum.intro}</p>` : ''}
          <div class="praktikum-grid">
            ${ch.praktikum.steps.map((step, idx) => {
              let title = `Langkah ${idx + 1}`;
              let desc = step;
              if (step.includes(':')) {
                const parts = step.split(':');
                title = parts[0];
                desc = parts.slice(1).join(':');
              }
              return `
                <div class="praktikum-card">
                  <div class="prak-number">${idx + 1}</div>
                  <div class="prak-content">
                    <div style="font-weight:700; color:var(--brand-navy); margin-bottom:0.25rem;">${title}</div>
                    <div style="font-size:0.92rem; line-height:1.55;">${desc}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </section>
      `;
    }

    // Summary Section
    if (ch.summary && ch.summary.length > 0) {
      html += `
        <section id="summarySection" class="summary-box">
          <div class="summary-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <span>Rangkuman Poin Kunci Bab ${num}</span>
          </div>
          <div class="summary-grid">
            ${ch.summary.map(pt => `
              <div class="summary-card">
                <span class="summary-check">✓</span>
                <div>${pt}</div>
              </div>
            `).join('')}
          </div>
        </section>
      `;
    }

    // Evaluasi Section
    if (ch.evaluasi && (ch.evaluasi.teori.length > 0 || ch.evaluasi.praktik.length > 0)) {
      html += `
        <section id="evaluasiSection" class="evaluasi-section">
          <div class="evaluasi-title">Latihan Evaluasi Mandiri</div>
          <div class="evaluasi-cols">
            <div class="eval-col">
              <div class="eval-col-title">Bagian A — Soal Teori</div>
              <ul class="eval-list">
                ${ch.evaluasi.teori.map((q, i) => `
                  <li class="eval-item">
                    <span class="eval-q-num">${i + 1}</span>
                    <div>${q}</div>
                  </li>
                `).join('')}
              </ul>
            </div>
            <div class="eval-col">
              <div class="eval-col-title">Bagian B — Soal Praktik & Kasus</div>
              <ul class="eval-list">
                ${ch.evaluasi.praktik.map((q, i) => `
                  <li class="eval-item">
                    <span class="eval-q-num">${i + 1}</span>
                    <div>${q}</div>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        </section>
      `;
    }

    // Referensi Section
    if (ch.referensi && ch.referensi.length > 0) {
      html += `
        <section class="referensi-section">
          <div class="referensi-title">Referensi Bab</div>
          <ul class="referensi-list">
            ${ch.referensi.map(ref => `<li class="referensi-item">${ref}</li>`).join('')}
          </ul>
        </section>
      `;
    }

    // Bottom Navigation (Prev / Next Chapter)
    const prevIdx = currentChapterIndex > 0 ? currentChapterIndex - 1 : null;
    const nextIdx = currentChapterIndex < chaptersData.length - 1 ? currentChapterIndex + 1 : null;

    html += `<div class="chapter-bottom-nav">`;
    if (prevIdx !== null) {
      const prevCh = chaptersData[prevIdx];
      html += `
        <a href="#" class="nav-jump-btn prev" onclick="window.appSelectChapter(${prevIdx}); return false;">
          <span class="nav-jump-label">← Bab Sebelumnya</span>
          <span class="nav-jump-title">${prevCh.title}</span>
        </a>
      `;
    } else {
      html += `<div></div>`;
    }

    if (nextIdx !== null) {
      const nextCh = chaptersData[nextIdx];
      html += `
        <a href="#" class="nav-jump-btn next" onclick="window.appSelectChapter(${nextIdx}); return false;">
          <span class="nav-jump-label">Bab Selanjutnya →</span>
          <span class="nav-jump-title">${nextCh.title}</span>
        </a>
      `;
    }
    html += `</div>`;

    html += `</article>`;

    readerContainer.innerHTML = html;

    // Attach copy button events
    readerContainer.querySelectorAll('.copy-code-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const raw = decodeURIComponent(btn.dataset.code || '');
        navigator.clipboard.writeText(raw).then(() => {
          showToast('Kode R berhasil disalin ke clipboard!');
        }).catch(() => {
          showToast('Gagal menyalin kode.');
        });
      });
    });

    // Reset Reader Scroll
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Select and load a chapter
  function selectChapter(index) {
    if (index < 0 || index >= chaptersData.length) return;
    currentChapterIndex = index;
    const ch = chaptersData[index];

    document.title = `${ch.title} — Statistik Teknik dengan R`;

    renderSidebar();
    renderSubToc(ch);
    renderChapterContent(ch);

    // Save active chapter to localStorage
    localStorage.setItem('stat_teknik_active_idx', index);
  }

  // Window bridge for inline onclick handlers
  window.appSelectChapter = selectChapter;
  window.appOpenPresentation = () => openPresentationModal(chaptersData[currentChapterIndex]);

  // Reading Scroll Progress Tracking
  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const scrolled = (window.scrollY / docHeight) * 100;
    if (readingProgressBar) {
      readingProgressBar.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
    }

    // If scrolled past 80%, mark chapter as completed
    if (scrolled > 80 && chaptersData[currentChapterIndex]) {
      setChapterCompleted(chaptersData[currentChapterIndex].chapter_num);
    }
  });

  // =========================================================================
  // PRESENTATION SLIDE VIEWER MODAL
  // =========================================================================
  function buildPresentationSlides(ch) {
    const slides = [];
    const num = ch.chapter_num;
    const title = ch.title;
    const pert = ch.pertemuan || `Pertemuan ${num}`;
    const cpmk = ch.cpmk ? ch.cpmk.split('—')[0].trim() : `CPMK-${Math.min(6, Math.ceil(num/3))}`;
    const time = ch.alokasi_waktu || '3 × 50 menit';

    // Slide 1: Cover
    slides.push({
      type: 'cover',
      title: title,
      bab: `BAB ${num}`,
      pert: pert,
      cpmk: cpmk,
      time: time
    });

    // Slide 2: Objectives
    slides.push({
      type: 'objectives',
      badge: cpmk,
      title: 'Tujuan Pembelajaran',
      desc: 'Setelah mempelajari bab ini, mahasiswa diharapkan mampu:',
      items: (ch.objectives || []).slice(0, 5)
    });

    // Sections Content Slides
    (ch.sections || []).forEach((sec) => {
      const paras = (sec.blocks || []).filter(b => b.type === 'paragraph').map(b => b.content);
      const lists = (sec.blocks || []).filter(b => b.type === 'list_item').map(b => b.content);
      const code = (sec.blocks || []).filter(b => b.type === 'code')[0];

      let cardItems = [];
      if (lists.length >= 2) cardItems = lists.slice(0, 4);
      else if (paras.length > 1) cardItems = paras.slice(1, 4);
      else cardItems = ['Konsep Teoretis', 'Penerapan di R', 'Interpretasi Hasil'];

      slides.push({
        type: 'content',
        badge: `SUB-BAB ${sec.num}`,
        title: sec.title,
        desc: paras[0] || 'Pembahasan materi konsep dan implementasi terapan.',
        cards: cardItems
      });

      if (code) {
        slides.push({
          type: 'code',
          badge: `SUB-BAB ${sec.num}`,
          title: `Implementasi R: ${sec.title}`,
          code: code.content,
          caption: code.caption || `Kode R ${sec.num}`
        });
      }
    });

    // Slide: Praktikum
    if (ch.praktikum && ch.praktikum.steps && ch.praktikum.steps.length > 0) {
      slides.push({
        type: 'content',
        badge: 'PRAKTIKUM',
        title: ch.praktikum.title || `Kegiatan Praktikum R — Bab ${num}`,
        desc: ch.praktikum.intro || 'Alur praktikum terpadu di RStudio:',
        cards: ch.praktikum.steps.slice(0, 4)
      });
    }

    // Slide: Rangkuman
    slides.push({
      type: 'summary',
      badge: 'RANGKUMAN',
      title: `Poin-Poin Kunci Bab ${num}`,
      items: (ch.summary || []).slice(0, 6)
    });

    return slides;
  }

  function renderCurrentSlide() {
    if (!activePresentationSlides.length) return;
    const s = activePresentationSlides[currentSlideIndex];
    const total = activePresentationSlides.length;

    slideCounter.textContent = `Slide ${currentSlideIndex + 1} / ${total}`;

    let slideHtml = '';

    if (s.type === 'cover') {
      slideHtml = `
        <div class="slide-card-cover">
          <div class="slide-cover-badge">MATA KULIAH STATISTIK TEKNIK · TIF-302</div>
          <div class="slide-cover-bab">${s.bab}</div>
          <div class="slide-cover-title">${s.title}</div>
          <div class="slide-cover-meta">
            <div><strong>PERTEMUAN RPS:</strong> ${s.pert}</div>
            <div><strong>CPMK TERKAIT:</strong> ${s.cpmk}</div>
            <div><strong>ALOKASI WAKTU:</strong> ${s.time}</div>
          </div>
        </div>
      `;
    } else if (s.type === 'objectives') {
      slideHtml = `
        <div class="slide-card-content">
          <div class="slide-content-header">
            <div class="slide-badge-sub">${s.badge}</div>
            <div class="slide-main-title">${s.title}</div>
            <div class="slide-orange-line"></div>
            <div class="slide-lead-desc">${s.desc}</div>
          </div>
          <div style="display:flex; flex-direction:column; gap:0.65rem; margin-top:0.5rem;">
            ${s.items.map((item, idx) => `
              <div style="display:flex; align-items:center; gap:0.85rem;">
                <div style="width:28px; height:28px; border-radius:50%; background:${idx%2===0 ? '#0B3C5D' : '#1C7293'}; color:#FFF; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.85rem; flex-shrink:0;">${idx+1}</div>
                <div style="font-size:1.05rem; color:#1B2A32;">${item}</div>
              </div>
            `).join('')}
          </div>
          <div class="slide-footer-bar">
            <span>STATISTIK TEKNIK DENGAN R</span>
            <span>${currentSlideIndex + 1}</span>
          </div>
        </div>
      `;
    } else if (s.type === 'content') {
      slideHtml = `
        <div class="slide-card-content">
          <div class="slide-content-header">
            <div class="slide-badge-sub">${s.badge}</div>
            <div class="slide-main-title">${s.title}</div>
            <div class="slide-orange-line"></div>
            <div class="slide-lead-desc">${s.desc}</div>
          </div>
          <div class="slide-body-grid">
            ${s.cards.map((c, i) => {
              let ct = `Poin ${i + 1}`;
              let cd = c;
              if (c.includes(':')) {
                const parts = c.split(':');
                ct = parts[0];
                cd = parts.slice(1).join(':');
              }
              return `
                <div class="slide-sub-card">
                  <div class="slide-sub-num">${i + 1}</div>
                  <div class="slide-sub-title">${ct}</div>
                  <div class="slide-sub-text">${cd}</div>
                </div>
              `;
            }).join('')}
          </div>
          <div class="slide-footer-bar">
            <span>STATISTIK TEKNIK DENGAN R</span>
            <span>${currentSlideIndex + 1}</span>
          </div>
        </div>
      `;
    } else if (s.type === 'code') {
      slideHtml = `
        <div class="slide-card-content">
          <div class="slide-content-header">
            <div class="slide-badge-sub">${s.badge}</div>
            <div class="slide-main-title">${s.title}</div>
            <div class="slide-orange-line"></div>
          </div>
          <div style="background:#16232B; border-radius:10px; padding:1.25rem; flex:1; overflow:hidden; display:flex; flex-direction:column;">
            <div style="color:#8B9AA3; font-family:var(--font-mono); font-size:0.8rem; margin-bottom:0.75rem;">${s.caption}</div>
            <pre style="margin:0; font-family:var(--font-mono); color:#8FD694; font-size:0.95rem; overflow-y:auto; line-height:1.6;"><code>${s.code}</code></pre>
          </div>
          <div class="slide-footer-bar">
            <span>STATISTIK TEKNIK DENGAN R</span>
            <span>${currentSlideIndex + 1}</span>
          </div>
        </div>
      `;
    } else if (s.type === 'summary') {
      slideHtml = `
        <div class="slide-card-cover" style="padding:2.5rem 3.5rem;">
          <div class="slide-cover-badge" style="color:#F4A261;">${s.badge}</div>
          <div class="slide-cover-title" style="font-size:2rem; margin-bottom:1.5rem;">${s.title}</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            ${s.items.map(item => `
              <div style="background:rgba(255,255,255,0.1); padding:0.85rem 1rem; border-radius:8px; font-size:0.9rem; color:#E4EEF5; line-height:1.5;">
                <span style="color:#F4A261; font-weight:700;">✓</span> ${item}
              </div>
            `).join('')}
          </div>
          <div class="slide-footer-bar" style="border-color:rgba(255,255,255,0.15); color:#CADCFC;">
            <span>STATISTIK TEKNIK DENGAN R</span>
            <span>${currentSlideIndex + 1}</span>
          </div>
        </div>
      `;
    }

    slideStage.innerHTML = slideHtml;
  }

  function openPresentationModal(ch) {
    if (!ch) return;
    const num = ch.chapter_num;
    const pptFile = PPT_MAPPING[num] || 'Bab01_Pengantar_Statistik_Teknik_dan_R.pptx';

    slideModalTitle.textContent = `Mode Presentasi — Bab ${num}: ${ch.title}`;
    modalPptDownloadBtn.href = `./ppt/${pptFile}`;
    modalPptDownloadBtn.setAttribute('download', pptFile);

    activePresentationSlides = buildPresentationSlides(ch);
    currentSlideIndex = 0;
    renderCurrentSlide();

    slideModal.style.display = 'flex';
  }

  function closePresentationModal() {
    slideModal.style.display = 'none';
  }

  if (prevSlideBtn) {
    prevSlideBtn.onclick = () => {
      if (currentSlideIndex > 0) {
        currentSlideIndex--;
        renderCurrentSlide();
      }
    };
  }

  if (nextSlideBtn) {
    nextSlideBtn.onclick = () => {
      if (currentSlideIndex < activePresentationSlides.length - 1) {
        currentSlideIndex++;
        renderCurrentSlide();
      }
    };
  }

  if (slideModalCloseBtn) {
    slideModalCloseBtn.onclick = closePresentationModal;
  }

  // Keyboard navigation for presentation
  window.addEventListener('keydown', (e) => {
    if (slideModal.style.display === 'flex') {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        if (currentSlideIndex < activePresentationSlides.length - 1) {
          currentSlideIndex++;
          renderCurrentSlide();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentSlideIndex > 0) {
          currentSlideIndex--;
          renderCurrentSlide();
        }
      } else if (e.key === 'Escape') {
        closePresentationModal();
      }
    }
  });

  // =========================================================================
  // GLOBAL SEARCH
  // =========================================================================
  function openSearchModal() {
    searchModal.style.display = 'flex';
    globalSearchInput.focus();
    globalSearchInput.select();
  }

  function closeSearchModal() {
    searchModal.style.display = 'none';
  }

  function performSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) {
      searchResultsContainer.innerHTML = `
        <div class="search-empty-state">
          <p>Ketik kata kunci untuk mencari di seluruh 15 Bab (misal: "ANOVA", "ggplot2", "Monte Carlo")...</p>
        </div>
      `;
      return;
    }

    const results = [];

    chaptersData.forEach((ch, chIdx) => {
      // Search in title
      if (ch.title.toLowerCase().includes(q)) {
        results.push({
          chapterIndex: chIdx,
          badge: `Bab ${ch.chapter_num}`,
          title: ch.title,
          snippet: `Ditemukan pada judul bab utama.`
        });
      }

      // Search in objectives
      (ch.objectives || []).forEach(obj => {
        if (obj.toLowerCase().includes(q)) {
          results.push({
            chapterIndex: chIdx,
            badge: `Bab ${ch.chapter_num} · Tujuan Pembelajaran`,
            title: ch.title,
            snippet: obj
          });
        }
      });

      // Search in sections
      (ch.sections || []).forEach(sec => {
        if (sec.title.toLowerCase().includes(q)) {
          results.push({
            chapterIndex: chIdx,
            badge: `Bab ${ch.chapter_num} · Sub-bab ${sec.num}`,
            title: sec.title,
            snippet: `Judul sub-bab pembahasan: ${sec.title}`
          });
        }

        (sec.blocks || []).forEach(b => {
          if (b.content && b.content.toLowerCase().includes(q)) {
            const raw = b.content;
            const idx = raw.toLowerCase().indexOf(q);
            const start = Math.max(0, idx - 40);
            const end = Math.min(raw.length, idx + 80);
            const snippet = (start > 0 ? '...' : '') + raw.substring(start, end) + (end < raw.length ? '...' : '');

            results.push({
              chapterIndex: chIdx,
              badge: `Bab ${ch.chapter_num} · Sub-bab ${sec.num}`,
              title: sec.title,
              snippet: snippet
            });
          }
        });
      });
    });

    if (results.length === 0) {
      searchResultsContainer.innerHTML = `
        <div class="search-empty-state">
          <p>Tidak ditemukan materi yang cocok dengan "<strong>${query}</strong>". Coba kata kunci lain.</p>
        </div>
      `;
      return;
    }

    // Highlight search term helper
    const regex = new RegExp(`(${q})`, 'gi');

    let outHtml = `<div style="padding:0.5rem 0.5rem 0.25rem; font-size:0.75rem; color:var(--text-muted); font-weight:700;">DITEMUKAN ${results.length} HASIL</div>`;

    results.slice(0, 20).forEach(res => {
      const hlSnippet = res.snippet.replace(regex, '<span class="search-highlight">$1</span>');
      const hlTitle = res.title.replace(regex, '<span class="search-highlight">$1</span>');

      outHtml += `
        <div class="search-item" data-chapter-index="${res.chapterIndex}">
          <div class="search-item-badge">${res.badge}</div>
          <div class="search-item-title">${hlTitle}</div>
          <div class="search-item-snippet">${hlSnippet}</div>
        </div>
      `;
    });

    searchResultsContainer.innerHTML = outHtml;

    // Attach click events on results
    searchResultsContainer.querySelectorAll('.search-item').forEach(el => {
      el.addEventListener('click', () => {
        const cIdx = parseInt(el.dataset.chapterIndex, 10);
        selectChapter(cIdx);
        closeSearchModal();
      });
    });
  }

  if (searchTriggerBtn) searchTriggerBtn.onclick = openSearchModal;
  if (searchCloseBtn) searchCloseBtn.onclick = closeSearchModal;

  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });
  }

  // Keyboard shortcut: Ctrl+K or Cmd+K
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === 'Escape' && searchModal.style.display === 'flex') {
      closeSearchModal();
    }
  });

  // =========================================================================
  // MOBILE MENU & THEME TOGGLES
  // =========================================================================
  function openMobileMenu() {
    sidebar.classList.add('open');
    sidebarBackdrop.classList.add('show');
  }

  function closeMobileMenu() {
    sidebar.classList.remove('open');
    sidebarBackdrop.classList.remove('show');
  }

  if (mobileMenuBtn) mobileMenuBtn.onclick = openMobileMenu;
  if (sidebarBackdrop) sidebarBackdrop.onclick = closeMobileMenu;

  // Themes: Light, Dark, Sepia
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('stat_teknik_theme', theme);

    themeButtons.forEach(btn => {
      if (btn.dataset.setTheme === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.setTheme);
    });
  });

  // Fonts: Sans vs Serif
  function toggleFont() {
    const current = document.documentElement.getAttribute('data-font') || 'sans';
    const next = current === 'sans' ? 'serif' : 'sans';
    document.documentElement.setAttribute('data-font', next);
    localStorage.setItem('stat_teknik_font', next);
    showToast(`Gaya huruf diubah ke ${next === 'serif' ? 'Serif (Editorial)' : 'Sans-Serif (Modern)'}`);
  }

  if (fontToggleBtn) fontToggleBtn.onclick = toggleFont;

  // Font Size: A- and A+
  let currentFontSize = parseInt(localStorage.getItem('stat_teknik_font_size') || '16', 10);
  function updateFontSize(delta) {
    currentFontSize = Math.max(13, Math.min(22, currentFontSize + delta));
    document.body.style.fontSize = `${currentFontSize}px`;
    localStorage.setItem('stat_teknik_font_size', currentFontSize);
  }

  if (fontIncBtn) fontIncBtn.onclick = () => updateFontSize(1);
  if (fontDecBtn) fontDecBtn.onclick = () => updateFontSize(-1);

  // =========================================================================
  // INITIALIZATION
  // =========================================================================
  function initApp() {
    // Restore Saved Theme
    const savedTheme = localStorage.getItem('stat_teknik_theme') || 'light';
    applyTheme(savedTheme);

    // Restore Saved Font
    const savedFont = localStorage.getItem('stat_teknik_font') || 'sans';
    document.documentElement.setAttribute('data-font', savedFont);

    // Restore Font Size
    document.body.style.fontSize = `${currentFontSize}px`;

    // Load Data: window.EBOOK_DATA or fetch
    if (window.EBOOK_DATA && Array.isArray(window.EBOOK_DATA) && window.EBOOK_DATA.length > 0) {
      chaptersData = window.EBOOK_DATA;
      afterDataLoaded();
    } else {
      fetch('./chapters_data.json')
        .then(r => r.json())
        .then(data => {
          chaptersData = data;
          afterDataLoaded();
        })
        .catch(err => {
          console.error('Error loading chapters data:', err);
          readerContainer.innerHTML = `
            <div style="text-align:center; padding:4rem 1rem; color:var(--brand-red);">
              <h2>Gagal memuat data buku</h2>
              <p>${err.message}</p>
            </div>
          `;
        });
    }
  }

  function afterDataLoaded() {
    updateReadingStats();

    // Determine initial chapter index
    const savedIdx = parseInt(localStorage.getItem('stat_teknik_active_idx') || '1', 10);
    const initialIndex = (savedIdx >= 0 && savedIdx < chaptersData.length) ? savedIdx : 1;

    selectChapter(initialIndex);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
