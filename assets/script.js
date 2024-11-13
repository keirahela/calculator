document.getElementById('button').onclick = () => {
    document.getElementById('calculator').style.display = document.getElementById('calculator').style.display == "none" ? "block" : "none"
}

let currentEquation = "";
let smallDisplay = "";

function calculateSmallDisplay() {
    smallDisplay += currentEquation
    document.getElementById('equation').innerText += currentEquation
    console.log("made small display ", smallDisplay)
}

function calculateResult(child) {
    if(child.innerText == "=") {
        if(currentEquation == "" && smallDisplay == "") return;
        currentEquation = ""
        // TODO: fix calculating result with small display / big display
        console.log(smallDisplay + currentEquation)
        console.log(eval(smallDisplay + currentEquation))
        currentEquation = eval(smallDisplay + currentEquation).toString()
        smallDisplay = ""
    } else if(child.innerText == "÷") {
        currentEquation += "/"
        calculateSmallDisplay()
    } else if(child.innerText == "×") {
        currentEquation += "*"
        calculateSmallDisplay()
    } else if(child.innerText == "C" || child.innerText == "CE") {
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
        }
    })
}

setupButtons()

document.addEventListener('keydown', (event) => {
    key = event.key;
    if(key == " "){
        document.getElementById('calculator').style.display = document.getElementById('calculator').style.display == "none" ? "block" : "none"
        return;
    }
    else if(key == "/") {
        key = "÷"
    } else if(key == "*") {
        key = "×"
    } else if(key == "-") {
        key = "−"
    } else if(key == "Enter") {
        if(currentEquation == "") return;
        console.log(eval(currentEquation))
        currentEquation = eval(currentEquation).toString()

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
    }
})