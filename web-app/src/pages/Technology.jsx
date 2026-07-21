import React from "react";

export default function Technology() {
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
        Technology
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
        Biosensor: Principle and Their Applications
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
          Over the decade, biosensors have been widely used to detect cancer
          biomarkers, such as electrochemical, optical, and piezoelectric (Hong
          et al., 2022; Li et al., 2022; C. Lino et al., 2022). The superior
          characteristics of these biosensors included their portability,
          sensitivity, response accuracy, reproducibility, high specificity, and
          repeatability (Akgönüllü, Özgür, & Denizli, 2022; Malode & Shetti,
          2022; Narita et al., 2021). The use of specific and sensitive
          analytical biosensing devices for early-stage cancer detection is
          considered the future of clinical advancements (Iqbal et al., 2022).
        </p>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          A biosensor, also known as a biological sensor, is a self-contained
          bioanalytical system that integrates biological molecules that
          determine illness-related signs in biological fluids for disease
          monitoring and detection, with a physical-chemical transducer
          electronic amplifier and display platform that can receive, respond,
          exhibit and converts a biological signal into a quantified and
          processable signal. The first generation of biosensor technology was
          pioneered by Leland C. Clark, Jr in 1956 (Bhalla, Jolly, Formisano, &
          Estrela, 2016).
        </p>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          A typical biosensor, as depicted in Figure 2.5, comprises several
          components:
        </p>

        <ul
          style={{ listStyleType: "none", paddingLeft: "0", marginTop: "1rem" }}
        >
          <li style={{ marginBottom: "1.25rem" }}>
            <strong>(1) Analyte:</strong> This refers to the substance being
            targeted for detection, such as glucose, ammonia, alcohol, antigen,
            virus, toxins, or target DNA.
          </li>
          <li style={{ marginBottom: "1.25rem" }}>
            <strong>
              (2) Biorecognition element (also known as a bioreceptor):
            </strong>{" "}
            this molecule specifically identifies the target substrate (i.e.,
            analyte) such as enzymes, cells, aptamers, DNA, and antibodies.
          </li>
          <li style={{ marginBottom: "1.25rem" }}>
            <strong>(3) Transducer:</strong> Its role is crucial in translating
            the biological interaction into a measurable form. This energy
            conversion process, known as signalization, typically results in
            either optical or electrical signals. Transducers can broadly be
            classified as electrochemical, optical, thermal, electronic, or
            gravimetric, light, heat, pH changes, plant or animal tissue
            reactions, or microbial product emissions depending on their
            operating principle.
          </li>
          <li style={{ marginBottom: "1.25rem" }}>
            <strong>(4) Electronics:</strong> This component processes the
            transduced signal, readying it for display. It involves intricate
            electronic circuitry that performs tasks such as signal
            conditioning, including amplification and conversion of signals from
            analog to digital. These processed signals are then quantified by
            the biosensor's display unit.
          </li>
          <li style={{ marginBottom: "1.25rem" }}>
            <strong>(5) Display:</strong> Comprising both hardware and software
            elements, the display presents the biosensor's results in a
            user-friendly format. The output signal displayed can take various
            forms, including numeric, graphic, tabular, or image-based,
            depending on the end user's requirements (Bhalla et al., 2016;
            Gergeroglu, Yildirim, & Ebeoglugil, 2020; Iqbal et al., 2022).
          </li>
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
            Figure 2.5 Schematic diagram of a component of biosensor, including
            a bioreceptor, transducer, electronic system, and display, alongside
            various types of bioreceptors and transducers utilized in
            biosensors. (Iqbal et al., 2022)
          </p>
        </div>

        <p
          style={{
            marginTop: "1.5rem",
            marginBottom: "1.25rem",
            textIndent: "2em",
          }}
        >
          Currently, various technologies assert their suitability for
          biosensing applications, serving as proofs of concept or commercially
          viable products. The primary application domains of biosensor
          technology encompass medical, food, industrial, environmental
          measurement, and biodefense fields (Mehrotra, 2016). The extensive
          utilization of biosensor technology can be attributed to its
          substantial advantages over established analytical methods, including
          a minimal sample pretreatment, cost effective instrumentation, rapid
          response times, and high sensitivity.
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
          Types of Biosensors
        </h3>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          Biosensors encompass a diverse and multidisciplinary field, typically
          categorized into four main groups. Firstly, based on bioreceptor
          components, they include enzyme, antibody-antigen, whole-cell, nucleic
          acid, biomimetic, aptamer, tissue, and phage-based biosensors.
          Secondly, classification by transducers and sensors divides them into
          electrochemical, optical, piezoelectric, thermal, and gravimetric
          types. Thirdly, biosensors may be classified based on fabrication
          technology. Lastly, they can be categorized based on sensing
          mechanisms, including optical, electrical, electronic, thermal,
          magnetic, or mechanical approaches. This categorization is depicted in
          Figure 2.6.
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
            Figure 2.6 Classifications of biosensor. (Curulli, 2021)
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
          Types of Acoustic Wave Biosensors
        </h3>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          Acoustic biosensors offer promising solutions for the rapid,
          sensitive, and cost-effective detection of both gaseous and liquid
          analytes. These sensors typically utilize either bulk or SAW, as
          illustrated in Figure 2.7, to operate at different frequencies.
          Generally, they rely on the piezoelectric effect, where certain
          piezoelectric generate an electric potential when subjected to
          mechanical stress and vice versa, creating an internal mechanical
          stress in response to an applied electrical potential. The
          piezoelectric materials and their phenomenon are described in Section
          2.4.
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
            Figure 2.7 The various types of acoustic sensors and their
            corresponding operational frequencies. (Palla-Papavlu, Voicu, &
            Dinescu, 2021)
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
          Piezoelectric Biosensors
        </h3>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          Various types of transducers, including optical (light),
          electrochemical, and piezoelectric (mass variation), have been
          employed in the development of biosensors. The coupling of electrical
          and mechanical energy renders piezoelectric materials invaluable
          across a wide range of applications, including energy conversion,
          sensors and actuators, and telecommunication. Piezoelectric sensors
          are particularly suitable for assays involving changes in viscosity
          and surface elasticity, such as aggregations, coagulations, and
          precipitations, making them popular choices for biosensor detection.
          In contrast to conventional methods that depend on labels such as
          enzymes, fluorophores, and radioactivity, the utilization of
          piezoelectric devices as biosensors has experienced a steady rise in
          interest. This is attributed to their appealing applications in
          mass-sensitive detection without the requirement for labeling at the
          sensor surface, along with their capability for real-time monitoring,
          consequently simplifying assay formats (Skládal, 2024). An advantage
          of piezoelectric devices over other techniques is illustrated in Table
          2.2.
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
            Table 2.2 Comparison of various detection techniques. (Narita et
            al., 2021)
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
          Piezoelectric Phenomena
        </h3>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          In 1880, Pierre and Jacques Curie discovered piezoelectric materials
          through experiments that involved measuring surface charges on
          specially prepared crystals such as quartz, barium titanate, topaz,
          Rochelle salt (sodium potassium tartrate tetrahydrate
          (NaKC4H4O6·4H2O), and tourmaline, when subjected to mechanical stress.
          The term "piezoelectric" originates from the Greek word "piezein,"
          which translates to "to press" or "to squeeze." Therefore,
          "piezoelectricity" essentially signifies "pressure induced electricity
          (Behera, 2022; Sezer & Koç, 2021).
        </p>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          Piezoelectricity, or the piezoelectric effect, is a physical
          phenomenon that refers to the ability of piezoelectric materials to
          produce an electric charge when subjected to mechanical stress, known
          as the direct effect. Conversely, the effect also operates in the
          opposite situation, known as the converse effect, where a voltage
          applied to the surface of a piezoelectric material causes mechanical
          stress or oscillation. This phenomenon is depicted in Figures 2.8 and
          2.9.
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
            Figure 2.8 The direct piezoelectric effect with the following
            components: (a) A piezoelectric material without applying any force,
            (b) The application of tension to generate voltage, and (c) The
            application of compression to generate voltage. (Vatansever, Siores,
            & Shah, 2012)
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
            Figure 2.9 The converse or indirect piezoelectric effect as follows:
            (a) A piezoelectric material, (b) Expansion of the material caused
            by applying electrical current, and (c) Shrinkage of the material
            caused by applying opposite electrical current. (Vatansever et al.,
            2012)
          </p>
        </div>

        <p
          style={{
            marginTop: "1.5rem",
            marginBottom: "1.25rem",
            textIndent: "2em",
          }}
        >
          The piezoelectric material is stimulated by an alternating voltage
          applied to its surface via electrodes. This alternating voltage
          induces mechanical oscillations in the piezoelectric material, and the
          frequency of these oscillations is measured using an oscillation
          circuit. In common biosensor applications, a simple oscillation is
          typically preferred. The piezoelectric platform is considered ideal
          for constructing biosensors. The characteristics of the oscillations
          can be varied depending on factors such as the material, electrical
          contacts, and material shape. These oscillations are commonly spread
          across the material, causing the generation of acoustic waves. Both
          SAWs propagating across the material’s surface and bulk acoustic waves
          occurring within its depths can occur in the oscillating material.
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
          Constitutive Properties of Piezoelectric Materials
        </h3>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          The distinctive feature that distinguishes piezoelectric devices from
          others is their remarkable electromechanical interaction between the
          mechanical and electrical states in crystalline materials. Unlike
          purely mechanical or electrical devices, piezoelectric crystals can
          generate an electrical response when mechanically disturbed, and vice
          versa (Mandal & Banerjee, 2022).
        </p>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          The relation between stress, strain, electric field, and electric
          displacement field in a stress-charge form (Cheng, Lu, Yang, Gong, &
          Ke, 2023; Liang, Zhang, Xu, Tan, & Zhang, 2022) of a piezoelectric
          crystal is delineated by the piezoelectric linear constitutive
          equations, as described below:
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
          where{" "}
          <em>
            T<sub>ij</sub>
          </em>{" "}
          is the second-order stress tensor,{" "}
          <em>
            D<sub>i</sub>
          </em>{" "}
          is the electrical displacement vector (C/m<sup>2</sup>),{" "}
          <em>
            S<sub>kl</sub>
          </em>{" "}
          is the strain tensor of the medium,
          <em>
            E<sub>k</sub>
          </em>{" "}
          is the electric field vector (V/m).{" "}
          <em>
            C<sup>E</sup>
            <sub>ijkl</sub>
          </em>
          ,
          <em>
            e<sub>ikl</sub>
          </em>
          , and{" "}
          <em>
            &epsilon;<sup>S</sup>
            <sub>ik</sub>
          </em>{" "}
          are the elasticity tensor (N/m<sup>2</sup>), the piezoelectric tensor
          (C/m<sup>2</sup>), and the permittivity tensor (F/m), respectively.
        </p>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          According to the principle of the piezoelectric effect, piezoelectric
          materials can serve a valuable role in biosensor applications. In this
          context, these materials function as oscillators based on the
          piezoelectric effect principle. Their interaction with analytes on
          their surface maximizes the advantages offered by the piezoelectric
          biosensor platform.
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
          Principle of Piezoelectric Biosensor
        </h3>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          Piezoelectric biosensors are analytical devices utilized for
          determining various analytes. These biosensors, employing the
          piezoelectric effect, rely on the propagation of high-frequency
          acoustic waves within the bulk or the surface of a medium. Changes in
          velocity and amplitude are induced by mass loading or medium
          viscosity. Detection mechanisms in these devices occur at one of the
          surfaces of the piezoelectric material, specifically on the top
          electrode, where variations resulting from the interaction between the
          analyte and immobilized biomolecules can be converted into frequency
          or phase changes (Di Pietrantonio, Cannatà, & Benetti, 2019). Figure
          2.10 illustrates the principle of piezoelectric biosensors,
          specifically focusing on QCM, in the detection of antigen-antibody
          interaction. Here, an antibody serves as the biorecognition element,
          and the specificity of the antibody significantly influences its
          binding affinity for particular antigens, which serve as the analyte.
          The piezoelectric biosensor exhibits specificity when the employed
          antibody is specific, and the electrode, along with other sensitive
          parts of the piezoelectric material, remains insensitive to unspecific
          reactions with interfering compounds. Probe antibodies are immobilized
          on the upper electrode surface of the piezoelectric material, as
          depicted in Figure 2.10a. Both upper and lower electrodes drive the
          resonance. The target antigen subsequently binds with the antibodies,
          resulting in a mass change (&Delta;m) on the electrode surface, which
          leads to a time-dependent frequency shift recorded, as illustrated in
          Figure 2.10b. This shift is represented by the frequency change
          (&Delta;f) in the oscillation circuit (Narita et al., 2021; M.
          Pohanka, 2018).
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
            Figure 2.10 (a) The working principle of a piezoelectric biosensor
            designed for detecting antigen-antibody interactions, (b) The
            relationship between voltage and time and (c) Amplitude influences
            frequency during the detection process. (Narita et al., 2021)
          </p>
        </div>

        <p
          style={{
            marginTop: "1.5rem",
            marginBottom: "1.25rem",
            textIndent: "2em",
          }}
        >
          Piezoelectric transducers have served as chemical sensors since
          Sauerbrey discovered the correlation between the mass of adsorbed
          films and resonant frequency. QCM and SAW piezoelectric devices are
          piezoelectric biosensors primarily detecting analytes through mass
          loading on the substrate's surface (Aslam, Zhang, Sreejith, Naghdi, &
          Ju, 2023; Di Pietrantonio et al., 2019). The mass loading effect,
          where the resonance frequency shift is proportional to adding mass and
          inversely proportional to the surface area of the working electrode,
          can be determined using Sauerbrey's equation (SAUERBREY, 1962), which
          is expressed as follows:
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
          where{" "}
          <em>
            f<sub>0</sub>
          </em>{" "}
          is the resonance frequency, <em>&Delta;f</em> is the change in
          resonance frequency, <em>&Delta;m</em> is the mass change, <em>A</em>{" "}
          is the active surface area, <em>&rho;</em> is the effective density,
          and <em>h</em> is the thickness of the device.
        </p>

        <p style={{ marginBottom: "1.25rem", textIndent: "2em" }}>
          For the QCM, Sauerbrey's equation can be expressed as follows:
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
          where <em>A</em> is the active surface area of the QCM electrodes,{" "}
          <em>
            &rho;<sub>q</sub>
          </em>{" "}
          is the density of quartz (2.648 g cm<sup>&minus;3</sup>), and{" "}
          <em>
            &mu;<sub>q</sub>
          </em>{" "}
          is the shear modulus of quartz (for AT-cut quartz, 2.947 &times; 10
          <sup>11</sup> g cm<sup>&minus;1</sup> s<sup>&minus;2</sup>).
        </p>
      </div>
    </div>
  );
}
