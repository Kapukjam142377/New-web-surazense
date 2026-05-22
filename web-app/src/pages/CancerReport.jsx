import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  FileText, 
  Printer, 
  Download, 
  User, 
  Calendar, 
  Activity, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  FlaskConical, 
  Lock 
} from 'lucide-react';

// Helper to convert OKLCH computed colors to standard RGB/Hex dynamically using browser canvas API
// and temporarily process/remove stylesheets to resolve oklch parsing crashes in html2canvas
const convertOklchToRgb = (element) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');

  const toRgb = (val) => {
    if (!val || !val.includes('oklch')) return val;
    // Replace every instance of oklch(...) with its standard color equivalent
    return val.replace(/oklch\([^)]+\)/g, (match) => {
      try {
        ctx.fillStyle = match;
        return ctx.fillStyle;
      } catch (e) {
        return match;
      }
    });
  };

  // 1. Process document stylesheets to replace oklch values and temporarily remove them from the DOM
  const nodesToRestore = [];
  let combinedCss = '';

  const styleNodes = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'));
  styleNodes.forEach((node) => {
    if (node.id === 'html2pdf-temp-style-oklch') return;

    try {
      let cssText = '';
      let isReadable = false;

      // Try to read cssText from sheet rules
      const sheet = Array.from(document.styleSheets).find(s => s.ownerNode === node);
      if (sheet) {
        try {
          const rules = sheet.cssRules || sheet.rules;
          if (rules) {
            cssText = Array.from(rules).map(r => r.cssText).join('\n');
            isReadable = true;
          }
        } catch (err) {
          // Cross-origin stylesheet rules cannot be accessed (e.g. Google Fonts)
        }
      }

      // If we couldn't get rules, check if ownerNode is a <style> tag
      if (!cssText && node.tagName.toLowerCase() === 'style') {
        cssText = node.textContent || '';
        isReadable = true;
      }

      if (isReadable) {
        const processed = toRgb(cssText);
        combinedCss += processed + '\n';

        // Temporarily remove from DOM to hide it from html2canvas scanning
        const parent = node.parentNode;
        const nextSibling = node.nextSibling;
        if (parent) {
          parent.removeChild(node);
          nodesToRestore.push({ node, parent, nextSibling });
        }
      }
    } catch (e) {
      console.warn('Error processing style node:', e);
    }
  });

  // Inject temporary processed style block
  const tempStyle = document.createElement('style');
  tempStyle.id = 'html2pdf-temp-style-oklch';
  tempStyle.textContent = combinedCss;
  document.head.appendChild(tempStyle);

  // 2. Process inline computed styles on elements (optimized to color properties)
  const COLOR_PROPS = [
    'color',
    'backgroundColor',
    'borderColor',
    'borderTopColor',
    'borderBottomColor',
    'borderLeftColor',
    'borderRightColor',
    'boxShadow',
    'fill',
    'stroke',
    'outlineColor',
    'textDecorationColor'
  ];

  const elements = element.querySelectorAll('*');
  const inlineOriginals = [];

  const processEl = (el) => {
    const computed = window.getComputedStyle(el);
    const styleOverride = {};

    COLOR_PROPS.forEach(prop => {
      const val = computed[prop];
      if (val && val.includes('oklch')) {
        const rgbVal = toRgb(val);
        if (rgbVal !== val) {
          styleOverride[prop] = rgbVal;
        }
      }
    });

    if (Object.keys(styleOverride).length > 0) {
      const origStyle = el.getAttribute('style') || '';
      inlineOriginals.push({ el, origStyle });
      Object.keys(styleOverride).forEach(prop => {
        el.style[prop] = styleOverride[prop];
      });
    }
  };

  processEl(element);
  elements.forEach(processEl);

  return () => {
    // Remove temporary style
    if (tempStyle.parentNode) {
      tempStyle.parentNode.removeChild(tempStyle);
    }
    // Restore original stylesheets in reverse order to ensure nextSibling reference nodes are already in the DOM
    nodesToRestore.slice().reverse().forEach(({ node, parent, nextSibling }) => {
      try {
        if (parent) {
          parent.insertBefore(node, nextSibling);
        }
      } catch (err) {
        console.warn('Error restoring style node:', err);
      }
    });
    // Restore inline styles
    inlineOriginals.forEach(({ el, origStyle }) => {
      if (origStyle) {
        el.setAttribute('style', origStyle);
      } else {
        el.removeAttribute('style');
      }
    });
  };
};


