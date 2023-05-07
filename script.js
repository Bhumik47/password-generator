const password_display = document.querySelector('.password-display');
const copybtn = document.querySelector('[data-copy]');
const password_length = document.querySelector('[data-password-length]');
const slider = document.querySelector('.slider');
const uppercase_check = document.querySelector('#uppercase');
const lowercase_check = document.querySelector('#lowercase');
const numbers_check = document.querySelector('#numbers');
const symbol_check = document.querySelector('#symbols');
const strength = document.querySelector('[data-strength]');
const generatebtn = document.querySelector('.generate-btn');
const allcheckbox = document.querySelectorAll('input[type=checkbox]');
const copyMsg = document.querySelector('[data-copymsg]');
const specialCharacters = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

let password = "";
let passwordLength = 10;
let checkcount = 1;
uppercase_check.checked = true;
setIndicator('#ccc');
handleSlider();


//set password length
function handleSlider() {
    slider.value = passwordLength;
    password_length.innerText = passwordLength;
}

function setIndicator(color) {
    strength.style.backgroundColor = color;
    strength.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(max, min) {
    return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomNumber() {
    return getRndInteger(9, 0);
}

function getLowerCase() {
    return String.fromCharCode(getRndInteger(123, 97));
}
function getUpperCase() {
    return String.fromCharCode(getRndInteger(91, 65));
}

function generatRandomSymbols() {
    const randnum = getRndInteger(specialCharacters.length, 0);
    return specialCharacters.charAt(randnum);
}

function calcStrength() {
    let hasNUm = false;
    let hasUpper = false;
    let hasLower = false;
    let hasSym = false;
    if (uppercase_check.checked) hasUpper = true;
    if (lowercase_check.checked) hasLower = true;
    if (numbers_check.checked) hasNUm = true;
    if (symbol_check.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNUm || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNUm || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

//shuffle password
function sufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        //swap i and j
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach(el => str += el);
    return str;

}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(password_display.value);
        copyMsg.innerText = "Copied";
    } catch (error) {
        copyMsg.innerText = "Failed";
    }

    // to make copy span visible
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function handlecheckBoxChange() {
    checkcount = 0;
    allcheckbox.forEach(checkbox => {
        if (checkbox.checked)
            checkcount++;
    });

    //special condition
    if (passwordLength < checkcount) {
        passwordLength = checkcount;
        handleSlider();
    }
}

allcheckbox.forEach(checkbox => {
    checkbox.addEventListener('change', handlecheckBoxChange);
});

slider.addEventListener('input', e => {
    passwordLength = e.target.value;
    handleSlider();
});

copybtn.addEventListener('click', () => {
    if (password_display.value) {
        copyContent();
    }
});

generatebtn.addEventListener('click', () => {
    // if non of the check box is selected
    if (checkcount == 0)
        return;

    if (passwordLength < checkcount) {
        passwordLength = checkcount;
        handleSlider();
    }

    // to find new password
    password = "";

    let funcArr = [];

    if (uppercase_check.checked)
        funcArr.push(getUpperCase);

    if (lowercase_check.checked)
        funcArr.push(getLowerCase);

    if (numbers_check.checked)
        funcArr.push(generateRandomNumber);

    if (symbol_check.checked)
        funcArr.push(generatRandomSymbols);

    //generating password

    //compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    //remaining addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(funcArr.length, 0);
        password += funcArr[randIndex]();
    }
    password = sufflePassword(Array.from(password));
    password_display.value = password;
    calcStrength();
});