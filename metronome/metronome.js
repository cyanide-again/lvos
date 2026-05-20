const audioCtx = new AudioContext();
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const pausePlay = document.getElementById("pauseButton");
const beatDisplay = document.getElementById("beatNum");
const bpmInput = document.getElementById("bpmInput");
const numeratorInput = document.getElementById("numeratorInput");
const denominatorInput = document.getElementById("denominatorInput");
let playCount = 0;
let beat = 0;
let beatTime = 0;
let sleepTime;
let numerator = 7;
let denominator = 8;
let bpm = 120;
let startTime;
let timeSinceStart;
let targetTime;

function beep(freq) {
    const osc = audioCtx.createOscillator();
    osc.connect(audioCtx.destination);
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.start();
    osc.stop(audioCtx.currentTime + Math.min(0.1, sleepTime/1000));
}

pausePlay.addEventListener("click", async () => {
    playCount++;
    if (playCount % 2 == 1) {
        pausePlay.innerText = "Pause";
        const prevPlayCount = playCount;
        startTime = Date.now();
        targetTime = 0;

        while (prevPlayCount == playCount) {
            console.log(timeSinceStart);
            timeSinceStart = Date.now() - startTime;
            if (timeSinceStart > targetTime) {
                beatTime = Math.min(1, numerator - beat);
                beatDisplay.innerText = beat + 1;
                // (60/bpm) is the length of each beat in seconds. (4/denominator) calculates each beat's value.
                // Multiply that by 1000 to convert seconds to ms, and beatTime is for decimal time signatures
                sleepTime = ((60/bpm) * (4/denominator)) * 1000 * beatTime;
                beep(beat == 0 ? 880 : 440);
                beat = (numerator - beat <= 1 ? 0 : beat + 1);
                targetTime += sleepTime;
            }
            await sleep(10);
        }
    } else {
        pausePlay.innerText = "Play";
        beatDisplay.innerText = "";
        beat = 0;
    }
});

bpmInput.addEventListener("input", () => {
    if (bpmInput.value <= 0) return;
    bpm = bpmInput.value;
});

numeratorInput.addEventListener("input", () => {
    if (numeratorInput.value <= 0) return;
    numerator = numeratorInput.value;
});

denominatorInput.addEventListener("input", () => {
    if (denominatorInput.value <= 0) return;
    denominator = denominatorInput.value;
});