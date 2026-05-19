const audioCtx = new AudioContext();
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const pausePlay = document.getElementById("pauseButton");
const beatDisplay = document.getElementById("beatNum");
const bpmInput = document.getElementById("bpmInput");
const numeratorInput = document.getElementById("numeratorInput");
const denominatorInput = document.getElementById("denominatorInput");
let playCount = 0;
let playing = false;
let beat = 0;
let beatTime = 0;
let sleepTime;
let numerator = 7;
let denominator = 8;
let sleeping;
let bpm = 120;
function beep(freq) {
    const osc = audioCtx.createOscillator();
    osc.connect(audioCtx.destination);
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.start();
    osc.stop(audioCtx.currentTime + Math.min(0.1, (sleepTime/1000)));
}
pausePlay.addEventListener("click", async () => {
    playCount += 1;
    if (!playing) {
        pausePlay.innerText = "Pause";
        const prevPlayCount = playCount;
        playing = true;
        while (prevPlayCount == playCount) {
            beatTime = Math.min(1, numerator - beat);
            if (beat > numerator) {
                beat = 0;
            }
            beatDisplay.innerText = beat + 1;
            sleepTime = ((60/bpm) * (4/denominator)) * 1000 * beatTime;
            beep(beat == 0 ? 880 : 440);
            beat = (numerator - beat < 1 ? 0 : beat + 1);
            if (sleepTime > 0) await sleep(sleepTime);
        }
    }
    else {
        pausePlay.innerText = "Play";
        beatDisplay.innerText = "";
        beat = 0;
        playing = false;
    }
});
bpmInput.addEventListener("input", () => {
    bpm = bpmInput.value;
    if (bpm === "") {
        bpm = 1;
    }
});
numeratorInput.addEventListener("input", () => {
    numerator = numeratorInput.value;
    if (numerator === "") {
        numerator = 1;
    }
});
denominatorInput.addEventListener("input", () => {
    denominator = denominatorInput.value;
    if (denominator === "") {
        denominator = 1;
    }
});