import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { History, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { serialInstance } from "../utils/serialService";
import { baselineCorrection, findPeak, sgFilter } from "../utils/mathUtils";
import { useUser } from "../context/UserContext";

function Dashboard() {
  const { user } = useUser();
  const [analyses, setAnalyses] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ message: "", type: null });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

  const handleSaveAnalysis = async () => {
    if (!user) return;
    const title = window.prompt(
      "Enter a title for this run:",
      `QCM Run ${new Date().toLocaleTimeString()}`,
    );
    if (!title) return;

    setIsSaving(true);
    try {
      const body = {
        title,
        measurement_type: "single",
        file1_name: "cal_data.json",
        file1_data: JSON.stringify(chartData),
        file2_name: null,
        file2_data: null,
        selected_time_start: null,
        selected_time_end: null,
        avg_frequency1: null,
        avg_frequency2: null,
        delta_f: null,
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
        setChartData(loadedData);
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
      // Only set status manually, but event listener will also trigger
      setIsConnected(false);
      setStatusText("Disconnected");
    }
  };

  // Python equivalent logic: Calibrate (8MHz to 12MHz)
  const handleCalibrate = async () => {
    if (!isConnected) return;
    setIsCalibrating(true);
    setChartData([]);

    // Command sending
    const startFreq = 8000000;
    const stopFreq = 12000000;
    const fStep = 1000;
    const cmd = `${startFreq};${stopFreq};${fStep}\n`;

    await serialInstance.writeCommand(cmd);

    // Read response
    const buffer = await serialInstance.readData();
    const dataRaw = buffer.split("\r\n");
    let dataMag = [];

    const vmax = 4.096;
    const bitmax = 65536;
    const ADCtoVolt = vmax / bitmax;
    const VCP = 0.9;

    // Process math
    for (let i = 0; i < dataRaw.length - 2; i++) {
      let mag = parseFloat(dataRaw[i]) * ADCtoVolt;
      dataMag.push((mag - VCP) / 0.03);
    }

    // Generate frequencies linspace
    const readFREQ = [];
    const samples = dataMag.length;
    for (let i = 0; i < samples; i++) {
      readFREQ.push(8 + (12 - 8) * (i / (samples - 1)));
    }

    // Baseline estimation
    try {
      const { magBaselineCorrected } = baselineCorrection(readFREQ, dataMag, 8);
      setCalibrationBaseLine(magBaselineCorrected);
      setBaselineFreqs(readFREQ);
      setBaselineMag(dataMag); // We just store raw data for visual currently

      let plotData = [];
      for (let i = 0; i < readFREQ.length; i++) {
        plotData.push([readFREQ[i], dataMag[i]]);
      }
      setChartData(plotData);
    } catch (e) {
      console.error("Math error:", e);
    }

    setIsCalibrating(false);
  };

  // ECharts Option
  const getOption = () => {
    return {
      tooltip: {
        trigger: "axis",
      },
      grid: {
        left: "5%",
        right: "5%",
        bottom: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        name: "Frequency (MHz)",
        nameLocation: "middle",
        nameGap: 30,
        splitLine: { show: false },
        min: 8,
        max: 12,
        axisLabel: { color: "#64748b" },
        nameTextStyle: { color: "#64748b" },
      },
      yAxis: {
        type: "value",
        name: "Amplitude (dB)",
        splitLine: { lineStyle: { color: "rgba(0,0,0,0.05)" } },
        axisLabel: { color: "#64748b" },
        nameTextStyle: { color: "#64748b" },
      },
      series: [
        {
          name: "Amplitude",
          type: "line",
          showSymbol: false,
          data: chartData,
          lineStyle: {
            color: "#0284c7",
            width: 2,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(2, 132, 199, 0.4)" },
              { offset: 1, color: "rgba(2, 132, 199, 0.05)" },
            ]),
          },
        },
      ],
    };
  };

  return (
    <div className="app-container" style={{ position: "relative" }}>
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
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 20px",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              background: toast.type === "success" ? "#ecfdf5" : "#fef2f2",
              border:
                toast.type === "success"
                  ? "1px solid #a7f3d0"
                  : "1px solid #fecaca",
              color: toast.type === "success" ? "#065f46" : "#991b1b",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Controls */}
      <div className="glass-panel">
        <h1>QCM Session</h1>
        <div className="status-indicator">
          <div
            className={isConnected ? "status-dot connected" : "status-dot"}
          ></div>
          <span>{statusText}</span>
        </div>

        <div className="control-group">
          <span className="control-label">Target Name</span>
          <select className="btn custom-select">
            <option>EGFR</option>
            <option>Custom</option>
          </select>
        </div>

        <div className="control-group">
          <button
            className={`btn ${isConnected ? "btn-danger" : "btn-primary"}`}
            onClick={handleConnect}
          >
            {isConnected ? "Disconnect Device" : "Connect Device"}
          </button>
        </div>

        {isConnected && (
          <div className="control-group">
            <button
              className="btn btn-primary"
              onClick={handleCalibrate}
              disabled={isCalibrating}
              style={{ marginBottom: "1rem" }}
            >
              {isCalibrating ? "Calibrating..." : "Start Calibration"}
            </button>

            <button
              className="btn btn-success"
              disabled={true} // disabled until measure phase is implemented
            >
              Start Measurement
            </button>
          </div>
        )}

        {chartData.length > 0 && user && (
          <div className="control-group" style={{ marginBottom: "1rem" }}>
            <button
              className="btn btn-warning"
              onClick={handleSaveAnalysis}
              disabled={isSaving}
              style={{
                width: "100%",
                background: "#eab308",
                color: "white",
                border: "none",
                padding: "0.75rem",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {isSaving ? "Saving..." : "Save Run to History"}
            </button>
          </div>
        )}

        {chartData.length > 0 && !user && (
          <div
            style={{
              fontSize: "0.8rem",
              color: "#64748b",
              fontStyle: "italic",
              textAlign: "center",
              margin: "0.5rem 0",
            }}
          >
            Log in to save this analysis run.
          </div>
        )}

        <div className="metrics-grid">
          <div className="metric-card">
            <span className="control-label">Before (Hz)</span>
            <div className="metric-value">--,---</div>
          </div>
          <div className="metric-card">
            <span className="control-label">After (Hz)</span>
            <div className="metric-value">--,---</div>
          </div>
          <div className="metric-card" style={{ gridColumn: "1 / -1" }}>
            <span className="control-label">Delta (Hz)</span>
            <div className="metric-value" style={{ color: "var(--warning)" }}>
              --
            </div>
          </div>
        </div>

        {/* Saved Runs History */}
        {user && (
          <div
            style={{
              marginTop: "1.5rem",
              borderTop: "1px solid rgba(0,0,0,0.08)",
              paddingTop: "1.5rem",
            }}
          >
            <h3
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "#1e293b",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <History className="w-4 h-4 text-blue-500" />
              <span>Saved Runs</span>
            </h3>
            {analyses.length === 0 ? (
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#64748b",
                  fontStyle: "italic",
                }}
              >
                No saved runs yet.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  maxHeight: "180px",
                  overflowY: "auto",
                  paddingRight: "4px",
                }}
                className="custom-scrollbar"
              >
                {analyses.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleLoadAnalysis(item)}
                    style={{
                      background: "rgba(2, 132, 199, 0.04)",
                      border: "1px solid rgba(2, 132, 199, 0.1)",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.8rem",
                      transition: "all 0.2s",
                    }}
                    className="hover:bg-sky-50 transition-colors"
                  >
                    <div style={{ minWidth: 0, flex: 1, marginRight: "8px" }}>
                      <p
                        style={{
                          fontWeight: 600,
                          color: "#334155",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.title}
                      </p>
                      <p
                        style={{
                          fontSize: "0.7rem",
                          color: "#64748b",
                          margin: "2px 0 0",
                        }}
                      >
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Chart Area */}
      <div
        className="glass-panel"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div style={{ flex: 1 }}>
          <ReactECharts
            option={getOption()}
            style={{ height: "500px", width: "100%" }}
            notMerge={true}
            // Removed theme="dark" to match medical light branding
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
