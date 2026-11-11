"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./artifice.module.css";

/**
 * Artifice as it launched: four of the screenshots Will sent on 11 Feb 2023 for the SOTAI website
 * ("Artifice Screenshots", artifice-screenshots.zip), in the order someone makes a model. The
 * screens are the real product; the data is the team's demo set, a public heart disease table.
 */
const STEPS = [
  { key: "configure", label: "Configure", src: "artifice-configure.webp", alt: "A model configuration: each column marked numerical or categorical and selected, with the model type, loss and metric on the right." },
  { key: "train", label: "Train", src: "artifice-train.webp", alt: "Training: three configurations, with a task panel showing one model 78% trained and another finished." },
  { key: "compare", label: "Compare", src: "artifice-compare.webp", alt: "Trained models: eight models from one configuration, each with its epochs, learning rate, batch size and scores, all marked Success." },
  { key: "results", label: "Results", src: "artifice-results.webp", alt: "A trained model's results: training time, epochs, test score, a feature importance chart and accuracy and loss curves." },
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
        Artifice as it launched, from screenshots the team sent in February 2023. Step through setting up a model,
        training it, comparing the runs and reading the results.
      </figcaption>
    </figure>
  );
}
