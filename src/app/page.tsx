'use client';

import Image from 'next/image'; // Import Next.js Image component
import { useState, useEffect, useCallback } from 'react';
import styles from './CoffeePage.module.css';

// --- Icon Placeholders ---
const IconLightRoast = () => <span className={styles.choiceButtonIcon}>☀️</span>;
const IconDarkRoast = () => <span className={styles.choiceButtonIcon}>🌙</span>;
const IconArrowLeft = () => <span className={styles.iconArrowLeft}></span>;
const IconArrowRight = () => <span className={styles.iconArrowRight}></span>;
const IconStart = () => <span className={styles.iconStart}></span>;
const IconPause = () => <span className={styles.iconPause}></span>;
const IconReset = () => <span className={styles.iconReset}></span>;

// --- Helper: Timer Component (no changes) ---
interface TimerProps {
  durationSeconds: number;
  onTimerEnd: () => void;
  autoStart?: boolean;
}

const Timer: React.FC<TimerProps> = ({ durationSeconds, onTimerEnd, autoStart = false }) => {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [isActive, setIsActive] = useState(autoStart);

  useEffect(() => {
    setTimeLeft(durationSeconds);
    setIsActive(autoStart);
  }, [durationSeconds, autoStart]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      if (isActive && timeLeft <= 0) {
        onTimerEnd();
      }
      return;
    }
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isActive, timeLeft, onTimerEnd]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);
  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(durationSeconds);
  };

  return (
    <div className={styles.timerContainer}>
      <div className={styles.timerDisplay}>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
      <div className={styles.timerControls}>
        {!isActive && timeLeft > 0 && (
          <button onClick={handleStart} className={styles.controlButton}><IconStart />Start</button>
        )}
        {isActive && (
          <button onClick={handlePause} className={styles.controlButton}><IconPause />Pause</button>
        )}
        <button onClick={handleReset} className={`${styles.controlButton} ${styles.resetButton}`}><IconReset />Reset</button>
      </div>
      {timeLeft <= 0 && <p className={styles.timerMessage}>Time's up!</p>}
    </div>
  );
};

// --- Main Instruction Data ---
interface Step {
  title: string;
  details: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;  // For aspect ratio with layout="responsive"
  imageHeight?: number; // For aspect ratio with layout="responsive"
  timerDurationSeconds?: number;
  autoStart?: boolean;
  tip?: string;
  caution?: string;
}

const commonSteps = {
  intro: {
    title: "Gear Up!",
    details: (
      <>
        <p>Let's brew an exceptional cup. You'll need:</p>
        <ul>
          <li>Fresh Coffee Beans</li>
          <li>Coffee Grinder (burr grinder recommended)</li>
          <li>Brewing Device (ex: Pour Over, French Press)</li>
          <li>Kettle (gooseneck for Pour Over)</li>
          <li>Filtered Water</li>
          <li>Your Favorite Mug</li>
        </ul>
      </>
    ),
    tip: "Quality beans and filtered water are game-changers for taste.",
  },
  grind: {
    title: "Grind Your Beans",
    details: <p>Freshly ground beans unlock the best aroma and flavor. Grind size is key and varies by brew method.</p>,
  },
  heatWater: {
    title: "Heat Water",
    details: <p>Heat your filtered water. Ideal temperature varies by roast, but avoid scorching the grounds with boiling water.</p>,
    caution: "Careful with hot water and steam!",
  },
  enjoy: {
    title: "Savor the Moment",
    details: "Well done! Your handcrafted coffee is ready. Take a deep breath, sip, and enjoy the richness.",
    tip: "Notice the different flavor notes. Does it change as it cools?",
  }
};

