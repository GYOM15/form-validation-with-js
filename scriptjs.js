function validateInteger(value, min = null, max = null) {
    if (value.trim() === "") {
        return "Ce champ ne peut pas être vide.";
    }

    if (!/^\d+$/.test(value)) {
        return "Veuillez entrer un nombre entier valide, sans caractères spéciaux.";
    }

    const number = parseInt(value, 10);
    if (isNaN(number)) {
        return "Veuillez entrer un nombre valide.";
    }

    if (min !== null && number < min) {
        return `La valeur doit être supérieure ou égale à ${min}.`;
    }

    if (max !== null && number > max) {
        return `La valeur doit être inférieure ou égale à ${max}.`;
    }

    return "";
}


function validateFloat(value, min = null, max = null) {
    if (value.trim() === "") {
        return "Ce champ ne peut pas être vide.";
    }

    if (!/^-?\d+(,\d+)?$/.test(value)) {
        return "Veuillez entrer un nombre valide (exemple : 123,45 ou 123).";
    }

    const normalizedValue = value.replace(",", ".");
    const number = parseFloat(normalizedValue);

    if (isNaN(number)) {
        return "Veuillez entrer un nombre valide.";
    }

    if (min !== null && number < min) {
        return `La valeur doit être supérieure ou égale à ${min}.`;
    }

    if (max !== null && number > max) {
        return `La valeur doit être inférieure ou égale à ${max}.`;
    }

    return "";
}


function validateCarYear() {
    const carYearInput = document.getElementById("carYear").value.trim();
    const error = document.getElementById("carYearError");
    const currentYear = new Date().getFullYear();

    const errorMessage = validateInteger(carYearInput, 1900, currentYear);

    if (errorMessage) {
        error.innerHTML = errorMessage;
    } else {
        error.innerHTML = "";
    }
}


function validateCarValue() {
    const carValueInput = document.getElementById("carValue").value.trim();
    const error = document.getElementById("carValueError");

    const errorMessage = validateFloat(carValueInput, 0, null);

    if (errorMessage) {
        error.innerHTML = errorMessage;
    } else {
        error.innerHTML = "";
    }
}


function validateAnnualMileage() {
    const annualMileageInput = document.getElementById("annualMileage").value.trim();
    const error = document.getElementById("annualMileageError");

    
    const errorMessage = validateFloat(annualMileageInput, 0, 500000);
    if (errorMessage) {
        error.innerHTML = errorMessage;
    } else {
        error.innerHTML = ""; 
    }
}

function displayFields() {
    const claimMade = document.getElementById("claimMade").value;
    const details = document.getElementById("claimDetails");
    const claimNumberField = document.getElementById("claimNumber");

    if (claimMade === "oui") {
        details.classList.remove("hidden");
        claimNumberField.setAttribute("required", "required");
    } else {
        details.classList.add("hidden");
        claimNumberField.value = ""; 
        document.getElementById("claimNumberError").innerHTML = ""; 
        document.getElementById("claimAmounts").innerHTML = ""; 
        claimNumberField.removeAttribute("required");
    }
}


function validateClaimAmount(claimInputId, errorId) {
    const claimAmountInput = document.getElementById(claimInputId).value.trim();
    const error = document.getElementById(errorId);

    const errorMessage = validateFloat(claimAmountInput, 0, 10000); 

    if (errorMessage) {
        error.innerHTML = errorMessage; 
    } else {
        error.innerHTML = "";
        console.log(`Montant valide pour ${claimInputId} :`, claimAmountInput);
    }
}

function validateClaimNumber() {
    const claimMade = document.getElementById("claimMade").value;
    const claimNumberInput = document.getElementById("claimNumber").value.trim();
    const error = document.getElementById("claimNumberError");
    const claimAmounts = document.getElementById("claimAmounts");

    claimAmounts.innerHTML = ""; // Réinitialiser les champs dynamiques

    // Ignorer la validation si "Non" est sélectionné
    if (claimMade === "non") {
        error.innerHTML = ""; // Pas d'erreur
        return;
    }

    const errorMessage = validateInteger(claimNumberInput, 1, 4);

    if (errorMessage) {
        error.innerHTML = errorMessage; // Afficher l'erreur
    } else {
        error.innerHTML = ""; // Pas d'erreur

        const numberOfClaims = parseInt(claimNumberInput, 10);
        for (let i = 0; i < numberOfClaims; i++) {
            const label = document.createElement("label");
            label.innerHTML = `Montant de la réclamation ${i + 1}`;
            
            const input = document.createElement("input");
            input.type = "text";
            input.classList.add("claim-amount");
            input.id = `claimAmount${i}`;
            input.placeholder = `Montant ${i + 1}`;

            // Ajouter une validation pour chaque montant
            input.addEventListener("input", function () {
                validateClaimAmount(input.id, `claimAmount${i}Error`);
            });

            const errorDiv = document.createElement("div");
            errorDiv.id = `claimAmount${i}Error`;
            errorDiv.classList.add("error");

            claimAmounts.appendChild(label);
            claimAmounts.appendChild(input);
            claimAmounts.appendChild(errorDiv);
        }
    }
}

