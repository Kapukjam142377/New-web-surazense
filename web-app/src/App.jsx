import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { serialInstance } from './utils/serialService';
import { baselineCorrection, findPeak, sgFilter } from './utils/mathUtils';

function App() {
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
    const dataRaw = buffer.split('\r\n');
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
    for(let i=0; i<samples; i++) {
      readFREQ.push(8 + (12 - 8) * (i / (samples - 1)));
    }
    
    // Baseline estimation
    try {
        const { magBaselineCorrected } = baselineCorrection(readFREQ, dataMag, 8);
        setCalibrationBaseLine(magBaselineCorrected);
        setBaselineFreqs(readFREQ);
        setBaselineMag(dataMag); // We just store raw data for visual currently
        
        let plotData = [];
        for(let i=0; i<readFREQ.length; i++){
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
        trigger: 'axis'
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: 'Frequency (MHz)',
        nameLocation: 'middle',
        nameGap: 30,
        splitLine: { show: false },
        min: 8,
        max: 12,
        axisLabel: { color: '#94a3b8' },
        nameTextStyle: { color: '#94a3b8' }
      },
      yAxis: {
        type: 'value',
        name: 'Amplitude (dB)',
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
        axisLabel: { color: '#94a3b8' },
        nameTextStyle: { color: '#94a3b8' }
      },
      series: [
        {
          name: 'Amplitude',
          type: 'line',
          showSymbol: false,
          data: chartData,
          lineStyle: {
            color: '#3b82f6',
            width: 2
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59, 130, 246, 0.5)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
            ])
          }
        }
      ]
    };
  };

  return (
    <div className="app-container">
      {/* Sidebar Controls */}
      <div className="glass-panel">
        <h1>QCM Monitor Web</h1>
        <div className="status-indicator">
          <div className={isConnected ? "status-dot connected" : "status-dot"}></div>
          <span>{statusText}</span>
        </div>

        <div className="control-group">
          <span className="control-label">Target Name</span>
          <select className="btn" style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem' }}>
            <option>EGFR</option>
            <option>Custom</option>
          </select>
        </div>

        <div className="control-group">
          <button 
            className={`btn ${isConnected ? 'btn-danger' : 'btn-primary'}`} 
            onClick={handleConnect}
          >
            {isConnected ? 'Disconnect Device' : 'Connect Device'}
          </button>
        </div>

        {isConnected && (
            <div className="control-group">
              <button 
                className="btn btn-primary" 
                onClick={handleCalibrate}
                disabled={isCalibrating}
                style={{ marginBottom: '1rem' }}
              >
                {isCalibrating ? 'Calibrating...' : 'Start Calibration'}
              </button>
              
              <button 
                className="btn btn-success" 
                disabled={true} // disabled until measure phase is implemented
              >
                Start Measurement
              </button>
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
           <div className="metric-card" style={{ gridColumn: '1 / -1' }}>
              <span className="control-label">Delta (Hz)</span>
              <div className="metric-value" style={{ color: 'var(--warning)' }}>--</div>
           </div>
        </div>

      </div>

      {/* Main Chart Area */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <ReactECharts 
            option={getOption()} 
            style={{ height: '500px', width: '100%' }} 
            notMerge={true} 
            theme="dark" 
          />
        </div>
      </div>
    </div>
  );
}

export default App;
