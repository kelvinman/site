"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./artifice.module.css";

/**
 * Artifice as it launched: six of the screenshots Will sent on 11 Feb 2023 for the SOTAI website
 * ("Artifice Screenshots", artifice-screenshots.zip), in the order someone makes a model. The
 * screens are the real product; the data is the team's demo set, a public heart disease table.
 */
const STEPS = [
  { key: "data", label: "Data", src: "artifice-data.webp", alt: "The data library: four copies of a heart disease table, each card showing its rows, columns, models and whether it is raw or clean." },
  { key: "clean", label: "Clean", src: "artifice-clean.webp", alt: "Cleaning a table: the raw rows on the left, and on the right the column to predict, the kind of prediction, and a slider to drop mostly empty rows." },
  { key: "configure", label: "Configure", src: "artifice-configure.webp", alt: "A model configuration: each column marked numerical or categorical and selected, with the model type, loss and metric on the right." },
  { key: "train", label: "Train", src: "artifice-train.webp", alt: "Training: three configurations, with a task panel showing one model 78% trained and another finished." },
  { key: "results", label: "Results", src: "artifice-results.webp", alt: "A trained model's results: training time, epochs, test score, a feature importance chart and accuracy and loss curves." },
  { key: "explain", label: "Explain", src: "artifice-explain.webp", alt: "Feature analysis for cholesterol: its range and average, and a curve showing how the model's output changes as cholesterol rises." },
];

export function ArtificeSteps() {
  const [step, setStep] = useState(0);

  return (
    <figure className={demo.demo}>
      <div className={styles.screen}>
        {STEPS.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized
          <img
            key={s.key}
            src={`/work/mirascope/${s.src}`}
            alt={s.alt}
            width={1224}
            height={872}
            loading="lazy"
            aria-hidden={i !== step}
            data-on={i === step}
          />
        ))}
      </div>

      <div className={demo.toggle} role="group" aria-label="Step">
        {STEPS.map((s, i) => (
          <button key={s.key} type="button" aria-pressed={i === step} onClick={() => setStep(i)}>
            {s.label}
          </button>
        ))}
      </div>

      <figcaption className={demo.caption}>
        Artifice as it launched, from screenshots the team sent in February 2023. Step through how a model gets
        made, from a table of data to why the model decides what it does.
      </figcaption>
    </figure>
  );
}
