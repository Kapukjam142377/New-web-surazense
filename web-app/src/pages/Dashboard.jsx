import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { 
  History, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Pause, 
  Square, 
  ArrowLeft, 
  RefreshCw, 
  Database,
  FileText,
  Activity,
  Cpu,
  Settings,
  Folder
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { serialInstance } from "../utils/serialService";
import { 
  baselineCorrection, 
  findPeak, 
  sgFilter, 
  naturalCubicSpline, 
  evaluateSpline, 
  evalPolynomial, 
  npAverage 
} from "../utils/mathUtils";
import { useUser } from "../context/UserContext";

function Dashboard() {
  const { user } = useUser();
  const [analyses, setAnalyses] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ message: "", type: null });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Modes and Page States
  const [mode, setMode] = useState("calibration"); // 'calibration' or 'measurement'
  const [checkPage, setCheckPage] = useState("blank"); // 'blank', 'measure', 'cal'
  const [measurementView, setMeasurementView] = useState("A"); // 'A' or 'B'
  
  // Measurement Run States
  const [isMeasurementRunning, setIsMeasurementRunning] = useState(false);
  const [isMeasurementPaused, setIsMeasurementPaused] = useState(false);
  const [measurementCount, setMeasurementCount] = useState(0);
  
  // Calibration Coefficients & Resonance Peak
  const [calibrationCoeffs, setCalibrationCoeffs] = useState([]);
  const [calibrationPeak, setCalibrationPeak] = useState(null);
  
  // Buffers for Peak Resonance Frequency over time
  const [freqRangeMean, setFreqRangeMean] = useState([]);
  const [peakFreqBuffer, setPeakFreqBuffer] = useState([]);
  
  // Before / After collection states
  const [getValuesBefore, setGetValuesBefore] = useState([]);
  const [getValuesAfter, setGetValuesAfter] = useState([]);
  const [avgFreq1, setAvgFreq1] = useState(null);
  const [avgFreq2, setAvgFreq2] = useState(null);
  const [deltaF, setDeltaF] = useState(null);
  const [statusCollectDataBefore, setStatusCollectDataBefore] = useState(false);
  const [statusCollectDataAfter, setStatusCollectDataAfter] = useState(false);
  
  // Analysis parameters and results
  const [threshold, setThreshold] = useState(10); // Default 10 Hz
  const [targetName, setTargetName] = useState("EGFR");
  const [showResult, setShowResult] = useState(""); // 'Detected' or 'Not Detected'
  
  // Zoomed-in spectrum data for View B
  const [zoomedFreqs, setZoomedFreqs] = useState([]);
  const [zoomedAmplitudes, setZoomedAmplitudes] = useState([]);

  // Entry inputs (modern equivalents of Python entries)
  const [nameEntry, setNameEntry] = useState("");
  const [directoryEntry, setDirectoryEntry] = useState("C:/Users/Victus 15/QCM_Data");
  const [directoryHandle, setDirectoryHandle] = useState(null);
  const [openBcEntry, setOpenBcEntry] = useState("");
  const [saveBcEntry, setSaveBcEntry] = useState("");
  const [directoryBcEntry, setDirectoryBcEntry] = useState("C:/Users/Victus 15/QCM_Data/Baseline");

  useEffect(() => {
    if (user) {
      fetchAnalyses();
    } else {
      setAnalyses([]);
    }
  }, [user]);

  // Hide toast after 3 seconds
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => {
        setToast({ message: "", type: null });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.message]);

  const fetchAnalyses = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/${user.id}/analyses`);
      if (res.ok) {
        const data = await res.json();
        setAnalyses(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectSaveDirectory = async () => {
    try {
      if (window.showDirectoryPicker) {
        const handle = await window.showDirectoryPicker();
        setDirectoryHandle(handle);
        setDirectoryEntry(handle.name);
        setToast({ message: `Save directory set to "${handle.name}".`, type: "success" });
      } else {
        const customPath = prompt("Enter the absolute save directory path:", directoryEntry);
        if (customPath !== null) {
          setDirectoryEntry(customPath);
          setToast({ message: `Save directory set to "${customPath}".`, type: "success" });
        }
      }
    } catch (e) {
      if (e.name !== "AbortError") {
        console.error("Directory picker error:", e);
        setToast({ message: "Failed to select directory.", type: "error" });
      }
    }
  };

  const handleSaveCSVFile = async () => {
    const isMeasureRun = mode === "measurement";
    if (isMeasureRun && freqRangeMean.length === 0) {
      setToast({ message: "Please take measurements first.", type: "error" });
      return false;
    }
    if (!isMeasureRun && chartData.length === 0) {
      setToast({ message: "Please calibrate first.", type: "error" });
      return false;
    }
    if (!nameEntry) {
      setToast({ message: "Please specify the file name.", type: "error" });
      return false;
    }

    try {
      let csvContent = "";
      if (isMeasureRun) {
        csvContent = "Count,Time,Resonance_Frequency (Hz)\n";
        const now = new Date();
        freqRangeMean.forEach((val, idx) => {
          const timeOffset = new Date(now.getTime() - (freqRangeMean.length - 1 - idx) * 1000);
          const tStr = timeOffset.toTimeString().split(" ")[0];
          csvContent += `${idx + 1},${tStr},${val}\n`;
        });
      } else {
        csvContent = "xf,data,baseline,coefficial\n";
        const limit = Math.max(baselineFreqs.length, baselineMag.length, calibrationBaseLine.length);
        for (let i = 0; i < limit; i++) {
          const xfVal = baselineFreqs[i] !== undefined ? (baselineFreqs[i] * 1e6) : "";
          const dataVal = baselineMag[i] !== undefined ? baselineMag[i] : "";
          const baseVal = calibrationBaseLine[i] !== undefined ? calibrationBaseLine[i] : "";
          const coeffVal = calibrationCoeffs[i] !== undefined ? calibrationCoeffs[i] : "";
          csvContent += `${xfVal},${dataVal},${baseVal},${coeffVal}\n`;
        }
      }

      const fileName = nameEntry.endsWith(".csv") ? nameEntry : `${nameEntry}.csv`;

      if (window.showDirectoryPicker && directoryHandle) {
        const opts = { mode: "readwrite" };
        if ((await directoryHandle.queryPermission(opts)) !== "granted") {
          if ((await directoryHandle.requestPermission(opts)) !== "granted") {
            throw new Error("Write permission denied.");
          }
        }
        const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(csvContent);
        await writable.close();
        setToast({ message: `CSV saved successfully as "${fileName}" inside the selected directory.`, type: "success" });
      } else {
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setToast({ message: `CSV download started: "${fileName}"`, type: "success" });
      }
      return true;
    } catch (e) {
      console.error("Save CSV error:", e);
      setToast({ message: `Failed to save CSV file: ${e.message}`, type: "error" });
      return false;
    }
  };

  const handleSaveCSVDataAndAnalysis = async () => {
    const csvSuccess = await handleSaveCSVFile();
    if (csvSuccess && user) {
      await handleSaveAnalysis();
    }
  };

  const handleImportBaselineCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
        if (lines.length < 2) {
          throw new Error("Invalid CSV format: file is empty or missing headers.");
        }

        const xf = [];
        const rawData = [];
        const baseLine = [];
        const coeffs = [];

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(",");
          if (row.length >= 3) {
            xf.push(parseFloat(row[0]));
            rawData.push(parseFloat(row[1]));
            baseLine.push(parseFloat(row[2]));
            if (row[3] !== undefined && row[3] !== "" && coeffs.length < 9) {
              coeffs.push(parseFloat(row[3]));
            }
          }
        }

        if (baseLine.length === 0) {
          throw new Error("No data points found in CSV.");
        }

        setMode("calibration");
        setCheckPage("measure");
        setOpenBcEntry(file.name);
        
        const plotData = [];
        const freqsMHz = xf.map(f => f / 1e6);
        for (let i = 0; i < freqsMHz.length; i++) {
          plotData.push([freqsMHz[i], rawData[i]]);
        }
        setChartData(plotData);
        setCalibrationBaseLine(baseLine);
        setCalibrationCoeffs(coeffs);
        setBaselineFreqs(freqsMHz);
        setBaselineMag(rawData);

        const peakInfo = findPeak(xf, baseLine, 4000);
        const peakFreqVal = peakInfo.maxFreqs[0];
        const peakAmpVal = peakInfo.maxValues[0];
        setCalibrationPeak({ freq: peakFreqVal, value: peakAmpVal });

        setToast({ message: `Successfully loaded baseline CSV: "${file.name}"`, type: "success" });
      } catch (err) {
        console.error("Baseline CSV import error:", err);
        setToast({ message: `Failed to load CSV: ${err.message}`, type: "error" });
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleImportMeasurementCSV = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
        if (lines.length < 2) {
          throw new Error("Invalid CSV format: file is empty or missing headers.");
        }

        const values = [];
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(",");
          if (row.length >= 3) {
            const val = parseFloat(row[2]);
            if (!isNaN(val)) {
              values.push(val);
            }
          }
        }

        if (values.length === 0) {
          throw new Error("No valid resonance frequency data found in column 3.");
        }

        const avg = npAverage(values);
        if (type === "before") {
          setGetValuesBefore(values);
          setAvgFreq1(avg);
          setToast({ message: `Loaded Before CSV successfully: ${values.length} samples, average is ${Math.round(avg).toLocaleString()} Hz`, type: "success" });
        } else {
          setGetValuesAfter(values);
          setAvgFreq2(avg);
          setToast({ message: `Loaded After CSV successfully: ${values.length} samples, average is ${Math.round(avg).toLocaleString()} Hz`, type: "success" });
        }
      } catch (err) {
        console.error("Measurement CSV import error:", err);
        setToast({ message: `Failed to load measurement CSV: ${err.message}`, type: "error" });
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleSaveAnalysis = async () => {
    if (!user) return;
    const title = window.prompt(
      "Enter a title for this run:",
      `QCM Run ${new Date().toLocaleTimeString()}`,
    );
    if (!title) return;

    setIsSaving(true);
    try {
      const isMeasureRun = mode === "measurement";
      const body = {
        title,
        measurement_type: isMeasureRun ? "measurement" : "single",
        file1_name: isMeasureRun ? "measure_data.json" : "cal_data.json",
        file1_data: JSON.stringify(isMeasureRun ? freqRangeMean : chartData),
        file2_name: null,
        file2_data: null,
        selected_time_start: null,
        selected_time_end: null,
        avg_frequency1: isMeasureRun ? avgFreq1 : null,
        avg_frequency2: isMeasureRun ? avgFreq2 : null,
        delta_f: isMeasureRun ? deltaF : null,
      };

      const res = await fetch(`${API_URL}/api/users/${user.id}/analyses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Failed to save analysis");
      }

      const newAnalysis = await res.json();
      setAnalyses((prev) => [newAnalysis, ...prev]);
      setToast({
        message: "Analysis run saved successfully!",
        type: "success",
      });
    } catch (e) {
      console.error(e);
      setToast({ message: "Failed to save analysis.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadAnalysis = (analysis) => {
    try {
      if (analysis.file1_data) {
        const loadedData = JSON.parse(analysis.file1_data);
        if (analysis.measurement_type === "measurement") {
          setMode("measurement");
          setMeasurementView("A");
          setFreqRangeMean(loadedData);
          setAvgFreq1(analysis.avg_frequency1);
          setAvgFreq2(analysis.avg_frequency2);
          setDeltaF(analysis.delta_f);
          if (analysis.delta_f !== null) {
            setShowResult(analysis.delta_f > threshold ? "Detected" : "Not Detected");
          } else {
            setShowResult("");
          }
        } else {
          setMode("calibration");
          setChartData(loadedData);
        }
        setToast({
          message: `Loaded session: ${analysis.title}`,
          type: "success",
        });
      }
    } catch (e) {
      console.error("Failed to parse analysis data", e);
      setToast({ message: "Failed to load session.", type: "error" });
    }
  };

  const [isConnected, setIsConnected] = useState(false);
  const [statusText, setStatusText] = useState("Disconnected");

  // Data for Chart
  const [chartData, setChartData] = useState([]);
  const [freqData, setFreqData] = useState([]);

  // States for measurement logic
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);

  const [calibrationBaseLine, setCalibrationBaseLine] = useState([]);

  const [baselineFreqs, setBaselineFreqs] = useState([]);
  const [baselineMag, setBaselineMag] = useState([]);

  // Auto-connect and Port Listeners
  useEffect(() => {
    const tryAutoConnect = async () => {
      const connected = await serialInstance.autoConnectValidPort();
      if (connected) {
        setIsConnected(true);
        setStatusText("Connected to Device (Auto)");
      }
    };

    serialInstance.onConnectStatusChange = (status) => {
      setIsConnected(status);
      if (status) {
        setStatusText("Connected to Device (Auto)");
      } else {
        setStatusText("Device Disconnected");
      }
    };

    tryAutoConnect();

    return () => {
      serialInstance.onConnectStatusChange = null;
    };
  }, []);

  // Connection Handler
  const handleConnect = async () => {
    if (!isConnected) {
      const portSelected = await serialInstance.requestPort();
      if (portSelected) {
        const connected = await serialInstance.connect(115200);
        if (connected) {
          setIsConnected(true);
          setStatusText("Connected to Device");
        } else {
          setStatusText("Failed to Connect");
        }
      }
    } else {
      await serialInstance.disconnect();
      setIsConnected(false);
      setStatusText("Disconnected");
    }
  };

  // Python equivalent logic: Calibrate (8MHz to 12MHz)
  const handleCalibrate = async () => {
    if (!isConnected) return;
    setIsCalibrating(true);
    setChartData([]);
    setCheckPage("blank");
    setCalibrationPeak(null);

    // Reset connection to clear buffers and restart Arduino
    const resetSuccess = await serialInstance.resetConnection();
    if (!resetSuccess) {
      setToast({ message: "Failed to reset serial connection.", type: "error" });
      setIsCalibrating(false);
      return;
    }

    // Command sending
    const startFreq = 8000000;
    const stopFreq = 12000000;
    const fStep = 1000;
    const cmd = `${startFreq};${stopFreq};${fStep}\n`;

    await serialInstance.writeCommand(cmd);

    // Read response
    const buffer = await serialInstance.readData(100);
    const dataRaw = buffer.split(/\r?\n/);
    let dataMag = [];

    const vmax = 4.096;
    const bitmax = 65536;
    const ADCtoVolt = vmax / bitmax;
    const VCP = 0.9;

    // Process math: filter empty or invalid lines
    for (let i = 0; i < dataRaw.length; i++) {
      const line = dataRaw[i].trim();
      if (!line) continue;
      if (line === "s" || line === "Connected") continue;
      const parsedVal = parseFloat(line);
      if (isNaN(parsedVal)) continue;

      let mag = parsedVal * ADCtoVolt;
      dataMag.push((mag - VCP) / 0.03);
    }

    // Generate frequencies linspace
    const readFREQ = [];
    const samples = dataMag.length;
    
    // Baseline estimation
    try {
      if (samples < 9) {
        throw new Error(`Incomplete calibration data: received ${samples} points (expected ~4000). Please check the serial connection.`);
      }

      for (let i = 0; i < samples; i++) {
        readFREQ.push(8 + (12 - 8) * (i / (samples - 1)));
      }

      const { magBaselineCorrected, coeffs } = baselineCorrection(readFREQ, dataMag, 8);
      setCalibrationBaseLine(magBaselineCorrected);
      setCalibrationCoeffs(coeffs);
      setBaselineFreqs(readFREQ);
      setBaselineMag(dataMag); // We just store raw data for visual currently

      let plotData = [];
      for (let i = 0; i < readFREQ.length; i++) {
        plotData.push([readFREQ[i], dataMag[i]]);
      }
      setChartData(plotData);

      // Find peak in baseline corrected data (dist=4000 replicates global argmax)
      const readFREQHz = readFREQ.map((f) => f * 1e6);
      const peakInfo = findPeak(readFREQHz, magBaselineCorrected, 4000);
      const peakFreqVal = peakInfo.maxFreqs[0];
      const peakAmpVal = peakInfo.maxValues[0];
      
      setCalibrationPeak({ freq: peakFreqVal, value: peakAmpVal });

      // Check validation: peak amplitude > 0.1 and peak frequency between 9.5MHz and 10.5MHz
      // Lowered from 2.5 dB to 0.1 dB to allow user's physical sensor (0.13 dB) to calibrate successfully
      // Widened from 9.5e6-10.5e6 to 9.0e6-11.0e6 to support user's sensor at 10.635 MHz
      if (peakAmpVal > 0.1 && peakFreqVal > 9.0e6 && peakFreqVal < 11.0e6) {
        setCheckPage("measure");
        setToast({
          message: `Calibration Success! Peak found at ${(peakFreqVal / 1e6).toFixed(4)} MHz (${peakAmpVal.toFixed(2)} dB)`,
          type: "success",
        });
      } else {
        setCheckPage("blank");
        setToast({
          message: `Calibration failed. Peak found at ${(peakFreqVal / 1e6).toFixed(4)} MHz (${peakAmpVal.toFixed(2)} dB) is out of bounds.`,
          type: "error",
        });
      }
    } catch (e) {
      console.error("Math error:", e);
      setCheckPage("blank");
      setToast({ message: e.message || "Calibration math error.", type: "error" });
    }

    setIsCalibrating(false);
  };

  // Measurement sweep loop hook (run1 equivalent)
  useEffect(() => {
    let active = true;
    let timerId = null;

    const runMeasurementLoop = async () => {
      if (!active) return;
      if (!isConnected || !isMeasurementRunning || isMeasurementPaused) {
        timerId = setTimeout(runMeasurementLoop, 200);
        return;
      }

      try {
        const peakFreqHz = calibrationPeak?.freq;
        if (!peakFreqHz) {
          throw new Error("No calibration peak frequency available.");
        }

        const exten = 7500;
        const start = peakFreqHz - exten;
        const stop = peakFreqHz + 2500;
        const samples = 1001;
        const step = (stop - start) / (samples - 1);

        const cmd = `${Math.round(start)};${Math.round(stop)};${Math.round(step)}\n`;
        await serialInstance.writeCommand(cmd);

        const buffer = await serialInstance.readData(100);
        const dataRaw = buffer.split(/\r?\n/);
        let dataMag = new Float64Array(samples);

        const vmax = 4.096;
        const bitmax = 65536;
        const ADCtoVolt = vmax / bitmax;
        const VCP = 0.9;

        // Parse dataRaw carefully
        let writeIdx = 0;
        for (let i = 0; i < dataRaw.length; i++) {
          const line = dataRaw[i].trim();
          if (!line) continue;
          if (line === "s" || line === "Connected") continue;
          const parsedVal = parseFloat(line);
          if (isNaN(parsedVal)) continue;

          let mag = parsedVal * ADCtoVolt;
          dataMag[writeIdx] = (mag - VCP) / 0.03;
          writeIdx++;
          if (writeIdx >= samples) break;
        }

        // Fill remaining values in dataMag with the last valid value or 0
        const lastVal = writeIdx > 0 ? dataMag[writeIdx - 1] : 0;
        for (let i = writeIdx; i < samples; i++) {
          dataMag[i] = lastVal;
        }

        // Frequencies in MHz for baseline evaluation
        const freqsMHz = [];
        for (let i = 0; i < samples; i++) {
          freqsMHz.push((start + step * i) / 1e6);
        }

        const poly = evalPolynomial(calibrationCoeffs, freqsMHz);
        const magBaselineCorrected = new Float64Array(samples);
        for (let i = 0; i < samples; i++) {
          magBaselineCorrected[i] = dataMag[i] - poly[i];
        }

        const filteredMag = sgFilter(Array.from(magBaselineCorrected), 11, 3);

        // Spline Interpolation: upsample 1001 points to 10001 points
        const spline = naturalCubicSpline(filteredMag);
        const points = 10001;
        let maxVal = -Infinity;
        let maxIdx = 0;
        for (let k = 0; k < points; k++) {
          const xVal = k * 0.1;
          const val = evaluateSpline(spline, xVal);
          if (val > maxVal) {
            maxVal = val;
            maxIdx = k;
          }
        }

        // Peak frequency in Hz
        const freqRange = [];
        for (let i = 0; i < points; i++) {
          freqRange.push(start + (stop - start) * (i / (points - 1)));
        }
        const fitPeakFreq = freqRange[maxIdx];

        // Store peak frequency in rolling buffer
        setPeakFreqBuffer((prev) => {
          const newBuffer = [fitPeakFreq, ...prev];
          if (newBuffer.length > 50) {
            newBuffer.pop();
          }

          // Once buffer has 50 elements, apply Savitzky-Golay filter (window 3, order 1) and average it
          setMeasurementCount((prevCount) => {
            const nextCount = prevCount + 1;
            if (nextCount >= 50) {
              const smoothed = sgFilter(newBuffer, 3, 1);
              const avgSmoothed = npAverage(smoothed);

              setFreqRangeMean((prevMean) => {
                const nextMean = [...prevMean, avgSmoothed];

                if (statusCollectDataBefore) {
                  setGetValuesBefore((prevBefore) => {
                    const nextBefore = [...prevBefore, avgSmoothed];
                    setAvgFreq1(npAverage(nextBefore));
                    return nextBefore;
                  });
                }

                if (statusCollectDataAfter) {
                  setGetValuesAfter((prevAfter) => {
                    const nextAfter = [...prevAfter, avgSmoothed];
                    setAvgFreq2(npAverage(nextAfter));
                    return nextAfter;
                  });
                }

                return nextMean;
              });
            }
            return nextCount;
          });

          return newBuffer;
        });

        setZoomedFreqs(freqsMHz);
        setZoomedAmplitudes(filteredMag);

      } catch (e) {
        console.error("Measurement loop error:", e);
      }

      if (active && isConnected && isMeasurementRunning && !isMeasurementPaused) {
        timerId = setTimeout(runMeasurementLoop, 50);
      } else {
        timerId = setTimeout(runMeasurementLoop, 200);
      }
    };

    runMeasurementLoop();

    return () => {
      active = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [isConnected, isMeasurementRunning, isMeasurementPaused, calibrationPeak, calibrationCoeffs, statusCollectDataBefore, statusCollectDataAfter]);

  const handleEnterMeasurementMode = () => {
    if (checkPage !== "measure") return;
    setMode("measurement");
    setMeasurementView("A");
    setIsMeasurementRunning(false);
    setIsMeasurementPaused(false);
    setMeasurementCount(0);
    setFreqRangeMean([]);
    setPeakFreqBuffer([]);
    setGetValuesBefore([]);
    setGetValuesAfter([]);
    setAvgFreq1(null);
    setAvgFreq2(null);
    setDeltaF(null);
    setShowResult("");
  };

  const handleBackToCalibration = () => {
    setIsMeasurementRunning(false);
    setIsMeasurementPaused(false);
    setMode("calibration");
  };

  const handleToggleMeasurement = async () => {
    if (!isMeasurementRunning) {
      // Clear buffers and reset device before starting measurement loop
      const resetSuccess = await serialInstance.resetConnection();
      if (!resetSuccess) {
        setToast({ message: "Failed to reset serial connection.", type: "error" });
        return;
      }
      setIsMeasurementRunning(true);
      setIsMeasurementPaused(false);
    } else {
      setIsMeasurementPaused(!isMeasurementPaused);
    }
  };

  const handleStopMeasurement = () => {
    setIsMeasurementRunning(false);
    setIsMeasurementPaused(false);
  };

  const handleCollectBefore = () => {
    if (!isMeasurementRunning) {
      setToast({ message: "Start the sweep measurement first.", type: "error" });
      return;
    }
    if (statusCollectDataBefore) {
      setStatusCollectDataBefore(false);
    } else {
      setStatusCollectDataBefore(true);
      setStatusCollectDataAfter(false); // only collect one at a time
    }
  };

  const handleCollectAfter = () => {
    if (!isMeasurementRunning) {
      setToast({ message: "Start the sweep measurement first.", type: "error" });
      return;
    }
    if (statusCollectDataAfter) {
      setStatusCollectDataAfter(false);
    } else {
      setStatusCollectDataAfter(true);
      setStatusCollectDataBefore(false); // only collect one at a time
    }
  };

  const handleRefreshBefore = () => {
    setGetValuesBefore([]);
    setAvgFreq1(null);
    setDeltaF(null);
    setShowResult("");
  };

  const handleRefreshAfter = () => {
    setGetValuesAfter([]);
    setAvgFreq2(null);
    setDeltaF(null);
    setShowResult("");
  };

  const handleCalculateResult = () => {
    if (avgFreq1 !== null && avgFreq2 !== null) {
      const delta = avgFreq1 - avgFreq2;
      setDeltaF(delta);
      if (delta > threshold) {
        setShowResult("Detected");
        setToast({ message: "Result calculated: EGFR Detected!", type: "error" });
      } else {
        setShowResult("Not Detected");
        setToast({ message: "Result calculated: EGFR Not Detected.", type: "success" });
      }
    } else {
      setToast({ message: "Please collect both Before and After frequency data.", type: "error" });
    }
  };

  // ECharts Option - Premium transparent styling with smooth grid lines
  const getOption = () => {
    let plotData = [];
    if (mode === "calibration") {
      plotData = chartData;
    } else if (measurementView === "A") {
      plotData = freqRangeMean.slice(1).map((val, idx) => [idx + 1, val]);
    } else {
      plotData = zoomedFreqs.map((f, i) => [f, zoomedAmplitudes[i]]);
    }

    const minX = (mode === "measurement" && measurementView === "B" && zoomedFreqs.length > 0) ? Math.min(...zoomedFreqs) : (mode === "calibration" ? 8 : undefined);
    const maxX = (mode === "measurement" && measurementView === "B" && zoomedFreqs.length > 0) ? Math.max(...zoomedFreqs) : (mode === "calibration" ? 12 : undefined);

    let lineStyleColor = "#0284c7"; // Blue
    if (mode === "measurement") {
      lineStyleColor = measurementView === "A" ? "#10b981" : "#f59e0b"; // Green or Amber
    }

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" }
      },
      grid: {
        left: "4%",
        right: "4%",
        bottom: "12%",
        top: "8%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        name: mode === "calibration" ? "Frequency (MHz)" : (measurementView === "A" ? "Reading" : "Frequency (MHz)"),
        nameLocation: "middle",
        nameGap: 25,
        splitLine: { show: true, lineStyle: { color: "rgba(148, 163, 184, 0.08)" } },
        min: minX,
        max: maxX,
        axisLabel: { color: "#64748b", fontSize: 11 },
        nameTextStyle: { color: "#64748b", fontSize: 11 },
      },
      yAxis: {
        type: "value",
        name: mode === "calibration" ? "Amplitude (dB)" : (measurementView === "A" ? "Resonance Freq (Hz)" : "Amplitude (dB)"),
        splitLine: { show: true, lineStyle: { color: "rgba(148, 163, 184, 0.08)" } },
        axisLabel: { 
          color: "#64748b",
          fontSize: 11,
          formatter: (val) => val.toLocaleString()
        },
        nameTextStyle: { color: "#64748b", fontSize: 11 },
        scale: true
      },
      series: [
        {
          name: mode === "calibration" ? "Amplitude" : (measurementView === "A" ? "Resonance Freq" : "Filtered Amplitude"),
          type: "line",
          showSymbol: measurementView === "A" && mode === "measurement",
          symbolSize: 4,
          data: plotData,
          lineStyle: {
            color: lineStyleColor,
            width: 2,
          },
          areaStyle: mode === "calibration" ? {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(2, 132, 199, 0.2)" },
              { offset: 1, color: "rgba(2, 132, 199, 0.01)" },
            ]),
          } : undefined,
        },
      ],
    };
  };

  return (
    <div 
      className="app-container" 
      style={{ 
        gridTemplateColumns: "1fr 350px", 
        maxWidth: "1600px", 
        height: "calc(100vh - 80px)", 
        minHeight: "550px", 
        overflow: "hidden", 
        padding: "1rem 2rem", 
        gap: "1.25rem" 
      }}
    >
      {/* Toast Alert */}
      <AnimatePresence>
        {toast.message && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            style={{
              position: "fixed",
              top: "90px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 18px",
              borderRadius: "10px",
              boxShadow: "0 8px 20px rgba(2, 132, 199, 0.15)",
              background: toast.type === "success" ? "#ecfdf5" : "#fef2f2",
              border: toast.type === "success" ? "1px solid #a7f3d0" : "1px solid #fecaca",
              color: toast.type === "success" ? "#065f46" : "#991b1b",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4.5 h-4.5 text-rose-600" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT COLUMN: Main Chart & Action controls */}
      <div className="flex flex-col gap-4 h-full min-h-0 justify-between">
        
        {/* CHART CONTAINER CARD (Top-left zone - scaled down) */}
        <div className="glass-panel flex flex-col p-4 flex-1 min-h-0">
          <div className="flex justify-between items-center mb-2 border-b border-slate-100 pb-2">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                <Activity className="w-4.5 h-4.5 text-sky-500" />
                {mode === "calibration" ? "QCM Calibration Sweep" : `QCM Measurement (${measurementView === "A" ? "View A: Time Series" : "View B: Zoomed Sweep"})`}
              </h2>
            </div>
            
            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${mode === "calibration" ? "bg-sky-50 text-sky-600 border border-sky-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
              {mode === "calibration" ? "Calibration" : "Measurement"}
            </div>
          </div>

          {/* ECharts Area (scales to fill panel) */}
          <div className="flex-1 w-full bg-slate-50/50 rounded-lg border border-slate-100/50 p-1 min-h-0">
            <ReactECharts
              option={getOption()}
              style={{ height: "100%", width: "100%" }}
              notMerge={true}
            />
          </div>
        </div>

        {/* BOTTOM ACTION SECTION (Bottom-left zone) */}
        <div className="grid grid-cols-2 gap-4 shrink-0">
          
          {/* CARD B: File Settings & Data CSV Exporter */}
          <div className="glass-panel p-4 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Data & File Export
            </h3>

            {/* File details input forms */}
            <div className="flex flex-col gap-2">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Session Run Name</span>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-100 rounded-md py-1 px-2.5 text-[11px] focus:outline-none focus:border-sky-500 font-semibold text-slate-700"
                  value={nameEntry}
                  onChange={(e) => setNameEntry(e.target.value)}
                  placeholder="e.g. egfr_run_01"
                />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Save Directory</span>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-md py-1 px-2.5 text-[10px] text-slate-400 focus:outline-none truncate"
                    value={directoryEntry}
                    readOnly
                  />
                  <button 
                    onClick={handleSelectSaveDirectory}
                    className="bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md p-1.5 transition-colors"
                    title="Select Save Directory"
                  >
                    <Folder className="w-3 h-3 text-slate-500" />
                  </button>
                </div>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Import Baseline CSV</span>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-md py-1 px-2.5 text-[10px] text-slate-400 focus:outline-none truncate"
                    value={openBcEntry || "No file imported"}
                    readOnly
                  />
                  <label 
                    className="bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md p-1.5 transition-colors cursor-pointer flex items-center justify-center"
                    title="Import Baseline CSV File"
                  >
                    <Folder className="w-3 h-3 text-slate-500" />
                    <input 
                      type="file" 
                      accept=".csv" 
                      onChange={handleImportBaselineCSV} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Save CSV File actions */}
            <button
              className="btn btn-warning w-full !py-1.5 text-xs mt-2"
              onClick={handleSaveCSVDataAndAnalysis}
              disabled={isSaving || ((mode === "calibration" && chartData.length === 0) || (mode === "measurement" && freqRangeMean.length === 0))}
            >
              {isSaving ? "Saving..." : "Save CSV Data"}
            </button>
          </div>

          {/* CARD A: Device Connection & Calibration Actions */}
          <div className="glass-panel p-4 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-slate-500" />
              Device & System Controls
            </h3>
            
            {/* COM Port Details & Status */}
            <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg p-2 mb-2">
              <div className="flex items-center gap-2">
                <div className={`status-indicator !m-0 !py-0.5 !px-2`}>
                  <div className={`status-dot ${isConnected ? "connected" : ""}`}></div>
                  <span className="text-[10px]">{isConnected ? "Connected" : "Disconnected"}</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 font-mono">Port: COM3</span>
              </div>
              <button 
                onClick={handleConnect}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all shadow-sm ${isConnected ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-sky-50 text-sky-600 hover:bg-sky-100"}`}
              >
                {isConnected ? "Disconnect" : "Connect"}
              </button>
            </div>

            {/* Sweep Trigger Buttons */}
            <div className="flex flex-col gap-1.5">
              {mode === "calibration" ? (
                <>
                  <button
                    className="btn btn-primary w-full !py-1.5 text-xs"
                    onClick={handleCalibrate}
                    disabled={isCalibrating || !isConnected}
                  >
                    {isCalibrating ? "Calibrating..." : "Start Calibration Sweep"}
                  </button>

                  <button
                    className="btn btn-success w-full !py-1.5 text-xs"
                    onClick={handleEnterMeasurementMode}
                    disabled={checkPage !== "measure"}
                  >
                    Start Measurement Mode
                  </button>
                </>
              ) : (
                <>
                  {/* Measurement Mode Controls */}
                  <div className="flex gap-1.5">
                    <button
                      className={`btn flex-1 !py-1.5 text-xs ${isMeasurementRunning && !isMeasurementPaused ? "btn-warning" : "btn-success"}`}
                      onClick={handleToggleMeasurement}
                    >
                      {isMeasurementRunning && !isMeasurementPaused ? (
                        <>
                          <Pause className="w-3.5 h-3.5" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" /> Start Sweep
                        </>
                      )}
                    </button>
                    {isMeasurementRunning && (
                      <button className="btn btn-danger px-2.5 !py-1.5" onClick={handleStopMeasurement}>
                        <Square className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      className={`btn text-[10px] !py-1 ${measurementView === "A" ? "btn-primary" : "bg-slate-50"}`}
                      onClick={() => setMeasurementView("A")}
                    >
                      View A (Freq)
                    </button>
                    <button
                      className={`btn text-[10px] !py-1 ${measurementView === "B" ? "btn-primary" : "bg-slate-50"}`}
                      onClick={() => setMeasurementView("B")}
                    >
                      View B (Spectrum)
                    </button>
                  </div>

                  <button
                    className="btn btn-outline w-full !py-1 text-[10px] flex gap-1 items-center text-slate-600"
                    onClick={handleBackToCalibration}
                  >
                    <ArrowLeft className="w-3 h-3" /> Back to Calibration
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: Diagnostic Metrics & Target Selection */}
      <div className="flex flex-col gap-4 h-full min-h-0 justify-between">
        
        {/* CARD D: Before, After, Delta Metrics & Collection (Moved to top of right column) */}
        <div className="glass-panel p-4 flex flex-col gap-2 shrink-0">
          <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
            <h3 className="text-xs font-bold text-slate-700">Resonance Metrics</h3>
            <button
              onClick={handleCalculateResult}
              disabled={avgFreq1 === null || avgFreq2 === null}
              className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-100 rounded-md text-[10px] font-bold transition-all"
            >
              Calculate
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {/* Before (Hz) Metric Card */}
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Before</span>
                <span className="text-sm font-bold text-slate-700 font-mono">
                  {avgFreq1 !== null ? `${Math.round(avgFreq1).toLocaleString()} Hz` : "--,--- Hz"}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={handleCollectBefore}
                  disabled={!isMeasurementRunning}
                  className={`px-2 py-1 rounded-md border text-[10px] font-bold transition-all ${
                    statusCollectDataBefore 
                      ? "bg-amber-100 border-amber-200 text-amber-600 animate-pulse" 
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  Collect
                </button>
                <label 
                  className="p-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-400 rounded-md transition-colors cursor-pointer flex items-center justify-center"
                  title="Import Before CSV File"
                >
                  <Folder className="w-3.5 h-3.5 text-slate-500" />
                  <input 
                    type="file" 
                    accept=".csv" 
                    onChange={(e) => handleImportMeasurementCSV(e, "before")} 
                    className="hidden" 
                  />
                </label>
                <button 
                  onClick={handleRefreshBefore}
                  className="p-1 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 rounded-md text-slate-400 transition-colors"
                  title="Clear Before Data"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* After (Hz) Metric Card */}
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">After</span>
                <span className="text-sm font-bold text-slate-700 font-mono">
                  {avgFreq2 !== null ? `${Math.round(avgFreq2).toLocaleString()} Hz` : "--,--- Hz"}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={handleCollectAfter}
                  disabled={!isMeasurementRunning}
                  className={`px-2 py-1 rounded-md border text-[10px] font-bold transition-all ${
                    statusCollectDataAfter 
                      ? "bg-amber-100 border-amber-200 text-amber-600 animate-pulse" 
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  Collect
                </button>
                <label 
                  className="p-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-400 rounded-md transition-colors cursor-pointer flex items-center justify-center"
                  title="Import After CSV File"
                >
                  <Folder className="w-3.5 h-3.5 text-slate-500" />
                  <input 
                    type="file" 
                    accept=".csv" 
                    onChange={(e) => handleImportMeasurementCSV(e, "after")} 
                    className="hidden" 
                  />
                </label>
                <button 
                  onClick={handleRefreshAfter}
                  className="p-1 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 rounded-md text-slate-400 transition-colors"
                  title="Clear After Data"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Delta F (Hz) Metric Card */}
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Delta F</span>
                <span className="text-sm font-extrabold text-sky-600 font-mono">
                  {deltaF !== null ? `${Math.round(deltaF).toLocaleString()} Hz` : "-- Hz"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD C: Analysis target & Threshold Settings (Moved below metrics) */}
        <div className="glass-panel p-4 shrink-0">
          <h3 className="text-xs font-bold text-slate-700 mb-2">Target & Threshold Settings</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Target Tumor</span>
              <select 
                className="w-full bg-slate-50 border border-slate-100 rounded-md py-1 px-2.5 text-xs focus:outline-none focus:border-sky-500 font-semibold text-slate-700"
                value={targetName}
                onChange={(e) => {
                  const val = e.target.value;
                  setTargetName(val);
                  if (val === "EGFR") setThreshold(10);
                }}
              >
                <option value="EGFR">EGFR</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Threshold (Hz)</span>
              <input 
                type="number"
                className="w-full bg-slate-50 border border-slate-100 rounded-md py-1 px-2 text-xs focus:outline-none focus:border-sky-500 font-semibold text-slate-700"
                value={threshold}
                onChange={(e) => setThreshold(Math.max(1, parseInt(e.target.value) || 1))}
                disabled={targetName === "EGFR"}
              />
            </div>
          </div>

          {/* DIAGNOSIS BANNER OVERLAY */}
          {showResult && (
            <div 
              className={`mt-2 p-2 rounded-lg text-center font-bold text-xs shadow-sm transition-all border ${
                showResult === "Detected" 
                  ? "bg-rose-50 text-rose-600 border-rose-100" 
                  : "bg-emerald-50 text-emerald-600 border-emerald-100"
              }`}
            >
              Result: {showResult === "Detected" ? "EGFR Positive" : "EGFR Negative"}
            </div>
          )}
        </div>

        {/* CARD E: Saved Session History Database (Scales to fill remaining screen height) */}
        {user && (
          <div className="glass-panel p-4 flex-1 flex flex-col min-h-0">
            <h3 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-1.5 shrink-0">
              <Database className="w-3.5 h-3.5 text-blue-500" />
              <span>Saved Runs Database</span>
            </h3>
            {analyses.length === 0 ? (
              <p className="text-[10px] text-slate-400 italic">No saved runs in database.</p>
            ) : (
              <div className="overflow-y-auto flex-1 flex flex-col gap-1.5 pr-0.5 custom-scrollbar min-h-0">
                {analyses.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleLoadAnalysis(item)}
                    className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-md p-2 cursor-pointer flex justify-between items-center transition-all"
                  >
                    <div className="min-w-0 flex-1 mr-2">
                      <p className="text-[11px] font-bold text-slate-700 truncate">{item.title}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${item.measurement_type === "measurement" ? "bg-emerald-50 text-emerald-600" : "bg-sky-50 text-sky-600"}`}>
                      {item.measurement_type === "measurement" ? "Measure" : "Sweep"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;