export default function CancerReport() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('tumor'); // 'tumor' | 'genetics'
  const [isExporting, setIsExporting] = useState(false);

  // Editable Patient Info State
  const [patient, setPatient] = useState({
    name: '',
    sex: '',
    age: '',
    dob: '',
    specimen1: '',
    specimen2: '',
    collectingDate: '',
    receivingDate: '',
    testingDate: ''
  });

  // Editable Tumor Markers Results (Tab 1)
  const [markers, setMarkers] = useState({
    psa: '',
    cea: '',
    ca153: '',
    afp: '',
    hpv: '',
    ctcs: '',
    pca3: '',
    dlx1: ''
  });

  // Editable Gene Mutations Results (Tab 2)
  const [genetics, setGenetics] = useState({
    exon20: '',
    g719x: '',
    exon19: '',
    l858r: ''
  });

  // Effect to handle PDF generation when isExporting becomes true
  useEffect(() => {
    if (!isExporting) return;

    const loadHtml2Pdf = () => {
      return new Promise((resolve, reject) => {
        if (window.html2pdf) {
          resolve(window.html2pdf);
          return;
        }
        const script = document.createElement('script');
        // Load locally hosted html2pdf library to circumvent storage access blocks and tracking prevention errors
        script.src = '/html2pdf.bundle.min.js';
        script.onload = () => resolve(window.html2pdf);
        script.onerror = (err) => reject(err);
        document.body.appendChild(script);
      });
    };

    const generatePdf = async () => {
      let restoreOklch = null;
      try {
        const html2pdf = await loadHtml2Pdf();
        const element = document.getElementById('report-card');
        if (!element) return;

        // Convert OKLCH colors to standard colors temporarily
        restoreOklch = convertOklchToRgb(element);

        const opt = {
          margin:       [10, 10, 10, 10],
          filename:     `Surazense_Report_${patient.name ? patient.name.trim().replace(/\s+/g, '_') : 'Patient'}.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { 
            scale: 2, 
            useCORS: true,
            logging: false
          },
          jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        await html2pdf().from(element).set(opt).save();
      } catch (error) {
        console.error('Failed to generate PDF:', error);
      } finally {
        if (restoreOklch) restoreOklch();
        setIsExporting(false);
      }
    };

    const timer = setTimeout(() => {
      generatePdf();
    }, 150);

    return () => clearTimeout(timer);
  }, [isExporting, patient.name]);

  const handlePatientChange = (field, value) => {
    setPatient(prev => ({ ...prev, [field]: value }));
  };

  const handleMarkerChange = (field, value) => {
    // Only allow numbers and decimal point or empty
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setMarkers(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleGeneticChange = (field, value) => {
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setGenetics(prev => ({ ...prev, [field]: value }));
    }
  };

  // Helper to determine status and styling based on ranges
  const getStatus = (marker, valString) => {
    if (!valString) return { text: '-', color: 'text-slate-400', bg: 'bg-slate-50' };
    const val = parseFloat(valString);
    if (isNaN(val)) return { text: valString, color: 'text-slate-500', bg: 'bg-slate-100' };

    let isHigh = false;
    switch (marker) {
      case 'psa':
        isHigh = val > 4.0;
        break;
      case 'cea':
        isHigh = val > 5.0;
        break;
      case 'ca153':
        isHigh = val > 37.0;
        break;
      case 'afp':
        isHigh = val > 200.0;
        break;
      case 'ctcs':
        isHigh = val > 5.0;
        break;
      case 'pca3':
        isHigh = val > 35.0;
        break;
      default:
        isHigh = false;
    }

    if (isHigh) {
      return { 
        text: t('cancerReportPage.high'), 
        color: 'text-rose-600 font-bold', 
        bg: 'bg-rose-50 border border-rose-100 shadow-sm shadow-rose-100/50' 
      };
    } else {
      return { 
        text: t('cancerReportPage.normal'), 
        color: 'text-emerald-600 font-semibold', 
        bg: 'bg-emerald-50 border border-emerald-100 shadow-sm shadow-emerald-100/50' 
      };
    }
  };

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  // PDF Export Trigger
  const handleExport = () => {
    setIsExporting(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/50 to-white py-12 px-4 sm:px-6 lg:px-8 print:py-0 print:px-0">
      
      {/* Stylesheet specifically to optimize physical print layouts */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background: white !important;
            color: #000 !important;
          }
          nav, footer, .no-print, button, .tab-header-btn {
            display: none !important;
          }
          .print-full-width {
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
          }
          .print-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 12px !important;
          }
          input {
            border: none !important;
            border-bottom: 1px dotted #94a3b8 !important;
            background: transparent !important;
            padding: 0 !important;
            box-shadow: none !important;
            color: black !important;
          }
          .print-border {
            border: 1px solid #cbd5e1 !important;
          }
          .print-force-visible {
            display: block !important;
          }
        }

        /* PDF Export Overrides */
        .is-exporting {
          background: white !important;
          color: #000 !important;
          padding: 20px !important;
        }
        .is-exporting .no-print {
          display: none !important;
        }
        .is-exporting .print-force-visible {
          display: block !important;
        }
        .is-exporting .print-full-width {
          width: 100% !important;
          max-width: 100% !important;
          box-shadow: none !important;
          border: none !important;
          margin: 0 !important;
          padding: 0 !important;
          background: transparent !important;
        }
        .is-exporting .print-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 12px !important;
        }
        .is-exporting input {
          border: none !important;
          border-bottom: 1px dotted #94a3b8 !important;
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
          color: black !important;
          outline: none !important;
          pointer-events: none !important;
        }
        .is-exporting .print-border {
          border: 1px solid #cbd5e1 !important;
        }
      `}} />

      <div className="max-w-4xl mx-auto print-full-width">
        {/* Document Card Panel */}
        <div 
          id="report-card" 
          className={`bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_-15px_rgba(2,132,199,0.06)] p-6 md:p-10 print-full-width print:border-none ${isExporting ? 'is-exporting' : ''}`}
        >
          
          {/* Diagnostic Lab Letterhead / Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-100 pb-8 mb-8 print:border-b-2 print:border-slate-300">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <img src="/logo.png" alt="Surazense Logo" className="h-14 w-auto object-contain" />
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Surazense</span>
                  <span className="text-xs px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold uppercase tracking-wide no-print">
                    Diagnostic Lab
                  </span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">Advanced QCM Biosensor Systems</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <h2 className="text-xl font-black text-blue-600 uppercase tracking-wide">
                {t('cancerReportPage.title')}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
                {t('cancerReportPage.subtitle')}
              </p>
            </div>
          </div>

          {/* Patient Details Sub-Section */}
          <div className="bg-slate-50/70 border border-slate-100/50 rounded-2xl p-6 mb-8 print:bg-transparent print:border print:border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {t('cancerReportPage.patientInfo')}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-8 md:gap-y-4 print-grid">
              
              {/* Patient Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3 h-3 text-slate-400" />
                  {t('cancerReportPage.name')}
                </label>
                <input 
                  type="text" 
                  value={patient.name} 
                  onChange={(e) => handlePatientChange('name', e.target.value)}
                  placeholder={t('cancerReportPage.enterName')}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all shadow-sm"
                />
              </div>

              {/* Sex */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('cancerReportPage.sex')}
                  </label>
                  <input 
                    type="text" 
                    value={patient.sex} 
                    onChange={(e) => handlePatientChange('sex', e.target.value)}
                    placeholder={t('cancerReportPage.enterSex')}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
                  />
                </div>
                {/* Age */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('cancerReportPage.age')}
                  </label>
                  <input 
                    type="text" 
                    value={patient.age} 
                    onChange={(e) => handlePatientChange('age', e.target.value)}
                    placeholder={t('cancerReportPage.enterAge')}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* DOB */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {t('cancerReportPage.dob')}
                </label>
                <input 
                  type="date" 
                  value={patient.dob} 
                  onChange={(e) => handlePatientChange('dob', e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm cursor-pointer"
                />
              </div>

              {/* Specimen 1 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {t('cancerReportPage.specimenType1')}
                </label>
                <input 
                  type="text" 
                  value={patient.specimen1} 
                  onChange={(e) => handlePatientChange('specimen1', e.target.value)}
                  placeholder={t('cancerReportPage.enterSpecimen')}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
                />
              </div>

              {/* Specimen 2 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {t('cancerReportPage.specimenType2')}
                </label>
                <input 
                  type="text" 
                  value={patient.specimen2} 
                  onChange={(e) => handlePatientChange('specimen2', e.target.value)}
                  placeholder={t('cancerReportPage.enterSpecimen')}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
                />
              </div>

              {/* Collecting Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {t('cancerReportPage.collectingDate')}
                </label>
                <input 
                  type="date" 
                  value={patient.collectingDate} 
                  onChange={(e) => handlePatientChange('collectingDate', e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm cursor-pointer"
                />
              </div>

              {/* Receiving Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {t('cancerReportPage.receivingDate')}
                </label>
                <input 
                  type="date" 
                  value={patient.receivingDate} 
                  onChange={(e) => handlePatientChange('receivingDate', e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm cursor-pointer"
                />
              </div>

              {/* Testing / Report Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {language === 'th' ? 'วันที่ทำการวิเคราะห์' : 'Testing Date'}
                </label>
                <input 
                  type="date" 
                  value={patient.testingDate} 
                  onChange={(e) => handlePatientChange('testingDate', e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm cursor-pointer"
                />
              </div>

            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex border-b border-slate-200 mb-6 gap-2 no-print">
            <button
              onClick={() => setActiveTab('tumor')}
              className={`pb-3 px-4 font-bold text-sm tracking-wide border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'tumor' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Activity className="w-4 h-4" />
              {t('cancerReportPage.tabTumor')}
            </button>
            <button
              onClick={() => setActiveTab('genetics')}
              className={`pb-3 px-4 font-bold text-sm tracking-wide border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'genetics' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              {t('cancerReportPage.tabGenetics')}
            </button>
          </div>

          {/* TAB 1: Tumor Markers & Scores */}
          <div className={activeTab === 'tumor' ? 'block' : 'hidden print-force-visible'}>
            <div className="overflow-x-auto print-border rounded-xl border border-slate-100 shadow-sm shadow-slate-100/10 mb-8">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                        <th className="py-3.5 px-5">{t('cancerReportPage.tumorMarkers')}</th>
                        <th className="py-3.5 px-5 text-center w-28">{t('cancerReportPage.result')}</th>
                        <th className="py-3.5 px-5 text-center w-24">{t('cancerReportPage.unit')}</th>
                        <th className="py-3.5 px-5 text-center w-40">{t('cancerReportPage.referenceRange')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      
                      {/* PSA Row */}
                      <tr className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-5 font-semibold text-slate-900">{t('cancerReportPage.psa')}</td>
                        <td className="py-4 px-5 text-center">
                          <input 
                            type="text" 
                            value={markers.psa} 
                            onChange={(e) => handleMarkerChange('psa', e.target.value)}
                            className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                          />
                        </td>
                        <td className="py-4 px-5 text-center text-blue-600 font-medium select-all">ng/mL</td>
                        <td className="py-4 px-5 text-center font-medium">
                          <span className="px-2.5 py-1 bg-slate-100/50 rounded-md border border-slate-200/50 text-slate-500">0.0-4.0</span>
                        </td>
                      </tr>

                      {/* CEA Row */}
                      <tr className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-5 font-semibold text-slate-900">{t('cancerReportPage.cea')}</td>
                        <td className="py-4 px-5 text-center">
                          <input 
                            type="text" 
                            value={markers.cea} 
                            onChange={(e) => handleMarkerChange('cea', e.target.value)}
                            className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                          />
                        </td>
                        <td className="py-4 px-5 text-center text-blue-600 font-medium select-all">ng/mL</td>
                        <td className="py-4 px-5 text-center font-medium">
                          <span className="px-2.5 py-1 bg-slate-100/50 rounded-md border border-slate-200/50 text-slate-500">0.0-5.0</span>
                        </td>
                      </tr>

                      {/* CA 15-3 Row */}
                      <tr className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-5 font-semibold text-slate-900">{t('cancerReportPage.ca153')}</td>
                        <td className="py-4 px-5 text-center">
                          <input 
                            type="text" 
                            value={markers.ca153} 
                            onChange={(e) => handleMarkerChange('ca153', e.target.value)}
                            className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                          />
                        </td>
                        <td className="py-4 px-5 text-center text-blue-600 font-medium select-all">U/mL</td>
                        <td className="py-4 px-5 text-center font-medium">
                          <span className="px-2.5 py-1 bg-slate-100/50 rounded-md border border-slate-200/50 text-slate-500">0-37</span>
                        </td>
                      </tr>

                      {/* AFP Row */}
                      <tr className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-5 font-semibold text-slate-900">{t('cancerReportPage.afp')}</td>
                        <td className="py-4 px-5 text-center">
                          <input 
                            type="text" 
                            value={markers.afp} 
                            onChange={(e) => handleMarkerChange('afp', e.target.value)}
                            placeholder="-"
                            className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                          />
                        </td>
                        <td className="py-4 px-5 text-center text-blue-600 font-medium select-all">ng/mL</td>
                        <td className="py-4 px-5 text-center font-medium">
                          <span className="px-2.5 py-1 bg-slate-100/50 rounded-md border border-slate-200/50 text-slate-500">Cut off 200</span>
                        </td>
                      </tr>

                      {/* HPV DNA Row */}
                      <tr className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-5 font-semibold text-slate-900">{t('cancerReportPage.hpv')}</td>
                        <td className="py-4 px-5 text-center">
                          <input 
                            type="text" 
                            value={markers.hpv} 
                            onChange={(e) => setMarkers(prev => ({ ...prev, hpv: e.target.value }))}
                            placeholder="-"
                            className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                          />
                        </td>
                        <td className="py-4 px-5 text-center text-blue-600 font-medium select-all">Copies/mL</td>
                        <td className="py-4 px-5 text-center font-medium text-xs text-slate-500 leading-snug">
                          HPV 16: 10³-10⁸ copies/ml<br/>
                          HPV 18: 10³-10⁸ copies/ml
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </div>

                {/* Tab 1 Section 2: Clinical Scores */}
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                  {t('cancerReportPage.score')}
                </h4>

                <div className="overflow-x-auto print-border rounded-xl border border-slate-100 shadow-sm shadow-slate-100/10 mb-8">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                        <th className="py-3.5 px-5">{t('cancerReportPage.score')} Name</th>
                        <th className="py-3.5 px-5 text-center w-28">{t('cancerReportPage.result')}</th>
                        <th className="py-3.5 px-5 text-center w-24">Status</th>
                        <th className="py-3.5 px-5 text-center w-40">{t('cancerReportPage.referenceRange')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      
                      {/* CT CS Row */}
                      <tr className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-5 font-semibold text-slate-900">{t('cancerReportPage.ctcs')}</td>
                        <td className="py-4 px-5 text-center">
                          <input 
                            type="text" 
                            value={markers.ctcs} 
                            onChange={(e) => handleMarkerChange('ctcs', e.target.value)}
                            className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                          />
                        </td>
                        <td className="py-4 px-5 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatus('ctcs', markers.ctcs).bg} ${getStatus('ctcs', markers.ctcs).color}`}>
                            {getStatus('ctcs', markers.ctcs).text}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center font-medium">
                          <span className="px-2.5 py-1 bg-slate-100/50 rounded-md border border-slate-200/50 text-slate-500 text-xs select-all">&gt; 5 CTCs / 7.5 mL</span>
                        </td>
                      </tr>

                      {/* PCA3 Row */}
                      <tr className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-5 font-semibold text-slate-900">{t('cancerReportPage.pca3')}</td>
                        <td className="py-4 px-5 text-center">
                          <input 
                            type="text" 
                            value={markers.pca3} 
                            onChange={(e) => handleMarkerChange('pca3', e.target.value)}
                            className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                          />
                        </td>
                        <td className="py-4 px-5 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatus('pca3', markers.pca3).bg} ${getStatus('pca3', markers.pca3).color}`}>
                            {getStatus('pca3', markers.pca3).text}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center font-medium">
                          <span className="px-2.5 py-1 bg-slate-100/50 rounded-md border border-slate-200/50 text-slate-500 text-xs">Cut off : 35</span>
                        </td>
                      </tr>

                      {/* DLX1 Row */}
                      <tr className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-5 font-semibold text-slate-900">{t('cancerReportPage.dlx1')}</td>
                        <td className="py-4 px-5 text-center">
                          <input 
                            type="text" 
                            value={markers.dlx1} 
                            onChange={(e) => setMarkers(prev => ({ ...prev, dlx1: e.target.value }))}
                            placeholder="N/A"
                            className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                          />
                        </td>
                        <td className="py-4 px-5 text-center text-slate-400">-</td>
                        <td className="py-4 px-5 text-center font-medium">
                          <span className="px-2.5 py-1 bg-slate-100/50 rounded-md border border-slate-200/50 text-slate-500 text-xs">Cut off : N/A</span>
                        </td>
                      </tr>

                    </tbody>
                  </table>
            </div>
          </div>

          {/* TAB 2: Genetic Mutations (Exons) */}
          <div className={activeTab === 'genetics' ? 'block' : 'hidden print-force-visible'}>
            <div className="overflow-x-auto print-border rounded-xl border border-slate-100 shadow-sm shadow-slate-100/10 mb-8">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                        <th className="py-3.5 px-5">Mutations / Exons</th>
                        <th className="py-3.5 px-5 text-center w-28">{t('cancerReportPage.result')}</th>
                        <th className="py-3.5 px-5 text-center w-28">{t('cancerReportPage.unit')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      
                      {/* Exon 20 */}
                      <tr className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-5 font-semibold text-slate-900">{t('cancerReportPage.exon20')}</td>
                        <td className="py-4 px-5 text-center">
                          <input 
                            type="text" 
                            value={genetics.exon20} 
                            onChange={(e) => handleGeneticChange('exon20', e.target.value)}
                            className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                          />
                        </td>
                        <td className="py-4 px-5 text-center text-blue-600 font-medium">ng/mL</td>
                      </tr>

                      {/* G719X */}
                      <tr className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-5 font-semibold text-slate-900">{t('cancerReportPage.g719x')}</td>
                        <td className="py-4 px-5 text-center">
                          <input 
                            type="text" 
                            value={genetics.g719x} 
                            onChange={(e) => setGenetics(prev => ({ ...prev, g719x: e.target.value }))}
                            placeholder="-"
                            className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                          />
                        </td>
                        <td className="py-4 px-5 text-center text-blue-600 font-medium">ng/mL</td>
                      </tr>

                      {/* Exon 19 */}
                      <tr className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-5 font-semibold text-slate-900">{t('cancerReportPage.exon19')}</td>
                        <td className="py-4 px-5 text-center">
                          <input 
                            type="text" 
                            value={genetics.exon19} 
                            onChange={(e) => setGenetics(prev => ({ ...prev, exon19: e.target.value }))}
                            placeholder="-"
                            className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                          />
                        </td>
                        <td className="py-4 px-5 text-center text-blue-600 font-medium">ng/mL</td>
                      </tr>

                      {/* L858R */}
                      <tr className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-5 font-semibold text-slate-900">{t('cancerReportPage.l858r')}</td>
                        <td className="py-4 px-5 text-center">
                          <input 
                            type="text" 
                            value={genetics.l858r} 
                            onChange={(e) => setGenetics(prev => ({ ...prev, l858r: e.target.value }))}
                            placeholder="-"
                            className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                          />
                        </td>
                        <td className="py-4 px-5 text-center text-blue-600 font-medium">ng/mL</td>
                      </tr>

                    </tbody>
                  </table>
            </div>
          </div>

          {/* Scientific Disclaimer / Calculation Formula Row */}
          <div className="bg-slate-50/50 border border-slate-100 border-dashed rounded-2xl p-4 flex items-start gap-3.5 mb-8">
            <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {t('cancerReportPage.formulaText')}
            </p>
          </div>

          {/* Interactive Navigation and Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100 pt-8 no-print">
            
            {/* Tab navigation helpers */}
            <div className="flex items-center gap-2.5">
              {activeTab === 'genetics' ? (
                <button
                  onClick={() => setActiveTab('tumor')}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 border-0 cursor-pointer shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t('cancerReportPage.back')}
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('genetics')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 border-0 cursor-pointer shadow-md shadow-blue-500/20"
                >
                  {t('cancerReportPage.next')}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Document Print/Export actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4 text-slate-400" />
                {t('cancerReportPage.export')}
              </button>
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                {t('cancerReportPage.print')}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
