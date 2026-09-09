import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Technology() {
  const { t, language } = useLanguage();

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
        {t("technology.pageTitle")}
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
        {t("technology.biosensorTitle")}
      </h3>

      <div
        style={{
          color: "var(--text-muted)",
          lineHeight: "1.75",
          fontSize: "1.05rem",
          textAlign: "justify",
        }}
      >
        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          {t("technology.biosensorP1")}
        </p>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          {t("technology.biosensorP2")}
        </p>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          {t("technology.biosensorP3")}
        </p>

        <ul
          style={{ listStyleType: "none", paddingLeft: "0", marginTop: "1rem" }}
        >
          <li style={{ marginBottom: "1.25rem" }}>{t("technology.comp1")}</li>
          <li style={{ marginBottom: "1.25rem" }}>
            <strong>{t("technology.comp2")}</strong> {t("technology.comp2Rest")}
          </li>
          <li style={{ marginBottom: "1.25rem" }}>{t("technology.comp3")}</li>
          <li style={{ marginBottom: "1.25rem" }}>{t("technology.comp4")}</li>
          <li style={{ marginBottom: "1.25rem" }}>{t("technology.comp5")}</li>
        </ul>

        <div style={{ textAlign: "center", margin: "2rem auto" }}>
          <img
            src="/tech1.png"
            alt="Figure 2.5: Components of a typical biosensor"
            style={{
              display: "block",
              margin: "0 auto",
              maxWidth: "100%",
              height: "auto",
            }}
          />
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-muted)",
              fontStyle: "italic",
              marginTop: "0.5rem",
            }}
          >
            {t("technology.fig25Caption")}
          </p>
        </div>

        <p
          style={{
            marginTop: "1.5rem",
            marginBottom: "1.25rem",
            textIndent: "2em",
          }}
        >
          {t("technology.biosensorP4")}
        </p>

        <h3
          style={{
            color: "var(--text-main)",
            marginTop: "2.5rem",
            marginBottom: "1.5rem",
            fontSize: "1.5rem",
            fontWeight: "700",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "0.75rem",
          }}
        >
          {t("technology.typesTitle")}
        </h3>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          {t("technology.typesP1")}
        </p>

        <div style={{ textAlign: "center", margin: "2rem auto" }}>
          <img
            src="/tech2.png"
            alt="Figure 2.6: Categorization of biosensors"
            style={{
              display: "block",
              margin: "0 auto",
              maxWidth: "100%",
              height: "auto",
            }}
          />
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-muted)",
              fontStyle: "italic",
              marginTop: "0.5rem",
            }}
          >
            {t("technology.fig26Caption")}
          </p>
        </div>

        <h3
          style={{
            color: "var(--text-main)",
            marginTop: "2.5rem",
            marginBottom: "1.5rem",
            fontSize: "1.5rem",
            fontWeight: "700",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "0.75rem",
          }}
        >
          {t("technology.acousticTitle")}
        </h3>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          {t("technology.acousticP1")}
        </p>

        <div style={{ textAlign: "center", margin: "2rem auto" }}>
          <img
            src="/tech3.png"
            alt="Figure 2.7: Bulk and surface acoustic wave devices"
            style={{
              display: "block",
              margin: "0 auto",
              maxWidth: "100%",
              height: "auto",
            }}
          />
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-muted)",
              fontStyle: "italic",
              marginTop: "0.5rem",
            }}
          >
            {t("technology.fig27Caption")}
          </p>
        </div>

        <h3
          style={{
            color: "var(--text-main)",
            marginTop: "2.5rem",
            marginBottom: "1.5rem",
            fontSize: "1.5rem",
            fontWeight: "700",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "0.75rem",
          }}
        >
          {t("technology.piezoBiosensorTitle")}
        </h3>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          {t("technology.piezoBiosensorP1")}
        </p>

        <div style={{ textAlign: "center", margin: "2rem auto" }}>
          <img
            src="/tech4.png"
            alt="Table 2.2 Comparison of various detection techniques"
            style={{
              display: "block",
              margin: "0 auto",
              maxWidth: "100%",
              height: "auto",
            }}
          />
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-muted)",
              fontStyle: "italic",
              marginTop: "0.5rem",
            }}
          >
            {t("technology.table22Caption")}
          </p>
        </div>

        <h3
          style={{
            color: "var(--text-main)",
            marginTop: "2.5rem",
            marginBottom: "1.5rem",
            fontSize: "1.5rem",
            fontWeight: "700",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "0.75rem",
          }}
        >
          {t("technology.piezoPhenom")}
        </h3>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          {t("technology.piezoPhenomP1")}
        </p>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          {t("technology.piezoPhenomP2")}
        </p>

        <div style={{ textAlign: "center", margin: "2rem auto" }}>
          <img
            src="/tech5.png"
            alt="Figure 2.8 The direct piezoelectric effect"
            style={{
              display: "block",
              margin: "0 auto",
              maxWidth: "100%",
              height: "auto",
            }}
          />
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-muted)",
              fontStyle: "italic",
              marginTop: "0.5rem",
            }}
          >
            {t("technology.fig28Caption")}
          </p>
        </div>

        <div style={{ textAlign: "center", margin: "2rem auto" }}>
          <img
            src="/tech6.png"
            alt="Figure 2.9 The converse or indirect piezoelectric effect"
            style={{
              display: "block",
              margin: "0 auto",
              maxWidth: "100%",
              height: "auto",
            }}
          />
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-muted)",
              fontStyle: "italic",
              marginTop: "0.5rem",
            }}
          >
            {t("technology.fig29Caption")}
          </p>
        </div>

        <p
          style={{
            marginTop: "1.5rem",
            marginBottom: "1.25rem",
            textIndent: "2em",
          }}
        >
          {t("technology.piezoPhenomP3")}
        </p>

        <h3
          style={{
            color: "var(--text-main)",
            marginTop: "2.5rem",
            marginBottom: "1.5rem",
            fontSize: "1.5rem",
            fontWeight: "700",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "0.75rem",
          }}
        >
          {t("technology.constitutiveTitle")}
        </h3>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          {t("technology.constitutiveP1")}
        </p>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          {t("technology.constitutiveP2")}
        </p>

        <div
          style={{
            margin: "2rem 0",
            padding: "0 1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div style={{ fontStyle: "italic", fontSize: "1.1rem" }}>
            T<sub>ij</sub> = C<sup>E</sup>
            <sub>ijkl</sub> S<sub>kl</sub> &minus; e<sub>ikl</sub> E<sub>k</sub>
          </div>
          <div style={{ fontStyle: "italic", fontSize: "1.1rem" }}>
            D<sub>i</sub> = e<sub>ikl</sub> S<sub>kl</sub> + &epsilon;
            <sup>S</sup>
            <sub>ik</sub> E<sub>k</sub>
          </div>
        </div>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          {t("technology.constitutiveP3Intro")}{" "}
          <em>
            T<sub>ij</sub>
          </em>{" "}
          {t("technology.constitutiveP3Mid1")}{" "}
          <em>
            D<sub>i</sub>
          </em>{" "}
          {t("technology.constitutiveP3Mid2")}{" "}
          <em>
            S<sub>kl</sub>
          </em>{" "}
          {t("technology.constitutiveP3Mid3")}
          <em>
            E<sub>k</sub>
          </em>{" "}
          {t("technology.constitutiveP3Mid4")}{" "}
          <em>
            C<sup>E</sup>
            <sub>ijkl</sub>
          </em>
          ,
          <em>
            e<sub>ikl</sub>
          </em>
          , {language === "en" ? "and" : "และ"}{" "}
          <em>
            &epsilon;<sup>S</sup>
            <sub>ik</sub>
          </em>{" "}
          {t("technology.constitutiveP3")}
        </p>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          {t("technology.constitutiveP4")}
        </p>

        <h3
          style={{
            color: "var(--text-main)",
            marginTop: "2.5rem",
            marginBottom: "1.5rem",
            fontSize: "1.5rem",
            fontWeight: "700",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "0.75rem",
          }}
        >
          {t("technology.principlePiezoTitle")}
        </h3>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          {t("technology.principlePiezoP1")}
        </p>

        <div style={{ textAlign: "center", margin: "2rem auto" }}>
          <img
            src="/tech7.png"
            alt="Figure 2.10: Working principle of a piezoelectric biosensor"
            style={{
              display: "block",
              margin: "0 auto",
              maxWidth: "100%",
              height: "auto",
            }}
          />
          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-muted)",
              fontStyle: "italic",
              marginTop: "0.5rem",
            }}
          >
            {t("technology.fig210Caption")}
          </p>
        </div>

        <p
          style={{
            marginTop: "1.5rem",
            marginBottom: "1.25rem",
            textIndent: "2em",
          }}
        >
          {t("technology.principlePiezoP2")}
        </p>

        <div
          style={{
            margin: "2rem 0",
            padding: "0 1.5rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <span style={{ fontStyle: "italic", fontSize: "1.1rem" }}>
            &Delta;f = &minus; ( &Delta;m &middot; f<sub>0</sub> ) / ( A
            &middot; &rho; &middot; h )
          </span>
        </div>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          {t("technology.sauerbrey1Desc")}
        </p>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          {t("technology.sauerbrey2Intro")}
        </p>

        <div
          style={{
            margin: "2rem 0",
            padding: "0 1.5rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <span style={{ fontStyle: "italic", fontSize: "1.1rem" }}>
            &Delta;f = &minus; ( 2 &middot; f<sub>0</sub>
            <sup>2</sup> &middot; &Delta;m ) / ( A &middot; &radic;(&rho;
            <sub>q</sub> &middot; &mu;<sub>q</sub>) )
          </span>
        </div>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          {t("technology.sauerbrey2Desc")}
        </p>
      </div>
    </div>
  );
}
