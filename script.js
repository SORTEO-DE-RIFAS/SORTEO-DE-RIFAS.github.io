let participants = [];
let spinning = false;
let Numbers = [];
let excludedNumbers = Numbers; 


document.getElementById('numAnulled').addEventListener('change', function () {
    if (this.checked) {
        document.getElementById('numWinners').checked = false;
    }
});

document.getElementById('numWinners').addEventListener('change', function () {
    if (this.checked) {
        document.getElementById('numAnulled').checked = false;
    }
});

document.addEventListener('DOMContentLoaded', function () {
    var contenedor = document.querySelector('.contenedor');

    contenedor.addEventListener('scroll', function () {
        var leftOffset = contenedor.scrollLeft;
        document.querySelectorAll('#miTabla th')[0].style.left = leftOffset + 'px';
        document.querySelectorAll('#miTabla td')[0].style.left = leftOffset + 'px';
    });
});


function handleFile() {

    const resultsBody = document.getElementById("resultsBody");
    resultsBody.innerHTML = "";
    const fileInput = document.getElementById('excelInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Assuming only one sheet in the Excel file
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            participants = XLSX.utils.sheet_to_json(sheet);
            console.log(participants);
        };

        reader.readAsArrayBuffer(file);
    }
}

function generateRandomNumbers(min, max, count, excludedNumbers = []) {
    const allNumbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);

    const availableNumbers = allNumbers.filter(num => !excludedNumbers.includes(num));

    if (availableNumbers.length < count) {
        // Todos los números han sido seleccionados, puedes manejar esto de la manera que prefieras.
        alert("¡No hay más números disponibles para girar!");
        return [];
    }

        const numbers = [];
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            const randomNum = availableNumbers.splice(randomIndex, 1)[0];
            numbers.push(randomNum);
            excludedNumbers.push(randomNum);
        }
        return numbers;
}


function displayNumbers() {
    
    const resultsBody = document.getElementById("resultsBody");
    /*resultsBody.innerHTML = "";*/

    Numbers.forEach((num) => {
        const participantIndex = num - 1; // Adjust index since participant numbers start from 1
        const participant = participants[participantIndex];

        if (participant) {
            mostrarNumeroEnTarjetas(participant.boleto);
            const status = document.getElementById('numAnulled').checked ? 'Anulado' : `Ganador - ${txtPremio.value}`;
            resultsBody.innerHTML += `<tr><td>${participant.boleto}</td><td>${participant.celular}</td><td>${participant.nombre}</td><td>${status}</td></tr>`;
        }
    });
}

function spinWheel() {
    const max = participants.length;

    Numbers = generateRandomNumbers(1, max, 1, excludedNumbers);
    
    if (!spinning) { 
      spinning = true;
      const cards = document.querySelectorAll('.card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          spinCard(cards[0]);
          spinCard(cards[1]);
          spinCard(cards[2]);
        }, index * 100);
      });
      
      setTimeout(() => {
        spinning = false;
        displayNumbers();
      }, (cards.length - 1)*575); // Se agrega un segundo extra al final
      mostrarNumeroEnTarjetas(participant.boleto);
    }
    
}

function spinCard(card) {
    const maxNumber = 9; // Maximum number on the wheel
    let currentNumber = parseInt(card.innerText, 10);

    const spinInterval = setInterval(() => {
        currentNumber = (currentNumber + 1) % (maxNumber + 1);
        card.innerText = currentNumber;

        if (currentNumber === 0) {
            clearInterval(spinInterval);
        }
    }, 100);
}

function mostrarNumeroEnTarjetas(numero) {
    const card1 = document.getElementById('card1');
    const card2 = document.getElementById('card2');
    const card3 = document.getElementById('card3');

    const digitos = Array.from(String(numero).padStart(3, '0'), Number);

    card1.innerText = digitos[0];
    card2.innerText = digitos[1];
    card3.innerText = digitos[2];
}

function showAlert(message) {
    alert(message);
}