const lightRoastPouroverSteps: Step[] = [
  commonSteps.intro,
  {
    ...commonSteps.grind,
    details: (
      <>
        {commonSteps.grind.details}
        <p>For <strong>Light Roast (Pour Over)</strong>, aim for a <strong>medium-fine grind</strong> - think coarse sand.</p>
        <p>Ratio: ~1:16 coffee to water (ex: 20g coffee for 320ml water).</p>
      </>
    ),
    imageSrc: "/lightroastsand.jpeg",
    imageAlt: "Medium-fine coffee grounds, similar to coarse sand, for light roast pour over.",
    imageWidth: 500,  // Adjust to your image's actual aspect ratio
    imageHeight: 500, // Adjust to your image's actual aspect ratio
    tip: "Too sour? Grind finer. Too bitter? Grind coarser."
  },
  commonSteps.heatWater,
  {
    title: "Prepare Filter & Grounds",
    details: (
      <>
        <p>Place filter in pour-over cone. Rinse with hot water to remove paper taste and preheat. Discard rinse water.</p>
        <p>Add grounds, gently level the bed.</p>
      </>
    ),
    tip: "Preheating ensures consistent brew temperature."
  },
  {
    title: "The Bloom",
    details: <p>Start timer! Pour ~2x water amount of coffee (ex: 40g water for 20g coffee) to saturate grounds. Wait 30-45s for CO2 release (the 'bloom').</p>,
    imageSrc: "/coffeebloom.jpg",
    imageAlt: "Overhead view of coffee blooming in a V60 pour over, with CO2 bubbles visible.",
    imageWidth: 600,  // Adjust to your image's actual aspect ratio
    imageHeight: 450, // Adjust to your image's actual aspect ratio (e.g., 4:3)
    timerDurationSeconds: 45,
    autoStart: true,
  },
  {
    title: "Main Pour",
    details: <p>After bloom, pour remaining water slowly in controlled circles. Aim for total brew time of 2:30-3:30 minutes (including bloom).</p>,
    timerDurationSeconds: 150,
    tip: "A gooseneck kettle offers precision. Avoid pouring on the filter sides."
  },
  {
    title: "Drawdown & Serve",
    details: "Once water passes through, your pour over is ready. Remove cone promptly.",
  },
  commonSteps.enjoy,
];

const darkRoastFrenchPressSteps: Step[] = [
  commonSteps.intro,
  {
    ...commonSteps.grind,
    details: (
      <>
        {commonSteps.grind.details}
        <p>For <strong>Dark Roast (French Press)</strong>, use a <strong>coarse grind</strong> - like breadcrumbs.</p>
        <p>Ratio: ~1:12 to 1:15 (ex: 30g coffee for 360-450ml water).</p>
      </>
    ),
    imageSrc: "/darkroastsand.webp",
    imageAlt: "Coarsely ground dark roast coffee, resembling breadcrumbs, for French press.",
    imageWidth: 500,  // Adjust to your image's actual aspect ratio
    imageHeight: 500, // Adjust to your image's actual aspect ratio
  },
  commonSteps.heatWater,
  {
    title: "Combine & Saturate",
    details: <p>Add grounds to French press. Pour hot water, ensuring all grounds are wet. Give a gentle stir if needed.</p>,
    tip: "Preheat press with hot water (discard before adding coffee) for stable temp."
  },
  {
    title: "Steep",
    details: <p>Place lid on, plunger up. Steep for <strong>4 minutes</strong>.</p>,
    timerDurationSeconds: 240,
    autoStart: true,
  },
  {
    title: "Press & Serve",
    details: <p>Slowly, steadily press plunger down (15-20s). Serve immediately to prevent bitterness from over-extraction. Decant if not drinking all at once.</p>,
    imageSrc: "/frenchpress.webp",
    imageAlt: "Side view of a French press plunger being pressed down slowly.",
    imageWidth: 400,  // Adjust to your image's actual aspect ratio
    imageHeight: 500, // Adjust to your image's actual aspect ratio
    tip: "Pressing too fast stirs up sediment, making a muddy cup."
  },
  commonSteps.enjoy,
];

