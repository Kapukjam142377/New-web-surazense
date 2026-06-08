export class SerialService {
  constructor() {
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.keepReading = true;
    this.onConnectStatusChange = null;
    this.isConnecting = false;
    this._setupAutoConnectListeners();
  }

  _setupAutoConnectListeners() {
    if (navigator.serial) {
      navigator.serial.addEventListener("connect", async (event) => {
        // Automatically connect to the port that was just plugged in
        const port = event.target;
        this.port = port;
        try {
          await this.connect(115200);
          if (this.onConnectStatusChange) this.onConnectStatusChange(true);
        } catch (e) {
          console.error("Auto-connect failed:", e);
        }
      });

      navigator.serial.addEventListener("disconnect", (event) => {
        if (this.port === event.target) {
          this.disconnect();
          if (this.onConnectStatusChange) this.onConnectStatusChange(false);
        }
      });
    }
  }

  // Check if there are previously approved ports, and auto connect
  async autoConnectValidPort() {
    if (!navigator.serial) return false;
    try {
      const ports = await navigator.serial.getPorts();
      if (ports.length > 0) {
        this.port = ports[0];
        return await this.connect(115200);
      }
    } catch (e) {
      console.error("Failed to fetch pre-authorized ports", e);
    }
    return false;
  }

  async requestPort() {
    try {
      if (!navigator.serial) {
        alert(
          "เบราว์เซอร์ของคุณไม่รองรับ Web Serial API (แนะนำ Chrome / Edge)",
        );
        return false;
      }
      this.port = await navigator.serial.requestPort();
      return true;
    } catch (e) {
      console.error("User cancelled port selection.");
      return false;
    }
  }

  async connect(baudRate = 115200) {
    if (!this.port) return false;

    // Prevent errors if already manually opened or locked
    if (this.port.readable) return true;

    // Check if we are already in the middle of a connection attempt (React StrictMode)
    if (this.isConnecting) {
      // Short delay to wait for the other connection to finish
      await new Promise((r) => setTimeout(r, 500));
      return !!this.port?.readable;
    }

    this.isConnecting = true;
    try {
      await this.port.open({
        baudRate: baudRate,
        dataBits: 8,
        stopBits: 1,
        parity: "none",
      });
      this.isConnecting = false;
      return true;
    } catch (e) {
      console.error("Connect error:", e);
      this.isConnecting = false;
      return false;
    }
  }

  async disconnect() {
    this.keepReading = false;
    if (this.reader) {
      try {
        await this.reader.cancel();
      } catch (e) {}
      this.reader = null;
    }
    if (this.writer) {
      this.writer.releaseLock();
      this.writer = null;
    }
    if (this.port) {
      try {
        await this.port.close();
      } catch (e) {}
      this.port = null;
    }
  }

  async writeCommand(cmd) {
    if (!this.port) return;
    const encoder = new TextEncoder();
    this.writer = this.port.writable.getWriter();
    await this.writer.write(encoder.encode(cmd));
    this.writer.releaseLock();
  }

  async readData() {
    let buffer = "";
    const decoder = new TextDecoder();
    this.reader = this.port.readable.getReader();

    try {
      while (this.keepReading) {
        const { value, done } = await this.reader.read();
        if (done) break;

        if (value) {
          buffer += decoder.decode(value, { stream: true });
          if (buffer.includes("s")) {
            break;
          }
        }
      }
    } catch (error) {
      console.error("Read error:", error);
    } finally {
      if (this.reader) {
        this.reader.releaseLock();
      }
    }
    return buffer;
  }
}

export const serialInstance = new SerialService();
