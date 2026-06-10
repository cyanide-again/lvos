const fileInput = document.getElementById("fileInput");
const inputImg = document.getElementById("inputImg");
const submitButton = document.getElementById("submitBtn");
const hueMultiplierInput = document.getElementById("hueMultiplier");
const saturationMultiplierInput = document.getElementById("saturationMultiplier");
const valueMultiplierInput = document.getElementById("valueMultiplier");
const outputImg = document.getElementById("outputImg");
const controls = document.querySelector(".settings");
const imgOptions = document.querySelector(".imageOptions");
const downloadButon = document.getElementById("downloadBtn");
let image = new Image();
let fileName;

const hsvToRgb = (h, s, v) => {
    s /= 100;
    v /= 100;
    const k = (n) => (n + h / 60) % 6;
    const f = (n) => v * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    return [255 * f(5), 255 * f(3), 255 * f(1)];
};

function rgbToHsv (r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        } else if (h > 1) {
            h -= 1;
        }
    }
    return [
        Math.round(h * 360),
        percentRoundFn(s * 100),
        percentRoundFn(v * 100)
    ];
}

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) { return; }
    image.src = URL.createObjectURL(file);
    inputImg.src = image.src;
    outputImg.src = image.src;
    controls.style.display = "inline";
    imgOptions.style.display = "block";
    inputImg.style.display = "block";
    outputImg.style.display = "block";
    outputImg.style.width = (controls.getBoundingClientRect().width / 2) - 40 + "px";
    inputImg.style.width = (controls.getBoundingClientRect().width / 2) - 40 + "px";
    fileName = file.name.substring(0, file.name.lastIndexOf("."));
});

function getArrayFromImage() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function gay() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    const imgData = getArrayFromImage();
    const data = imgData.data;
    let pixelData;
    hueMultiplier = hueMultiplierInput.value / 50;
    saturationMultiplier = saturationMultiplierInput.value / 50;
    valueMultiplier = valueMultiplierInput.value / 50;
    let index;
    let hsv;
    for (let y = 0; y < image.height; y ++) {
        for (let x = 0; x < image.width; x ++) {
            index = (y * image.width + x) * 4;
            hsv = rgbToHsv(...data.slice(index, index+3));
            pixelData = [
                ...hsvToRgb(
                    (hsv[0] + (y * hueMultiplier)) % 360,
                    Math.min(100, Math.max(0, (hsv[1] * (saturationMultiplier)))),
                    Math.min(100, Math.max(0, (hsv[2] * (valueMultiplier))))
                ), data[index + 3]
            ];
            for (let c = 0; c < 4; c ++) {
                data[index + c] = pixelData[c];
            }
        }
    }
    ctx.putImageData(imgData, 0, 0);
    const imgUrl = canvas.toDataURL("image/png")
    outputImg.src = imgUrl;
    downloadButon.href = imgUrl;
    downloadButon.download = fileName + "_gay.png";
}

submitButton.addEventListener("click", gay);

Array.from(document.getElementsByTagName("input")).forEach(function (input) {
    input.addEventListener("change", gay);
});