// Calcul de l'assurance
function calculateInsurance() {
    validateCarYear();
    validateCarValue();
    validateAnnualMileage();

    const claimMade = document.getElementById("claimMade").value;
    if (claimMade === "oui") {
        validateClaimNumber();
    }

    const gender = document.getElementById("gender").value;
    const birthDate = new Date(document.getElementById("birthDate").value);
    const carValue = parseFloat(document.getElementById("carValue").value.replace(",", "."));
    const carYear = parseInt(document.getElementById("carYear").value, 10);
    const annualMileage = parseInt(document.getElementById("annualMileage").value, 10);
    const claimNumber = claimMade === "oui" ? parseInt(document.getElementById("claimNumber").value, 10) || 0 : 0;

    const currentYear = new Date().getFullYear();
    const age = currentYear - birthDate.getFullYear();

    let reasons = [];
    if (gender === "femme" && age < 16) {
        reasons.push("Les femmes doivent avoir au moins 16 ans.");
    } else if (gender === "non-binaire" && age < 18) {
        reasons.push("Les personnes non-binaires doivent avoir au moins 18 ans.");
    } else if (gender === "homme" && age < 18) {
        reasons.push("Les hommes doivent avoir au moins 18 ans pour être assurés.");
    }

    if (age > 100) {
        reasons.push("Âge supérieur à 100 ans.");
    }

    if (carValue > 100000) {
        reasons.push("Valeur du véhicule supérieure à 100 000 $.");
    }

    if (carYear < currentYear - 25) {
        reasons.push("Année de fabrication du véhicule trop ancienne (plus de 25 ans).");
    }

    if (annualMileage > 50000) {
        reasons.push("Kilométrage annuel supérieur à 50 000 km.");
    }

    if (claimMade === "oui" && claimNumber > 4) {
        reasons.push("Plus de 4 réclamations effectuées.");
    }

    if (reasons.length > 0) {
        const reasonDiv = document.getElementById("reason");
        const resultDiv = document.getElementById("result");

        reasonDiv.classList.remove("hidden");
        resultDiv.classList.add("hidden");

        const reasonMessage = document.getElementById("reasonMessage");
        reasonMessage.innerHTML = reasons.join("<br>");
        return false;
    }

    let baseRate = 0;
    if ((gender === "homme" || gender === "non-binaire") && age < 25) {
        baseRate = carValue * 0.05;
    } else if (age >= 75) {
        baseRate = carValue * 0.04;
    } else {
        baseRate = carValue * 0.015;
    }

    let totalClaimsAmount = 0;
    if (claimMade === "oui") {
        for (let i = 0; i < claimNumber; i++) {
            const claimAmount = parseFloat(document.getElementById(`claimAmount${i}`).value.replace(",", "."));
            totalClaimsAmount += claimAmount || 0;
        }
    }

    const penalty = totalClaimsAmount > 25000 ? 700 : 0;
    const insuranceTotal = baseRate + (350 * claimNumber) + (0.02 * annualMileage) + penalty;

    const resultDiv = document.getElementById("result");
    const reasonDiv = document.getElementById("reason");

    reasonDiv.classList.add("hidden");
    resultDiv.classList.remove("hidden");
    document.getElementById("insuranceAmount").innerText = `${insuranceTotal.toFixed(2)} $`;

    return false;
}

// Ajouter des écouteurs
document.getElementById("carYear").addEventListener("input", validateCarYear);
document.getElementById("carValue").addEventListener("input", validateCarValue);
document.getElementById("annualMileage").addEventListener("input", validateAnnualMileage);
document.getElementById("claimMade").addEventListener("change", displayFields);
document.getElementById("claimNumber").addEventListener("input", validateClaimNumber);