// --- Main Page Component ---
export default function CoffeePage() {
  const [coffeeChoice, setCoffeeChoice] = useState<'light' | 'dark' | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timerKey, setTimerKey] = useState(Date.now());

  const steps = coffeeChoice === 'light' ? lightRoastPouroverSteps : darkRoastFrenchPressSteps;
  const currentStepData = coffeeChoice ? steps[currentStepIndex] : null;

  const handleCoffeeSelect = (type: 'light' | 'dark') => {
    setCoffeeChoice(type);
    setCurrentStepIndex(0);
    setTimerKey(Date.now());
  };

  const handleNextStep = () => {
    if (coffeeChoice && currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setTimerKey(Date.now());
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setTimerKey(Date.now());
    }
  };

  const handleResetApp = () => {
    setCoffeeChoice(null);
    setCurrentStepIndex(0);
    setTimerKey(Date.now());
  };

  const onStepTimerEnd = useCallback(() => {
    // console.log("Timer for step ended!");
  }, []);


  if (!coffeeChoice || !currentStepData) {
    return (
      <div className={styles.coffeeGuideContainer}>
        <h1 className={styles.mainHeader}>Your Morning Ritual</h1>
        <p className={styles.subHeader}>Select your preferred coffee roast to begin a guided brewing experience.</p>
        <div className={styles.choiceContainer}>
          <button onClick={() => handleCoffeeSelect('light')} className={styles.choiceButton}>
            <IconLightRoast />
            Light Roast Path
            <div className={styles.figurePlaceholder} style={{ width:'80%', height: '100px', position: 'relative', margin: '10px auto 0' }}>
              <Image
                src="/lightroast.jpg"
                alt="Artistic shot of light roast coffee beans"
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
          </button>
          <button onClick={() => handleCoffeeSelect('dark')} className={styles.choiceButton}>
            <IconDarkRoast />
            Dark Roast Path
             <div className={styles.figurePlaceholder} style={{ width:'80%', height: '100px', position: 'relative', margin: '10px auto 0' }}>
              <Image
                src="/darkroast.avif"
                alt="Artistic shot of dark roast coffee beans"
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
          </button>
        </div>
      </div>
    );
  }

  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className={styles.coffeeGuideContainer}>
      <h1 className={styles.mainHeader}>{coffeeChoice === 'light' ? 'Light Roast: Pour Over' : 'Dark Roast: French Press'}</h1>
      <h2 className={styles.stepHeader}>Step {currentStepIndex + 1} of {steps.length}: {currentStepData.title}</h2>

      <div className={styles.stepContent}>
        {typeof currentStepData.details === 'string' ? <p>{currentStepData.details}</p> : currentStepData.details}

        {currentStepData.imageSrc && currentStepData.imageAlt && currentStepData.imageWidth && currentStepData.imageHeight && (
          <div className={styles.figurePlaceholder}> {/* Parent div for border and padding */}
            <Image
              src={currentStepData.imageSrc}
              alt={currentStepData.imageAlt}
              width={currentStepData.imageWidth}   // Use actual aspect ratio of your image
              height={currentStepData.imageHeight} // Use actual aspect ratio of your image
              layout="responsive"                 // Image scales within the parent
              objectFit="contain"                 // Prevents stretching/cropping if image has whitespace
              quality={75}
            />
            <p style={{ textAlign:'center', fontSize: '0.8em', color: '#777', marginTop: '10px' }}>
              <i>{currentStepData.imageAlt}</i>
            </p>
          </div>
        )}

        {currentStepData.timerDurationSeconds && (
          <Timer
            key={timerKey}
            durationSeconds={currentStepData.timerDurationSeconds}
            onTimerEnd={onStepTimerEnd}
            autoStart={currentStepData.autoStart}
          />
        )}

        {currentStepData.tip && <div className={styles.tipBox}><strong>Tip:</strong> {currentStepData.tip}</div>}
        {currentStepData.caution && <div className={styles.cautionBox}><strong>Caution:</strong> {currentStepData.caution}</div>}
      </div>

      <div className={styles.navigationControls}>
        <button
          onClick={handlePrevStep}
          disabled={currentStepIndex === 0}
          className={styles.navButton}
        >
          <IconArrowLeft /> Previous
        </button>
        {!isLastStep && (
          <button
            onClick={handleNextStep}
            className={styles.navButton}
          >
            Next <IconArrowRight />
          </button>
        )}
      </div>
      {isLastStep && (
        <div className={styles.resetButtonContainer}>
          <button onClick={handleResetApp} className={`${styles.navButton} ${styles.resetButton}`}>
            Brew Another?
          </button>
        </div>
      )}
    </div>
  );
}