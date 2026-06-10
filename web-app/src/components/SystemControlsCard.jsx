import React from "react";
import { Cpu, Pause, Play, Square, ArrowLeft } from "lucide-react";

function SystemControlsCard({
  isConnected,
  mode,
  isCalibrating,
  checkPage,
  isMeasurementRunning,
  isMeasurementPaused,
  measurementView,
  handleConnect,
  handleCalibrate,
  handleEnterMeasurementMode,
  handleToggleMeasurement,
  handleStopMeasurement,
  setMeasurementView,
  handleBackToCalibration,
}) {
  return (
    <div className="glass-panel p-4 flex flex-col justify-between">
      <h3 className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
        <Cpu className="w-3.5 h-3.5 text-slate-500" />
        Device & System Controls
      </h3>

      {/* COM Port Details & Status */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg p-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="status-indicator !m-0 !py-0.5 !px-2">
            <div
              className={`status-dot ${isConnected ? "connected" : ""}`}
            ></div>
            <span className="text-[10px]">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-slate-500 font-mono">
            Port: COM3
          </span>
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
                <button
                  className="btn btn-danger px-2.5 !py-1.5"
                  onClick={handleStopMeasurement}
                >
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
  );
}

export default SystemControlsCard;
