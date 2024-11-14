document.getElementById('button').onclick = () => {
    document.getElementById('calculator').style.display = document.getElementById('calculator').style.display == "none" ? "block" : "none"
}

let currentEquation = "";
let smallDisplay = "";

function calculateSmallDisplay() {
    smallDisplay += currentEquation
    document.getElementById('equation').innerText += currentEquation
    console.log("made small display ", smallDisplay)
    currentEquation = ""
    document.getElementById("screen").innerText = currentEquation == "" ? "0" : currentEquation
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

function lightenColor(rgbStr, factor) {
    const rgb = rgbStr.match(/\d+/g).map(Number);
    const lightened = rgb.map(channel => Math.min(Math.round(channel + (255 - channel) * factor), 255));
    return `rgb(${lightened.join(',')})`;
}

function darkenColor(originalColor, lightenedColor, factor) {
    const originalRgb = originalColor.match(/\d+/g).map(Number);
    const lightenedRgb = lightenedColor.match(/\d+/g).map(Number);
    const darkened = originalRgb.map((channel, index) => 
        Math.round(lightenedRgb[index] + (channel - lightenedRgb[index]) * factor)
    );
    return `rgb(${darkened.join(',')})`;
}
function calculateResult(child) {
    if(child.innerText == "=") {
        if(currentEquation == "" && smallDisplay == "") return;
        // TODO: fix calculating result with small display / big display
        console.log(smallDisplay + currentEquation)
        console.log(eval(smallDisplay + currentEquation))
        currentEquation = eval(smallDisplay + currentEquation).toString()
        smallDisplay = ""
        document.getElementById('equation').innerText = smallDisplay
    } else if(child.innerText == "÷") {
        currentEquation += "/"
        calculateSmallDisplay()
    } else if(child.innerText == "×") {
        currentEquation += "*"
        calculateSmallDisplay()
    } else if(child.innerText == "C") {
        currentEquation = ""
        smallDisplay = ""
        document.getElementById('equation').innerText = ""
    } else if(child.innerText == "CE") {
        currentEquation = ""
    } else if(child.innerText == "−") {
        currentEquation += "-"
        calculateSmallDisplay()
    } else if(child.innerText == "+") {
        currentEquation += child.innerText
        calculateSmallDisplay()
    } else if(child.innerText == "±") {
        currentEquation = currentEquation.substring(0, 1) == "-" ? currentEquation.slice(1) : "-" + currentEquation
    } else if(child.innerText == "X2") {
        if(Number.isNaN(Math.pow(eval(currentEquation), 2))) return;
        currentEquation = Math.pow(eval(currentEquation), 2)
    } else {
        currentEquation += child.innerText
    }

    console.log("made big display ", currentEquation)

    document.getElementById("screen").innerText = currentEquation == "" ? "0" : currentEquation
}

function setupButtons(children) {
    if(!children) {
        children = Array.from(document.getElementById('container').children);
    }
    children.forEach((child) => {
        if(child.className.includes("grid-row-wrapper")) {
            setupButtons(Array.from(child.children))
            return;
        }
        if(/^[b]+\d*$/.test(child.className)) {
            child.onclick = () => {
                calculateResult(child);
            }

            let originalColor;

            child.onmouseenter = () => {
                originalColor = window.getComputedStyle(child).backgroundColor;
                const lightenedColor = lightenColor(originalColor, 0.2);
                child.style.backgroundColor = lightenedColor;
            }

            child.onmouseleave = () => {
                const lightenedColor = lightenColor(originalColor, 0.2);
                child.style.backgroundColor = darkenColor(originalColor, lightenedColor, 1);
            }
        }
    })
}

setupButtons()

let isAnimating = false;

document.addEventListener('keydown', async (event) => {
    key = event.key;
    if(key == " "){
        document.getElementById('calculator').style.display = document.getElementById('calculator').style.display == "none" ? "block" : "none"
        return;
    }
    else if(key == "Backspace") {
        currentEquation = ""
        document.getElementById("screen").innerText = currentEquation == "" ? "0" : currentEquation
    } else if(key == "Delete") {
        currentEquation = ""
        smallDisplay = ""
        document.getElementById("screen").innerText = currentEquation == "" ? "0" : currentEquation
        document.getElementById('equation').innerText = ""
    } else if(key == "/") {
        key = "÷"
    } else if(key == "*") {
        key = "×"
    } else if(key == "-") {
        key = "−"
    } else if(key == "Enter") {
        if(currentEquation == "" && smallDisplay == "") return;
        console.log(smallDisplay + currentEquation)
        console.log(eval(smallDisplay + currentEquation))
        currentEquation = eval(smallDisplay + currentEquation).toString()

        document.getElementById("screen").innerText = currentEquation == "" ? "0" : currentEquation
    }

    var divTags = document.querySelectorAll('div:not(.topbar)')

    var found;

    for (var i = 0; i < divTags.length; i++) {
      if (divTags[i].textContent == key) {
        found = divTags[i];
        break;
      }
    }

    if(found != undefined) {
        calculateResult(found)
        const originalColor = window.getComputedStyle(found).backgroundColor;
        const lightenedColor = lightenColor(originalColor, 0.1);
        found.style.backgroundColor = lightenedColor;
        await sleep(200);
        found.style.backgroundColor = originalColor;
    }
})