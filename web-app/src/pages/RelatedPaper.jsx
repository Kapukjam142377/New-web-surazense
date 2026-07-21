import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function RelatedPaper() {
  const { language } = useLanguage();

  return (
    <div
      className="glass-panel"
      style={{
        maxWidth: "1200px",
        margin: "4rem auto",
        padding: "3rem 3.5rem",
      }}
    >
      <h2
        style={{
          color: "var(--text-main)",
          marginBottom: "1.5rem",
          fontSize: "2.2rem",
          textAlign: "center",
          fontWeight: "800",
        }}
      >
        {language === "th" ? "งานวิจัยที่เกี่ยวข้อง" : "Related Papers"}
      </h2>

      <h3
        style={{
          color: "var(--text-main)",
          marginBottom: "1.5rem",
          fontSize: "1.5rem",
          fontWeight: "700",
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: "0.75rem",
        }}
      >
        {language === "th" ? "โปรไฟล์ทางวิชาการ" : "Academic Profiles"}
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "0.5rem 0.75rem",
          alignItems: "center",
          marginBottom: "2.5rem",
          fontSize: "1.05rem",
          lineHeight: "1.5",
        }}
      >
        <span style={{ fontWeight: "700", color: "var(--text-main)" }}>
          {language === "th"
            ? "ประวัติการเผยแพร่งานวิจัย:"
            : "Publications Profiles:"}
        </span>
        <a
          href="https://scholar.google.com/citations?user=87fuXWsAAAAJ&hl=en"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#0284c7",
            textDecoration: "none",
            fontWeight: "600",
          }}
          onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
          onMouseOut={(e) => (e.target.style.textDecoration = "none")}
        >
          {language === "th" ? "ธิตา สนกลิ่น" : "Thita Sonklin"}
        </a>
        <span style={{ color: "#cbd5e1" }}>|</span>
        <a
          href="https://scholar.google.com/citations?user=t58Kg7YAAAAJ&hl=en"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#0284c7",
            textDecoration: "none",
            fontWeight: "600",
          }}
          onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
          onMouseOut={(e) => (e.target.style.textDecoration = "none")}
        >
          {language === "th"
            ? "อ.สุดเขตต์ พจน์ประไพ"
            : "Assoc. Prof. Dr. Soodkhet Pojprapai"}
        </a>
        <span style={{ color: "#cbd5e1" }}>|</span>
        <a
          href="https://www.researchgate.net/profile/Sanong-Suksaweang"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#0284c7",
            textDecoration: "none",
            fontWeight: "600",
          }}
          onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
          onMouseOut={(e) => (e.target.style.textDecoration = "none")}
        >
          {language === "th"
            ? "อ.สนอง สุขแสวง"
            : "Assoc. Prof. Dr. Sanong Suksaweang"}
        </a>
      </div>

      <h3
        style={{
          color: "var(--text-main)",
          marginBottom: "1.5rem",
          fontSize: "1.5rem",
          fontWeight: "700",
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: "0.75rem",
        }}
      >
        {language === "th"
          ? "เอกสารและสิ่งตีพิมพ์ทางวิชาการ"
          : "Academic Publications & Literature"}
      </h3>

      <div
        style={{
          color: "var(--text-muted)",
          lineHeight: "1.75",
          fontSize: "1.05rem",
          textAlign: "justify",
        }}
      >
        <p style={{ marginBottom: "2rem", textIndent: "2em" }}>
          {language === "th"
            ? "รายการเอกสารสิ่งตีพิมพ์และงานวิจัยทางวิชาการที่เกี่ยวข้องกับการพัฒนาเทคโนโลยีไบโอเซนเซอร์ (Biosensor) และเครื่องตรวจวัดความชื้น/มวลในระดับไมโครคาร์บอน (Quartz Crystal Microbalance: QCM) เพื่อสนับสนุนการวินิจฉัยมะเร็งและการประยุกต์ใช้งานด้านการแพทย์อื่น ๆ"
            : "A list of academic publications and research literature relating to the development of biosensor technology and Quartz Crystal Microbalance (QCM) platforms to support cancer diagnostics and other biomedical applications."}
        </p>

        {/* Bibliography List */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            marginTop: "2rem",
          }}
        >
          <div
            style={{
              paddingLeft: "1.5rem",
              borderLeft: "3px solid #0284c7",
              marginBottom: "1rem",
            }}
          >
            {/* Academic Reference */}
            <p style={{ marginBottom: "0.5rem", textIndent: "0" }}>
              Sonklin, T., Tongpeng, S., Munthala, D., Suksaweang, S.,
              Janphuang, P., Bharti, A., Mathur, A., Avasthi, D. K.,
              Jiansirisomboon, S., & Pojprapai, S. (2024).{" "}
              <a
                href="https://www.sciencedirect.com/science/article/abs/pii/S2468023024000361"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0284c7",
                  textDecoration: "none",
                  fontWeight: "600",
                }}
                onMouseOver={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseOut={(e) => (e.target.style.textDecoration = "none")}
              >
                Development of gold nanospikes-modified quartz crystal
                microbalance biosensor for prostate specific antigen detection
              </a>
              . <em>Surfaces and Interfaces</em>, <em>45</em>, 103877.{" "}
              <a
                href="https://doi.org/10.1016/j.surfin.2024.103877"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0284c7",
                  textDecoration: "none",
                  marginLeft: "0.5rem",
                }}
                onMouseOver={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseOut={(e) => (e.target.style.textDecoration = "none")}
              >
                [DOI: 10.1016/j.surfin.2024.103877]
              </a>
            </p>
            {/* Abstract/Note */}
            <p
              style={{
                fontSize: "0.95rem",
                color: "#64748b",
                margin: 0,
                textIndent: "0",
              }}
            >
              <strong>
                {language === "th"
                  ? "บทคัดย่อ/รายละเอียด:"
                  : "Abstract/Detail:"}
              </strong>{" "}
              {language === "th"
                ? "งานวิจัยนี้อธิบายการพัฒนาไบโอเซนเซอร์ที่ใช้โครงสร้างนาโนสไปก์ทอง (gold nanospikes) ในการปรับปรุงพื้นผิวอิเล็กโทรดบน Quartz Crystal Microbalance (QCM) เพื่อใช้ตรวจหาโปรตีนบ่งชี้มะเร็งต่อมลูกหมาก (PSA) ซึ่งเป็นเครื่องหมายทางชีวภาพที่สำคัญ ช่วยเพิ่มความไวในการตรวจวัดได้อย่างมีนัยสำคัญ"
                : "This study details the development of a biosensor utilizing gold nanospikes to modify a quartz crystal microbalance (QCM) platform for the detection of prostate-specific antigen (PSA), a critical biomarker for prostate cancer, significantly enhancing detection sensitivity."}
            </p>
          </div>

          <div
            style={{
              paddingLeft: "1.5rem",
              borderLeft: "3px solid #0284c7",
              marginBottom: "1rem",
            }}
          >
            {/* Academic Reference */}
            <p style={{ marginBottom: "0.5rem", textIndent: "0" }}>
              Tongpeng, S., Weerapakdee, C., Sonklin, T., Pojprapai, S., &
              Jiansirisomboon, S. (2025).{" "}
              <a
                href="https://www.mdpi.com/2227-7080/13/12/544"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0284c7",
                  textDecoration: "none",
                  fontWeight: "600",
                }}
                onMouseOver={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseOut={(e) => (e.target.style.textDecoration = "none")}
              >
                A Portable QCM-Based Biosensor-Incorporated Graphene Oxide for
                Point-of-Care Prostate Cancer Marker Detection
              </a>
              . <em>Technologies</em>, <em>13</em>(12), 544.{" "}
              <a
                href="https://doi.org/10.3390/technologies13120544"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0284c7",
                  textDecoration: "none",
                  marginLeft: "0.5rem",
                }}
                onMouseOver={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseOut={(e) => (e.target.style.textDecoration = "none")}
              >
                [DOI: 10.3390/technologies13120544]
              </a>
            </p>
            {/* Abstract/Note */}
            <p
              style={{
                fontSize: "0.95rem",
                color: "#64748b",
                margin: 0,
                textIndent: "0",
              }}
            >
              <strong>
                {language === "th"
                  ? "บทคัดย่อ/รายละเอียด:"
                  : "Abstract/Detail:"}
              </strong>{" "}
              {language === "th"
                ? "การศึกษานี้เสนอแพลตฟอร์มไบโอเซนเซอร์แบบพกพาโดยใช้เทคโนโลยี Quartz Crystal Microbalance (QCM) ร่วมกับกราฟีนออกไซด์ (Graphene Oxide) สำหรับการตรวจวัดสารบ่งชี้มะเร็งต่อมลูกหมาก เพื่อมุ่งตอบสนองความต้องการการตรวจวินิจฉัย ณ จุดดูแลผู้ป่วย (Point-of-Care Diagnostics) และช่วยพัฒนาการตรวจพบมะเร็งในระยะแรกเริ่ม"
                : "This research presents a portable biosensing platform using Quartz Crystal Microbalance (QCM) technology enhanced with graphene oxide for the detection of prostate cancer markers. The study focuses on addressing the need for effective point-of-care diagnostics to improve early-stage detection of prostate cancer."}
            </p>
          </div>

          <div
            style={{
              paddingLeft: "1.5rem",
              borderLeft: "3px solid #0284c7",
              marginBottom: "1rem",
            }}
          >
            {/* Academic Reference */}
            <p style={{ marginBottom: "0.5rem", textIndent: "0" }}>
              Munthala, D., Sonklin, T., Chanlek, N., Mathur, A., Roy, S.,
              Avasthi, D. K., Suksaweang, S., & Pojprapai, S. (2025).{" "}
              <a
                href="https://www.mdpi.com/2227-7080/13/3/114"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0284c7",
                  textDecoration: "none",
                  fontWeight: "600",
                }}
                onMouseOver={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseOut={(e) => (e.target.style.textDecoration = "none")}
              >
                Portable DNA Probe Detector and a New Dry-QCM Approach for
                SARS-CoV-2 Detection
              </a>
              . <em>Technologies</em>, <em>13</em>(3), 114.{" "}
              <a
                href="https://doi.org/10.3390/technologies13030114"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0284c7",
                  textDecoration: "none",
                  marginLeft: "0.5rem",
                }}
                onMouseOver={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseOut={(e) => (e.target.style.textDecoration = "none")}
              >
                [DOI: 10.3390/technologies13030114]
              </a>
            </p>
            {/* Abstract/Note */}
            <p
              style={{
                fontSize: "0.95rem",
                color: "#64748b",
                margin: 0,
                textIndent: "0",
              }}
            >
              <strong>
                {language === "th"
                  ? "บทคัดย่อ/รายละเอียด:"
                  : "Abstract/Detail:"}
              </strong>{" "}
              {language === "th"
                ? "งานวิจัยนี้นำเสนอระบบตรวจวัดแบบพกพาสำหรับตรวจหาไวรัส SARS-CoV-2 โดยใช้ดีเอ็นเอโพรบ (DNA probe) ร่วมกับแนวทางการตรวจวัดแบบแห้ง (dry-QCM) บนอุปกรณ์ Quartz Crystal Microbalance ซึ่งเป็นวิธีแบบใหม่ในการตรวจวินิจฉัย ณ จุดดูแลผู้ป่วยที่มีความรวดเร็วและมีประสิทธิภาพสูง"
                : "This research presents a portable detection system for SARS-CoV-2 utilizing a DNA probe and an innovative 'dry-QCM' (Quartz Crystal Microbalance) approach. The study highlights the successful application of dry-state QCM sensing for efficient point-of-care diagnostics."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
