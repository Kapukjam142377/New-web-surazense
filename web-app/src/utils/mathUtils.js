import { PolynomialRegression } from "ml-regression-polynomial";
import savitzkyGolay from "ml-savitzky-golay";

/**
 * Fit a polynomial to the baseline and correct the signal
 */
export function baselineCorrection(readFREQ, dataMag, order = 8) {
  const regression = new PolynomialRegression(readFREQ, dataMag, order);
  const coeffs = regression.coefficients;

  const polyfittedAll = readFREQ.map((x) => regression.predict(x));
  const magBaselineCorrected = dataMag.map((val, i) => val - polyfittedAll[i]);

  return {
    magBaselineCorrected,
    polyfittedAll,
    coeffs,
  };
}

export function evalPolynomial(coeffs, readFREQ) {
  // ml-regression-polynomial outputs coefficients from lowest order to highest: c0 + c1*x + c2*x^2 + ...
  const polyfitted = readFREQ.map((x) => {
    let y = 0;
    for (let i = 0; i < coeffs.length; i++) {
      y += coeffs[i] * Math.pow(x, i);
    }
    return y;
  });
  return polyfitted;
}

/**
 * Filter using SG Filter.
 */
export function sgFilter(y, windowSize, order) {
  const options = {
    windowSize: windowSize,
    derivative: 0,
    polynomial: order,
  };
  return savitzkyGolay(y, 1, options); // deltaTime = 1
}

/**
 * Find Peaks.
 * Matches: argrelextrema(mag, np.greater, order=dist)
 */
export function findPeak(freq, mag, dist) {
  let maxIndexes = [];
  let maxFreqs = [];
  let maxValues = [];

  for (let i = dist; i < mag.length - dist; i++) {
    let isPeak = true;
    const currentVal = mag[i];
    // Check neighbors
    for (
      let j = Math.max(0, i - dist);
      j <= Math.min(mag.length - 1, i + dist);
      j++
    ) {
      if (i !== j && mag[j] >= currentVal) {
        isPeak = false;
        break;
      }
    }
    if (isPeak) {
      maxIndexes.push(i);
      maxFreqs.push(freq[i]);
      maxValues.push(currentVal);
    }
  }

  if (maxIndexes.length === 0) {
    let globalMaxIdx = npArgmax(mag);
    return {
      maxIndexes: [globalMaxIdx],
      maxFreqs: [freq[globalMaxIdx]],
      maxValues: [mag[globalMaxIdx]],
    };
  }

  return { maxIndexes, maxFreqs, maxValues };
}

export function npArgmax(arr) {
  if (arr.length === 0) return -1;
  let MathMax = -Infinity;
  let maxIndex = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > MathMax) {
      maxIndex = i;
      MathMax = arr[i];
    }
  }
  return maxIndex;
}

export function npAverage(arr) {
  if (arr.length === 0) return 0;
  let sum = arr.reduce((a, b) => a + b, 0);
  return sum / arr.length;
}
