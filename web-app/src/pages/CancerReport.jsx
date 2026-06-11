import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useUser } from "../context/UserContext";
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
  Lock,
  Trash2,
  Database,
} from "lucide-react";

// Helper to convert OKLCH computed colors to standard RGB/Hex dynamically using browser canvas API
// and temporarily process/remove stylesheets to resolve oklch parsing crashes in html2canvas
const convertOklchToRgb = (element) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");

  const toRgb = (val) => {
    if (!val || !val.includes("oklch")) return val;
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
  let combinedCss = "";

  const styleNodes = Array.from(
    document.querySelectorAll('style, link[rel="stylesheet"]'),
  );
  styleNodes.forEach((node) => {
    if (node.id === "html2pdf-temp-style-oklch") return;

    try {
      let cssText = "";
      let isReadable = false;

      // Try to read cssText from sheet rules
      const sheet = Array.from(document.styleSheets).find(
        (s) => s.ownerNode === node,
      );
      if (sheet) {
        try {
          const rules = sheet.cssRules || sheet.rules;
          if (rules) {
            cssText = Array.from(rules)
              .map((r) => r.cssText)
              .join("\n");
            isReadable = true;
          }
        } catch (err) {
          // Cross-origin stylesheet rules cannot be accessed (e.g. Google Fonts)
        }
      }

      // If we couldn't get rules, check if ownerNode is a <style> tag
      if (!cssText && node.tagName.toLowerCase() === "style") {
        cssText = node.textContent || "";
        isReadable = true;
      }

      if (isReadable) {
        const processed = toRgb(cssText);
        combinedCss += processed + "\n";

        // Temporarily remove from DOM to hide it from html2canvas scanning
        const parent = node.parentNode;
        const nextSibling = node.nextSibling;
        if (parent) {
          parent.removeChild(node);
          nodesToRestore.push({ node, parent, nextSibling });
        }
      }
    } catch (e) {
      console.warn("Error processing style node:", e);
    }
  });

  // Inject temporary processed style block
  const tempStyle = document.createElement("style");
  tempStyle.id = "html2pdf-temp-style-oklch";
  tempStyle.textContent = combinedCss;
  document.head.appendChild(tempStyle);

  // 2. Process inline computed styles on elements (optimized to color properties)
  const COLOR_PROPS = [
    "color",
    "backgroundColor",
    "borderColor",
    "borderTopColor",
    "borderBottomColor",
    "borderLeftColor",
    "borderRightColor",
    "boxShadow",
    "fill",
    "stroke",
    "outlineColor",
    "textDecorationColor",
  ];

  const elements = element.querySelectorAll("*");
  const inlineOriginals = [];

  const processEl = (el) => {
    const computed = window.getComputedStyle(el);
    const styleOverride = {};

    COLOR_PROPS.forEach((prop) => {
      const val = computed[prop];
      if (val && val.includes("oklch")) {
        const rgbVal = toRgb(val);
        if (rgbVal !== val) {
          styleOverride[prop] = rgbVal;
        }
      }
    });

    if (Object.keys(styleOverride).length > 0) {
      const origStyle = el.getAttribute("style") || "";
      inlineOriginals.push({ el, origStyle });
      Object.keys(styleOverride).forEach((prop) => {
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
    nodesToRestore
      .slice()
      .reverse()
      .forEach(({ node, parent, nextSibling }) => {
        try {
          if (parent) {
            parent.insertBefore(node, nextSibling);
          }
        } catch (err) {
          console.warn("Error restoring style node:", err);
        }
      });
    // Restore inline styles
    inlineOriginals.forEach(({ el, origStyle }) => {
      if (origStyle) {
        el.setAttribute("style", origStyle);
      } else {
        el.removeAttribute("style");
      }
    });
  };
};

export default function CancerReport() {
  const { t, language } = useLanguage();
  const { user, loading, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login?redirect=/cancer-report");
    }
  }, [user, loading, navigate]);

  const [activeTab, setActiveTab] = useState("tumor"); // 'tumor' | 'genetics'
  const [isExporting, setIsExporting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [savedReports, setSavedReports] = useState([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedDrawer, setShowSavedDrawer] = useState(false);
  const [toast, setToast] = useState({ message: "", type: null });

  // Search & Filters State (Requirement 2.1.4)
  const [searchQuery, setSearchQuery] = useState({
    name: "",
    sex: "",
    age: "",
    dob: "",
    specimen: "",
    collectingDate: "",
    receivingDate: "",
  });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const filteredReports = savedReports.filter((report) => {
    const pName = report.patient?.name || "";
    const pSex = report.patient?.sex || "";
    const pAge = report.patient?.age !== null && report.patient?.age !== undefined ? String(report.patient.age) : "";
    const pDob = report.patient?.dob || "";
    const pSpecimen1 = report.specimen1 || "";
    const pSpecimen2 = report.specimen2 || "";
    const pCollDate = report.collecting_date || "";
    const pRecDate = report.receiving_date || "";

    const matchesName = pName.toLowerCase().includes(searchQuery.name.toLowerCase());
    const matchesSex = searchQuery.sex === "" || 
      pSex.toLowerCase() === searchQuery.sex.toLowerCase() ||
      (searchQuery.sex.toLowerCase() === "m" && pSex.toLowerCase().startsWith("m")) ||
      (searchQuery.sex.toLowerCase() === "f" && pSex.toLowerCase().startsWith("f"));
    const matchesAge = searchQuery.age === "" || pAge === searchQuery.age;
    const matchesDob = searchQuery.dob === "" || pDob === searchQuery.dob;
    const matchesSpecimen = searchQuery.specimen === "" || 
      pSpecimen1.toLowerCase().includes(searchQuery.specimen.toLowerCase()) ||
      pSpecimen2.toLowerCase().includes(searchQuery.specimen.toLowerCase());
    const matchesCollDate = searchQuery.collectingDate === "" || pCollDate === searchQuery.collectingDate;
    const matchesRecDate = searchQuery.receivingDate === "" || pRecDate === searchQuery.receivingDate;

    return matchesName && matchesSex && matchesAge && matchesDob && matchesSpecimen && matchesCollDate && matchesRecDate;
  });

  // CSV Export Logic (Requirement 2.1.5)
  const handleExportCSV = () => {
    if (!patient.name.trim()) {
      setToast({
        message: language === "th" ? "กรุณากรอกชื่อผู้ป่วยก่อนส่งออกข้อมูล" : "Please enter patient name before exporting",
        type: "error",
      });
      return;
    }

    let csvContent = "\uFEFF"; // UTF-8 BOM for Excel compatibility with Noto Sans Thai character sets
    
    // Section 1: Patient Information
    csvContent += `Patient Information\n`;
    csvContent += `Name,Sex,Age,Date of Birth,Specimen Type 1,Specimen Type 2,Collecting Date,Receiving Date,Testing Date\n`;
    csvContent += `"${patient.name}","${patient.sex}","${patient.age}","${patient.dob}","${patient.specimen1}","${patient.specimen2}","${patient.collectingDate}","${patient.receivingDate}","${patient.testingDate}"\n\n`;

    // Section 2: Tumor Markers
    csvContent += `Tumor Markers & Scores\n`;
    csvContent += `Marker Name,Result,Unit,Reference Range,Status\n`;
    csvContent += `"Prostate-Specific Antigen (PSA)","${markers.psa}","ng/mL","0.0-4.0","${getStatus("psa", markers.psa).text}"\n`;
    csvContent += `"Carcinoembryonic antigen (CEA)","${markers.cea}","ng/mL","0.0-5.0","${getStatus("cea", markers.cea).text}"\n`;
    csvContent += `"Cancer Antigen 15-3 (CA 15-3)","${markers.ca153}","U/mL","0-37","${getStatus("ca153", markers.ca153).text}"\n`;
    csvContent += `"Alpha-Fetoprotein (AFP)","${markers.afp}","ng/mL","Cut off 200","${getStatus("afp", markers.afp).text}"\n`;
    csvContent += `"Human Papillomavirus DNA (HPV)","${markers.hpv}","Copies/mL","10³-10⁸ copies/ml","-"\n`;
    csvContent += `"CT CS (Circulating Tumor Cells)","${markers.ctcs}","CTCs / 7.5 mL","> 5 CTCs / 7.5 mL","${getStatus("ctcs", markers.ctcs).text}"\n`;
    csvContent += `"Prostate Cancer gene 3 (PCA3)","${markers.pca3}","-","Cut off : 35","${getStatus("pca3", markers.pca3).text}"\n`;
    csvContent += `"Distal-Less Homeobox 1 (DLX1)","${markers.dlx1}","-","Cut off : N/A","-"\n\n`;

    // Section 3: Genetic Mutations
    csvContent += `Genetic Mutations (Exons)\n`;
    csvContent += `Mutation Name,Result,Unit\n`;
    csvContent += `"Exon 20 Insertion","${genetics.exon20}","ng/mL"\n`;
    csvContent += `"G719X","${genetics.g719x}","ng/mL"\n`;
    csvContent += `"Exon 19 Del, L858R","${genetics.exon19}","ng/mL"\n`;
    csvContent += `"L858R","${genetics.l858r}","ng/mL"\n`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Surazense_Report_${patient.name.trim().replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setToast({
      message: language === "th" ? "ส่งออกไฟล์ CSV เรียบร้อยแล้ว" : "CSV exported successfully",
      type: "success",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 font-medium">Loading...</div>
      </div>
    );
  }

  const isAuthorized =
    user &&
    (user.role === "doctor" ||
      user.role === "patient" ||
      user.role === "admin");

  if (!isAuthorized) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center px-6 py-12">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 md:p-12 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-rose-100">
            <Lock className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">
            {language === "th" ? "ปฏิเสธการเข้าถึง" : "Access Denied"}
          </h2>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">
            {language === "th"
              ? "หน้านี้จำกัดสิทธิ์เฉพาะ แพทย์ (Doctor) หรือ คนไข้ (Patient) เท่านั้น บัญชีของคุณไม่มีสิทธิ์ในการเข้าถึงรายงานวิเคราะห์โรคมะเร็ง"
              : "This page is restricted to Doctors or Patients. Your account does not have permission to access the cancer detection reports."}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all text-center no-underline border-none cursor-pointer text-sm"
            >
              {language === "th" ? "กลับหน้าหลัก" : "Go to Home"}
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/login?redirect=/cancer-report");
              }}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-4 rounded-xl transition-all text-center border border-slate-200 cursor-pointer text-sm"
            >
              {language === "th"
                ? "ออกจากระบบเพื่อเปลี่ยนบัญชี"
                : "Log Out & Switch Account"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Auto-hide toast notifications after 3 seconds
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => {
        setToast({ message: "", type: null });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.message]);

  const fetchSavedReports = async () => {
    setIsLoadingSaved(true);
    try {
      const res = await fetch(`${API_URL}/api/reports`);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setSavedReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingSaved(false);
    }
  };

  useEffect(() => {
    fetchSavedReports();
  }, []);

  const handleSaveReport = async () => {
    if (!patient.name.trim()) {
      setToast({
        message:
          language === "th"
            ? "กรุณากรอกชื่อผู้ป่วยก่อนบันทึก"
            : "Please enter patient name before saving",
        type: "error",
      });
      return;
    }
    setIsSaving(true);
    try {
      const body = {
        specimen1: patient.specimen1 || null,
        specimen2: patient.specimen2 || null,
        collecting_date: patient.collectingDate || null,
        receiving_date: patient.receivingDate || null,
        testing_date: patient.testingDate || null,
        patient: {
          name: patient.name,
          sex: patient.sex || null,
          age: patient.age ? parseInt(patient.age, 10) : null,
          dob: patient.dob || null,
        },
        markers: {
          psa: markers.psa ? parseFloat(markers.psa) : null,
          cea: markers.cea ? parseFloat(markers.cea) : null,
          ca153: markers.ca153 ? parseFloat(markers.ca153) : null,
          afp: markers.afp ? parseFloat(markers.afp) : null,
          hpv: markers.hpv || null,
          ctcs: markers.ctcs ? parseFloat(markers.ctcs) : null,
          pca3: markers.pca3 ? parseFloat(markers.pca3) : null,
          dlx1: markers.dlx1 || null,
        },
        genetics: {
          exon20: genetics.exon20 ? parseFloat(genetics.exon20) : null,
          g719x: genetics.g719x ? parseFloat(genetics.g719x) : null,
          exon19: genetics.exon19 ? parseFloat(genetics.exon19) : null,
          l858r: genetics.l858r ? parseFloat(genetics.l858r) : null,
        },
      };

      const res = await fetch(`${API_URL}/api/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Save failed");

      setToast({ message: t("cancerReportPage.saveSuccess"), type: "success" });
      fetchSavedReports();
    } catch (err) {
      console.error(err);
      setToast({ message: t("cancerReportPage.saveError"), type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadReport = (report) => {
    try {
      setPatient({
        name: report.patient?.name || "",
        sex: report.patient?.sex || "",
        age:
          report.patient?.age !== null && report.patient?.age !== undefined
            ? String(report.patient.age)
            : "",
        dob: report.patient?.dob || "",
        specimen1: report.specimen1 || "",
        specimen2: report.specimen2 || "",
        collectingDate: report.collecting_date || "",
        receivingDate: report.receiving_date || "",
        testingDate: report.testing_date || "",
      });

      setMarkers({
        psa:
          report.markers?.psa !== null && report.markers?.psa !== undefined
            ? String(report.markers.psa)
            : "",
        cea:
          report.markers?.cea !== null && report.markers?.cea !== undefined
            ? String(report.markers.cea)
            : "",
        ca153:
          report.markers?.ca153 !== null && report.markers?.ca153 !== undefined
            ? String(report.markers.ca153)
            : "",
        afp:
          report.markers?.afp !== null && report.markers?.afp !== undefined
            ? String(report.markers.afp)
            : "",
        hpv: report.markers?.hpv || "",
        ctcs:
          report.markers?.ctcs !== null && report.markers?.ctcs !== undefined
            ? String(report.markers.ctcs)
            : "",
        pca3:
          report.markers?.pca3 !== null && report.markers?.pca3 !== undefined
            ? String(report.markers.pca3)
            : "",
        dlx1: report.markers?.dlx1 || "",
      });

      setGenetics({
        exon20:
          report.genetics?.exon20 !== null &&
          report.genetics?.exon20 !== undefined
            ? String(report.genetics.exon20)
            : "",
        g719x:
          report.genetics?.g719x !== null &&
          report.genetics?.g719x !== undefined
            ? String(report.genetics.g719x)
            : "",
        exon19:
          report.genetics?.exon19 !== null &&
          report.genetics?.exon19 !== undefined
            ? String(report.genetics.exon19)
            : "",
        l858r:
          report.genetics?.l858r !== null &&
          report.genetics?.l858r !== undefined
            ? String(report.genetics.l858r)
            : "",
      });

      setToast({ message: t("cancerReportPage.loadSuccess"), type: "success" });
      setShowSavedDrawer(false);
    } catch (err) {
      console.error(err);
      setToast({ message: t("cancerReportPage.loadError"), type: "error" });
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (
      !window.confirm(
        language === "th"
          ? "คุณแน่ใจหรือไม่ที่จะลบรายงานนี้?"
          : "Are you sure you want to delete this report?",
      )
    )
      return;
    try {
      const res = await fetch(`${API_URL}/api/reports/${reportId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setSavedReports((prev) => prev.filter((r) => r.id !== reportId));
      setToast({
        message: t("cancerReportPage.deleteSuccess"),
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({ message: t("cancerReportPage.deleteError"), type: "error" });
    }
  };

  // Editable Patient Info State
  const [patient, setPatient] = useState({
    name: "",
    sex: "",
    age: "",
    dob: "",
    specimen1: "",
    specimen2: "",
    collectingDate: "",
    receivingDate: "",
    testingDate: "",
  });

  // Editable Tumor Markers Results (Tab 1)
  const [markers, setMarkers] = useState({
    psa: "",
    cea: "",
    ca153: "",
    afp: "",
    hpv: "",
    ctcs: "",
    pca3: "",
    dlx1: "",
  });

  // Editable Gene Mutations Results (Tab 2)
  const [genetics, setGenetics] = useState({
    exon20: "",
    g719x: "",
    exon19: "",
    l858r: "",
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
        const script = document.createElement("script");
        // Load locally hosted html2pdf library to circumvent storage access blocks and tracking prevention errors
        script.src = "/html2pdf.bundle.min.js";
        script.onload = () => resolve(window.html2pdf);
        script.onerror = (err) => reject(err);
        document.body.appendChild(script);
      });
    };

    const generatePdf = async () => {
      let restoreOklch = null;
      try {
        const html2pdf = await loadHtml2Pdf();
        const element = document.getElementById("report-card");
        if (!element) return;

        // Convert OKLCH colors to standard colors temporarily
        restoreOklch = convertOklchToRgb(element);

        const opt = {
          margin: [10, 10, 10, 10],
          filename: `Surazense_Report_${patient.name ? patient.name.trim().replace(/\s+/g, "_") : "Patient"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        await html2pdf().from(element).set(opt).save();
      } catch (error) {
        console.error("Failed to generate PDF:", error);
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
    setPatient((prev) => ({ ...prev, [field]: value }));
  };

  const handleMarkerChange = (field, value) => {
    // Only allow numbers and decimal point or empty
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setMarkers((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleGeneticChange = (field, value) => {
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setGenetics((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Helper to determine status and styling based on ranges
  const getStatus = (marker, valString) => {
    if (!valString)
      return { text: "-", color: "text-slate-400", bg: "bg-slate-50" };
    const val = parseFloat(valString);
    if (isNaN(val))
      return { text: valString, color: "text-slate-500", bg: "bg-slate-100" };

    let isHigh = false;
    switch (marker) {
      case "psa":
        isHigh = val > 4.0;
        break;
      case "cea":
        isHigh = val > 5.0;
        break;
      case "ca153":
        isHigh = val > 37.0;
        break;
      case "afp":
        isHigh = val > 200.0;
        break;
      case "ctcs":
        isHigh = val > 5.0;
        break;
      case "pca3":
        isHigh = val > 35.0;
        break;
      default:
        isHigh = false;
    }

    if (isHigh) {
      return {
        text: t("cancerReportPage.high"),
        color: "text-rose-600 font-bold",
        bg: "bg-rose-50 border border-rose-100 shadow-sm shadow-rose-100/50",
      };
    } else {
      return {
        text: t("cancerReportPage.normal"),
        color: "text-emerald-600 font-semibold",
        bg: "bg-emerald-50 border border-emerald-100 shadow-sm shadow-emerald-100/50",
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
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
      `,
        }}
      />

      <div className="max-w-4xl mx-auto print-full-width">
        {/* Document Card Panel */}
        <div
          id="report-card"
          className={`bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_-15px_rgba(2,132,199,0.06)] p-6 md:p-10 print-full-width print:border-none ${isExporting ? "is-exporting" : ""}`}
        >
          {/* Diagnostic Lab Letterhead / Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-100 pb-8 mb-8 print:border-b-2 print:border-slate-300">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <img
                src="/logo.png"
                alt="Surazense Logo"
                className="h-14 w-auto object-contain"
              />
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Surazense</span>
                  <span className="text-xs px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold uppercase tracking-wide no-print">
                    Diagnostic Lab
                  </span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">
                  Advanced QCM Biosensor Systems
                </p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <h2 className="text-xl font-black text-blue-600 uppercase tracking-wide">
                {t("cancerReportPage.title")}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
                {t("cancerReportPage.subtitle")}
              </p>
            </div>
          </div>

          {/* Patient Details Sub-Section */}
          <div className="bg-slate-50/70 border border-slate-100/50 rounded-2xl p-6 mb-8 print:bg-transparent print:border print:border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {t("cancerReportPage.patientInfo")}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-8 md:gap-y-4 print-grid">
              {/* Patient Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3 h-3 text-slate-400" />
                  {t("cancerReportPage.name")}
                </label>
                <input
                  type="text"
                  value={patient.name}
                  onChange={(e) => handlePatientChange("name", e.target.value)}
                  placeholder={t("cancerReportPage.enterName")}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all shadow-sm"
                />
              </div>

              {/* Sex */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t("cancerReportPage.sex")}
                  </label>
                  <input
                    type="text"
                    value={patient.sex}
                    onChange={(e) => handlePatientChange("sex", e.target.value)}
                    placeholder={t("cancerReportPage.enterSex")}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
                  />
                </div>
                {/* Age */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t("cancerReportPage.age")}
                  </label>
                  <input
                    type="text"
                    value={patient.age}
                    onChange={(e) => handlePatientChange("age", e.target.value)}
                    placeholder={t("cancerReportPage.enterAge")}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* DOB */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {t("cancerReportPage.dob")}
                </label>
                <input
                  type="date"
                  value={patient.dob}
                  onChange={(e) => handlePatientChange("dob", e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm cursor-pointer"
                />
              </div>

              {/* Specimen 1 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {t("cancerReportPage.specimenType1")}
                </label>
                <input
                  type="text"
                  value={patient.specimen1}
                  onChange={(e) =>
                    handlePatientChange("specimen1", e.target.value)
                  }
                  placeholder={t("cancerReportPage.enterSpecimen")}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
                />
              </div>

              {/* Specimen 2 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {t("cancerReportPage.specimenType2")}
                </label>
                <input
                  type="text"
                  value={patient.specimen2}
                  onChange={(e) =>
                    handlePatientChange("specimen2", e.target.value)
                  }
                  placeholder={t("cancerReportPage.enterSpecimen")}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
                />
              </div>

              {/* Collecting Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {t("cancerReportPage.collectingDate")}
                </label>
                <input
                  type="date"
                  value={patient.collectingDate}
                  onChange={(e) =>
                    handlePatientChange("collectingDate", e.target.value)
                  }
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm cursor-pointer"
                />
              </div>

              {/* Receiving Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {t("cancerReportPage.receivingDate")}
                </label>
                <input
                  type="date"
                  value={patient.receivingDate}
                  onChange={(e) =>
                    handlePatientChange("receivingDate", e.target.value)
                  }
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm cursor-pointer"
                />
              </div>

              {/* Testing / Report Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {language === "th" ? "วันที่ทำการวิเคราะห์" : "Testing Date"}
                </label>
                <input
                  type="date"
                  value={patient.testingDate}
                  onChange={(e) =>
                    handlePatientChange("testingDate", e.target.value)
                  }
                  className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex border-b border-slate-200 mb-6 gap-2 no-print">
            <button
              onClick={() => setActiveTab("tumor")}
              className={`pb-3 px-4 font-bold text-sm tracking-wide border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "tumor"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <Activity className="w-4 h-4" />
              {t("cancerReportPage.tabTumor")}
            </button>
            <button
              onClick={() => setActiveTab("genetics")}
              className={`pb-3 px-4 font-bold text-sm tracking-wide border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "genetics"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              {t("cancerReportPage.tabGenetics")}
            </button>
          </div>

          {/* TAB 1: Tumor Markers & Scores */}
          <div
            className={
              activeTab === "tumor" ? "block" : "hidden print-force-visible"
            }
          >
            <div className="overflow-x-auto print-border rounded-xl border border-slate-100 shadow-sm shadow-slate-100/10 mb-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-5">
                      {t("cancerReportPage.tumorMarkers")}
                    </th>
                    <th className="py-3.5 px-5 text-center w-28">
                      {t("cancerReportPage.result")}
                    </th>
                    <th className="py-3.5 px-5 text-center w-24">
                      {t("cancerReportPage.unit")}
                    </th>
                    <th className="py-3.5 px-5 text-center w-40">
                      {t("cancerReportPage.referenceRange")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {/* PSA Row */}
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-5 font-semibold text-slate-900">
                      {t("cancerReportPage.psa")}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <input
                        type="text"
                        value={markers.psa}
                        onChange={(e) =>
                          handleMarkerChange("psa", e.target.value)
                        }
                        className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                      />
                    </td>
                    <td className="py-4 px-5 text-center text-blue-600 font-medium select-all">
                      ng/mL
                    </td>
                    <td className="py-4 px-5 text-center font-medium">
                      <span className="px-2.5 py-1 bg-slate-100/50 rounded-md border border-slate-200/50 text-slate-500">
                        0.0-4.0
                      </span>
                    </td>
                  </tr>

                  {/* CEA Row */}
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-5 font-semibold text-slate-900">
                      {t("cancerReportPage.cea")}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <input
                        type="text"
                        value={markers.cea}
                        onChange={(e) =>
                          handleMarkerChange("cea", e.target.value)
                        }
                        className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                      />
                    </td>
                    <td className="py-4 px-5 text-center text-blue-600 font-medium select-all">
                      ng/mL
                    </td>
                    <td className="py-4 px-5 text-center font-medium">
                      <span className="px-2.5 py-1 bg-slate-100/50 rounded-md border border-slate-200/50 text-slate-500">
                        0.0-5.0
                      </span>
                    </td>
                  </tr>

                  {/* CA 15-3 Row */}
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-5 font-semibold text-slate-900">
                      {t("cancerReportPage.ca153")}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <input
                        type="text"
                        value={markers.ca153}
                        onChange={(e) =>
                          handleMarkerChange("ca153", e.target.value)
                        }
                        className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                      />
                    </td>
                    <td className="py-4 px-5 text-center text-blue-600 font-medium select-all">
                      U/mL
                    </td>
                    <td className="py-4 px-5 text-center font-medium">
                      <span className="px-2.5 py-1 bg-slate-100/50 rounded-md border border-slate-200/50 text-slate-500">
                        0-37
                      </span>
                    </td>
                  </tr>

                  {/* AFP Row */}
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-5 font-semibold text-slate-900">
                      {t("cancerReportPage.afp")}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <input
                        type="text"
                        value={markers.afp}
                        onChange={(e) =>
                          handleMarkerChange("afp", e.target.value)
                        }
                        placeholder="-"
                        className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                      />
                    </td>
                    <td className="py-4 px-5 text-center text-blue-600 font-medium select-all">
                      ng/mL
                    </td>
                    <td className="py-4 px-5 text-center font-medium">
                      <span className="px-2.5 py-1 bg-slate-100/50 rounded-md border border-slate-200/50 text-slate-500">
                        Cut off 200
                      </span>
                    </td>
                  </tr>

                  {/* HPV DNA Row */}
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-5 font-semibold text-slate-900">
                      {t("cancerReportPage.hpv")}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <input
                        type="text"
                        value={markers.hpv}
                        onChange={(e) =>
                          setMarkers((prev) => ({
                            ...prev,
                            hpv: e.target.value,
                          }))
                        }
                        placeholder="-"
                        className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                      />
                    </td>
                    <td className="py-4 px-5 text-center text-blue-600 font-medium select-all">
                      Copies/mL
                    </td>
                    <td className="py-4 px-5 text-center font-medium text-xs text-slate-500 leading-snug">
                      HPV 16: 10³-10⁸ copies/ml
                      <br />
                      HPV 18: 10³-10⁸ copies/ml
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tab 1 Section 2: Clinical Scores */}
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              {t("cancerReportPage.score")}
            </h4>

            <div className="overflow-x-auto print-border rounded-xl border border-slate-100 shadow-sm shadow-slate-100/10 mb-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-5">
                      {t("cancerReportPage.score")} Name
                    </th>
                    <th className="py-3.5 px-5 text-center w-28">
                      {t("cancerReportPage.result")}
                    </th>
                    <th className="py-3.5 px-5 text-center w-24">Status</th>
                    <th className="py-3.5 px-5 text-center w-40">
                      {t("cancerReportPage.referenceRange")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {/* CT CS Row */}
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-5 font-semibold text-slate-900">
                      {t("cancerReportPage.ctcs")}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <input
                        type="text"
                        value={markers.ctcs}
                        onChange={(e) =>
                          handleMarkerChange("ctcs", e.target.value)
                        }
                        className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                      />
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatus("ctcs", markers.ctcs).bg} ${getStatus("ctcs", markers.ctcs).color}`}
                      >
                        {getStatus("ctcs", markers.ctcs).text}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center font-medium">
                      <span className="px-2.5 py-1 bg-slate-100/50 rounded-md border border-slate-200/50 text-slate-500 text-xs select-all">
                        &gt; 5 CTCs / 7.5 mL
                      </span>
                    </td>
                  </tr>

                  {/* PCA3 Row */}
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-5 font-semibold text-slate-900">
                      {t("cancerReportPage.pca3")}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <input
                        type="text"
                        value={markers.pca3}
                        onChange={(e) =>
                          handleMarkerChange("pca3", e.target.value)
                        }
                        className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                      />
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatus("pca3", markers.pca3).bg} ${getStatus("pca3", markers.pca3).color}`}
                      >
                        {getStatus("pca3", markers.pca3).text}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center font-medium">
                      <span className="px-2.5 py-1 bg-slate-100/50 rounded-md border border-slate-200/50 text-slate-500 text-xs">
                        Cut off : 35
                      </span>
                    </td>
                  </tr>

                  {/* DLX1 Row */}
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-5 font-semibold text-slate-900">
                      {t("cancerReportPage.dlx1")}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <input
                        type="text"
                        value={markers.dlx1}
                        onChange={(e) =>
                          setMarkers((prev) => ({
                            ...prev,
                            dlx1: e.target.value,
                          }))
                        }
                        placeholder="N/A"
                        className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                      />
                    </td>
                    <td className="py-4 px-5 text-center text-slate-400">-</td>
                    <td className="py-4 px-5 text-center font-medium">
                      <span className="px-2.5 py-1 bg-slate-100/50 rounded-md border border-slate-200/50 text-slate-500 text-xs">
                        Cut off : N/A
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* TAB 2: Genetic Mutations (Exons) */}
          <div
            className={
              activeTab === "genetics" ? "block" : "hidden print-force-visible"
            }
          >
            <div className="overflow-x-auto print-border rounded-xl border border-slate-100 shadow-sm shadow-slate-100/10 mb-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-5">Mutations / Exons</th>
                    <th className="py-3.5 px-5 text-center w-28">
                      {t("cancerReportPage.result")}
                    </th>
                    <th className="py-3.5 px-5 text-center w-28">
                      {t("cancerReportPage.unit")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {/* Exon 20 */}
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-5 font-semibold text-slate-900">
                      {t("cancerReportPage.exon20")}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <input
                        type="text"
                        value={genetics.exon20}
                        onChange={(e) =>
                          handleGeneticChange("exon20", e.target.value)
                        }
                        className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                      />
                    </td>
                    <td className="py-4 px-5 text-center text-blue-600 font-medium">
                      ng/mL
                    </td>
                  </tr>

                  {/* G719X */}
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-5 font-semibold text-slate-900">
                      {t("cancerReportPage.g719x")}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <input
                        type="text"
                        value={genetics.g719x}
                        onChange={(e) =>
                          setGenetics((prev) => ({
                            ...prev,
                            g719x: e.target.value,
                          }))
                        }
                        placeholder="-"
                        className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                      />
                    </td>
                    <td className="py-4 px-5 text-center text-blue-600 font-medium">
                      ng/mL
                    </td>
                  </tr>

                  {/* Exon 19 */}
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-5 font-semibold text-slate-900">
                      {t("cancerReportPage.exon19")}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <input
                        type="text"
                        value={genetics.exon19}
                        onChange={(e) =>
                          setGenetics((prev) => ({
                            ...prev,
                            exon19: e.target.value,
                          }))
                        }
                        placeholder="-"
                        className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                      />
                    </td>
                    <td className="py-4 px-5 text-center text-blue-600 font-medium">
                      ng/mL
                    </td>
                  </tr>

                  {/* L858R */}
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-5 font-semibold text-slate-900">
                      {t("cancerReportPage.l858r")}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <input
                        type="text"
                        value={genetics.l858r}
                        onChange={(e) =>
                          setGenetics((prev) => ({
                            ...prev,
                            l858r: e.target.value,
                          }))
                        }
                        placeholder="-"
                        className="w-16 bg-slate-50 hover:bg-slate-100 focus:bg-white text-center border-0 rounded py-1 font-bold text-slate-800 focus:ring-1 focus:ring-blue-300"
                      />
                    </td>
                    <td className="py-4 px-5 text-center text-blue-600 font-medium">
                      ng/mL
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Scientific Disclaimer / Calculation Formula Row */}
          <div className="bg-slate-50/50 border border-slate-100 border-dashed rounded-2xl p-4 flex items-start gap-3.5 mb-8">
            <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {t("cancerReportPage.formulaText")}
            </p>
          </div>

          {/* Interactive Navigation and Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100 pt-8 no-print">
            {/* Tab navigation helpers */}
            <div className="flex items-center gap-2.5">
              {activeTab === "genetics" ? (
                <button
                  onClick={() => setActiveTab("tumor")}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 border-0 cursor-pointer shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t("cancerReportPage.back")}
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab("genetics")}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 border-0 cursor-pointer shadow-md shadow-blue-500/20"
                >
                  {t("cancerReportPage.next")}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Document Print/Export actions */}
            <div className="flex items-center gap-3 flex-wrap justify-end">
              <button
                onClick={() => {
                  fetchSavedReports();
                  setShowSavedDrawer(true);
                }}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Database className="w-4 h-4 text-slate-400" />
                {t("cancerReportPage.dbConsole")}
              </button>
              <button
                onClick={handleSaveReport}
                disabled={isSaving}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4 text-white/80" />
                {isSaving
                  ? t("cancerReportPage.saving")
                  : t("cancerReportPage.saveToDb")}
              </button>
              <button
                onClick={handleExport}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4 text-slate-400" />
                {language === "th" ? "ส่งออก PDF" : "Export PDF"}
              </button>
              <button
                onClick={handleExportCSV}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4 text-slate-400" />
                {language === "th" ? "ส่งออก CSV" : "Export CSV"}
              </button>
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                {t("cancerReportPage.print")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.message && (
        <div className="fixed bottom-5 right-5 z-[100] max-w-sm w-full bg-white/90 backdrop-blur-md border border-slate-100 rounded-2xl shadow-xl p-4 flex items-center gap-3.5 animate-slide-in no-print">
          {toast.type === "success" ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
          )}
          <span className="text-sm font-bold text-slate-800 leading-snug">
            {toast.message}
          </span>
        </div>
      )}

      {/* Saved Reports Sidebar Drawer */}
      {showSavedDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end no-print">
          {/* Backdrop */}
          <div
            onClick={() => setShowSavedDrawer(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-left">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  {t("cancerReportPage.savedReportsList")}
                </h3>
              </div>
              <button
                onClick={() => setShowSavedDrawer(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600 cursor-pointer border-0"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Search Filters (Requirement 2.1.4) */}
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={language === "th" ? "ค้นหาด้วยชื่อผู้ป่วย..." : "Search by patient name..."}
                  value={searchQuery.name}
                  onChange={(e) => setSearchQuery(prev => ({ ...prev, name: e.target.value }))}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all shadow-sm"
                />
                <button
                  onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    showAdvancedSearch 
                      ? "bg-blue-50 border-blue-200 text-blue-600 font-extrabold" 
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  {language === "th" ? "ตัวกรอง" : "Filters"}
                </button>
              </div>

              {showAdvancedSearch && (
                <div className="grid grid-cols-2 gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-inner text-[11px] animate-fade-in">
                  {/* Sex */}
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wide">
                      {language === "th" ? "เพศ" : "Sex"}
                    </label>
                    <select
                      value={searchQuery.sex}
                      onChange={(e) => setSearchQuery(prev => ({ ...prev, sex: e.target.value }))}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:border-blue-500 text-slate-700 font-semibold"
                    >
                      <option value="">{language === "th" ? "ทั้งหมด" : "All"}</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="M">M</option>
                      <option value="F">F</option>
                    </select>
                  </div>

                  {/* Age */}
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wide">
                      {language === "th" ? "อายุ" : "Age"}
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 45"
                      value={searchQuery.age}
                      onChange={(e) => setSearchQuery(prev => ({ ...prev, age: e.target.value }))}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:border-blue-500 text-slate-700 font-semibold w-full"
                    />
                  </div>

                  {/* DOB */}
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wide">
                      {language === "th" ? "วันเกิด" : "DOB"}
                    </label>
                    <input
                      type="date"
                      value={searchQuery.dob}
                      onChange={(e) => setSearchQuery(prev => ({ ...prev, dob: e.target.value }))}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:border-blue-500 text-slate-700 font-semibold cursor-pointer"
                    />
                  </div>

                  {/* Specimen */}
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wide">
                      {language === "th" ? "สิ่งส่งตรวจ" : "Specimen"}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Serum"
                      value={searchQuery.specimen}
                      onChange={(e) => setSearchQuery(prev => ({ ...prev, specimen: e.target.value }))}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:border-blue-500 text-slate-700 font-semibold w-full"
                    />
                  </div>

                  {/* Collecting Date */}
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wide">
                      {language === "th" ? "วันที่เก็บตัวอย่าง" : "Collect Date"}
                    </label>
                    <input
                      type="date"
                      value={searchQuery.collectingDate}
                      onChange={(e) => setSearchQuery(prev => ({ ...prev, collectingDate: e.target.value }))}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:border-blue-500 text-slate-700 font-semibold cursor-pointer"
                    />
                  </div>

                  {/* Receiving Date */}
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wide">
                      {language === "th" ? "วันที่รับตัวอย่าง" : "Receive Date"}
                    </label>
                    <input
                      type="date"
                      value={searchQuery.receivingDate}
                      onChange={(e) => setSearchQuery(prev => ({ ...prev, receivingDate: e.target.value }))}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:border-blue-500 text-slate-700 font-semibold cursor-pointer"
                    />
                  </div>

                  {/* Clear Button */}
                  <div className="col-span-2 flex justify-end pt-2 border-t border-slate-100 mt-1">
                    <button
                      type="button"
                      onClick={() => setSearchQuery({
                        name: "",
                        sex: "",
                        age: "",
                        dob: "",
                        specimen: "",
                        collectingDate: "",
                        receivingDate: ""
                      })}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold transition-all border-0 cursor-pointer text-[10px] uppercase tracking-wider"
                    >
                      {language === "th" ? "ล้างค่าตัวกรอง" : "Clear Filters"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoadingSaved ? (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-semibold text-slate-400">
                    {t("cancerReportPage.loading")}
                  </p>
                </div>
              ) : savedReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                  <Database className="w-10 h-10 text-slate-300 mb-3" />
                  <p className="text-sm font-bold text-slate-800">
                    {t("cancerReportPage.noSavedReports")}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {language === "th"
                      ? 'กรอกข้อมูลแล้วคลิก "บันทึกลงฐานข้อมูล" เพื่อเริ่มสะสมประวัติ'
                      : 'Fill details and click "Save to DB" to start building records.'}
                  </p>
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                  <Database className="w-10 h-10 text-slate-300 mb-3 animate-bounce" style={{ animationDuration: '3s' }} />
                  <p className="text-sm font-bold text-slate-800">
                    {language === "th" ? "ไม่พบรายงานที่ตรงตามเงื่อนไข" : "No matching reports found"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {language === "th"
                      ? "ลองเปลี่ยนคีย์เวิร์ดหรือล้างฟิลเตอร์ตัวกรอง"
                      : "Try adjusting your search terms or clearing filters."}
                  </p>
                </div>
              ) : (
                filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="border border-slate-100 hover:border-blue-100 rounded-2xl p-4.5 bg-slate-50/30 hover:bg-blue-50/10 transition-all flex flex-col gap-3.5 group shadow-sm shadow-slate-100/50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {report.patient?.name || "Unnamed Patient"}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-semibold mt-1">
                          {report.patient?.sex
                            ? `${report.patient.sex} • `
                            : ""}
                          {report.patient?.age
                            ? `${report.patient.age} ${language === "th" ? "ปี" : "years"}`
                            : ""}
                        </p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md font-bold">
                        ID: {report.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {t("cancerReportPage.collectingDate")}:{" "}
                        {report.collecting_date || "-"}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-2.5 border-t border-slate-100/80">
                      <button
                        onClick={() => handleLoadReport(report)}
                        className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 text-xs font-extrabold rounded-lg transition-all border-0 cursor-pointer flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {t("cancerReportPage.load")}
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 text-xs font-extrabold rounded-lg transition-all border-0 cursor-pointer flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {t("cancerReportPage.delete")}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
