'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2021-01-10T23:36:17.929Z',
    '2021-01-12T10:51:36.790Z',
  ],
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2021-01-09T12:01:20.894Z',
  ],
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2021-01-10T23:36:17.929Z',
    '2021-01-12T10:51:36.790Z',
  ],
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
  ],
};

const accounts = [account1, account2, account3, account4];
///////////CREATE USERNAME////////////////
function createUsername(accs) {
  accs.forEach(function (acc) {
    acc.usr = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
}

createUsername(accounts);
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////LOGIN EVENT////////////////
function Timer() {
  let time = 10;
  function tick() {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    time--;
  }
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}
let curAcc, timer;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  if (timer) clearInterval(timer);
  timer = Timer();
  curAcc = accounts.find(acc => acc.usr === inputLoginUsername.value);
  console.log(curAcc);

  switch (Number(inputLoginPin.value)) {
    case curAcc?.pin:
      labelWelcome.textContent = `Welcome Back, ${curAcc.owner}`;
      containerApp.style.opacity = 100;
      displaySummary(curAcc);
      displayMovements(curAcc);
      inputLoginPin.blur();
      break;
    default:
      alert('Invalid Login');
      inputLoginPin.value = '';
      inputLoginUsername.blur();
      inputLoginPin.blur();
  }
  console.log(document.querySelectorAll('.movements__value'));
  labelDate.textContent = Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date());
});
/////////////////FORMAT MOV/////////////////////////
function formatMov(movement) {
  const mov = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(movement);
  return mov;
}

/////////////////FORMAT MOV DATES////////////////////////
function formatMovDates(mov) {
  const now = new Date();
  const movDate = new Date(mov);
  const daysPassed = Math.trunc(
    Math.abs(movDate - now) / (1000 * 60 * 60 * 24)
  );

  if (daysPassed < 1) {
    return `TODAY`;
  } else if (daysPassed < 2) {
    return `YESTERDAY`;
  } else if (daysPassed <= 5) {
    return `${daysPassed} Days Ago`;
  }
  return Intl.DateTimeFormat('en-GB', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  }).format(movDate);
}
/////////DISPLAY MONEY TRANSFERS///////////////////
function displayMovements(acc) {
  containerMovements.innerHTML = '';
  acc.movements.forEach((movement, index) => {
    let type = movement > 0 ? 'deposit' : 'withdrawal';

    const date = formatMovDates(acc.movementsDates[index]);

    const htmlMovementsRow = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}"> 
      ${index + 1} ${type}</div>
      <div class="movements__date">${date}</div>
      <div class="movements__value">${formatMov(movement)}</div>
    </div>
   `;
    containerMovements.insertAdjacentHTML('afterbegin', htmlMovementsRow);
  });
}
////////////COMPUTE ACC SUMMARY/////////////////
function getSummary(acc) {
  //balcnce
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  //In
  acc.sumIn = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  //Out
  acc.sumOut = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc - mov, 0);
  //Intrest
  acc.intrest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(mov => mov > 1)
    .reduce((acc, depo) => acc + depo, 0);
}
///////////////DISPLAY SUMMARY///////////////////
function displaySummary(acc) {
  getSummary(acc);
  labelBalance.textContent = formatMov(acc.balance);
  labelSumIn.textContent = formatMov(acc.sumIn);
  labelSumOut.textContent = formatMov(acc.sumOut);
  labelSumInterest.textContent = formatMov(acc.intrest);
}
////////////TRANSFER MONEY//////////////////////
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  if (timer) clearInterval(timer);
  timer = Timer();
  const recv = accounts.find(acc => acc.usr === inputTransferTo.value);
  const amount = Number(inputTransferAmount.value);
  if (amount > 0 && amount <= curAcc.balance) {
    curAcc.movements.push(-amount);
    recv.movements.push(amount);
    displayMovements(curAcc);
    displaySummary(curAcc);
    clearInput(inputTransferAmount, inputTransferTo);
  } else {
    alert('Invalid Transfer\nRequest Denied');
  }
});

/////////////////LOAN EVENT/////////////////////////
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  if (timer) clearInterval(timer);
  timer = Timer();
  const now = new Date();
  let loan = Number(inputLoanAmount.value);
  if (loan > 0 && curAcc.movements.some(mov => mov >= loan * 0.1)) {
    setTimeout(() => {
      curAcc.movements.push(loan);
      curAcc.movementsDates.push(now.toISOString());
      displayMovements(curAcc);
      displaySummary(curAcc);
    }, 3000);
  } else {
    alert('Loan Request Denied');
    inputLoanAmount.value = '';
  }
});
/////////////////SORT EVENT////////////////////////////
let sorted = false;
if (timer) clearInterval(timer);
timer = Timer();
btnSort.addEventListener('click', function () {
  if (!sorted) {
    curAcc.movements.sort((a, b) => a - b);
    displayMovements(curAcc);
    sorted = true;
  } else {
    curAcc.movements.sort((a, b) => b - a);
    displayMovements(curAcc);
    sorted = false;
  }
});
////////////////////CLOSE ACC///////////////////////
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === curAcc.usr &&
    inputClosePin.value === String(curAcc.pin)
  ) {
    accounts.splice(
      accounts.findIndex(acc => acc.usr === inputCloseUsername.value),
      1
    );
    clearInput(inputCloseUsername, inputClosePin);
    clearInput(inputLoginUsername, inputLoginPin);
    labelWelcome.textContent = 'Log in to get started';
    containerApp.style.opacity = 0;
  } else {
    alert('Invalid Creditials');
  }
});
////////////CLEAR INPUT//////////////////////////
function clearInput(input1, input2) {
  input1.value = '';
  input2.value = '';
  input1.blur();
  input2.blur();
}
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*
//Array Methods
let arr = [1, 2, 3, 4, 5];
//Slice
console.log(arr.slice(2));
console.log(arr.slice(2, 3));
console.log(arr.slice(2, -2));
console.log(arr);

//Splice
//Mutates orginal array
// first arg is index
//second arg is splice count
//third arg and on are items to add
console.log(arr.splice(2));
console.log(arr);
arr.splice(-1);
console.log(arr);
//Splice method count example
let arrForSplice = [1, 2, 3, 4, 5];
let newArrSplice = arrForSplice.splice(1, 4);
console.log(newArrSplice);
console.log(arrForSplice);
//Splice method replacing and adding elements example
newArrSplice.splice(0, 0, 1);
console.log(newArrSplice);
arrForSplice.splice(0, 1, 6, 7, 8, 9, 10);
console.log(arrForSplice);

//Reverse Method
//Mutates original array
let arrReve = ['a', 'b', 'c', 'd', 'e'];
console.log(arrReve.reverse());

//Concat Method
let fullList = newArrSplice.concat(arrForSplice);
console.log(fullList);

//Join Method
console.log(fullList.join('+'));


movements.forEach((move, index, Array) => {
  (move > 0 && console.log(`${index + 1} You've Deposited: ${move}`)) ||
    (move < 0 &&
      console.log(`${index + 1} You've Withdrawn: ${Math.abs(move)}`));
});

//forEach for Maps and Sets

const cur = new Map([
  ['usd', 'United States'],
  ['euro', 'Europe'],
  ['gdp', 'England'],
]);

cur.forEach((v, k, m) => console.log(`Currency: ${k}\n\tCountry: ${v}`));

const currUnique = new Set(['USD', 'GDP', 'YEN', 'EUR', 'YEN', 'EUR']);
currUnique.forEach((v, k) => console.log(v, k));
*/

//Coding Challange #1
function checkDogs(dogsJ, dogsK) {
  let dogs = dogsJ.slice(1, -2);
  console.log(dogs);
  let allDogs = dogs.concat(dogsK);
  allDogs.forEach((v, i) => {
    console.log(
      v >= 3
        ? `${v} Dog number ${i + 1} is an adult, and is ${v} years old`
        : `${v} Dog number ${i + 1} is still a puppy🐶`
    );
  });
}
// checkDogs([1, 2, 3, 4], [5, 6, 7, 8]);
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// console.log(' ');
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

//Map, Filter, Reduce Methods
let eur = 1.1;
//Map Method
//Takes array and uses call back function on each item from array and adds to new array
console.log(movements.map(mov => mov * eur));

let newArr2 = [];
movements.forEach(mov => newArr2.push(mov * eur));
console.log(newArr2);

//Filter Method
//Only elements that return true are added to new array
console.log(movements.filter(mov => mov > 0));

let newArr3 = [];
for (let mov of movements) if (mov > 0) newArr3.push(mov);
console.log(newArr3);

//Practice Excersise
const withdraws = movements.filter(mov => mov < 0);
console.log(withdraws);

//Reduce Method
//reutrns value after computation on every element in array
//first arg is call back function
//second arg is the accumulator varibable starting value

//Args collected for call back function
// first arg acculator pattern variable
// second is the current value of the array
// third is the index
// Fourth is the entire array
console.log(movements.reduce((acc, curr) => acc + curr, 0));

let balcance = 0;
for (const mov of movements) balcance += mov;
console.log(balcance);

//Practical Example of reduce method
// console.log(
//   movements.reduce(function (acc, curr) {
//     acc = acc < curr ? curr : acc;
//     return acc;
//   }, 0)
// );
console.log(movements.reduce((acc, curr) => (acc = acc > curr ? curr : acc)));

//Coding Challange #2
function calcAverageHumanAge(dogs) {
  let dogsHumanAge = dogs
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
  console.log(dogsHumanAge);
}

calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

//Find Method
//Returns a value first value to match condition
console.log(movements.find(mov => mov < 0));
console.log(accounts.find(acc => acc.usr == 'stw'));

for (let acc of accounts) if (acc.usr == 'js') console.log(acc);

//FindIndex Method
//Similar to indexOf method but goes level deeper
//Returns a index of the value that matches condition
console.log(accounts.findIndex(acc => acc.interestRate === 1));
console.log(accounts.findIndex(acc => acc.usr === 'stw'));

//Some Method
//Returns a boolean value
//true if any of the list elements match the condition
//false if not
console.log(accounts.some(acc => acc.movements.length === 20));
console.log(accounts.some(acc => acc.usr.length > 2));

//Every Method
//Returns a boolean value
//true is all elements match condition
//false if not
console.log(accounts.every(acc => acc.pin));
console.log(accounts.every(acc => acc.usr > 2));

//Flat Method
//Combines nested array structure into one array
let nArr = [[1, 2, 3, 4], [5, 6, 7, 8], [(9, 10)]];
console.log(nArr.flat());

//first arg for flat method is the depth of the nested array
//default 1
nArr = [[[1, 2, 3], 4, 5, [6, 7, 8], [9, 10]]];
console.log(nArr.flat(2));

//Practical Usage

let allMov = accounts.map(acc => acc.movements.slice());
console.log(allMov);

let globalBalance = allMov.flat().reduce((acc, mov) => acc + mov);
console.log(globalBalance);

//FlatMap Method\
//Combines flat and map method for better performace aka faster speeds
let globalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov);
console.log(globalBalance2);

//Sort Method
//Mutating Method
//If not passed a callback function converts all elements to string and sorts alphbetically

//Strings
let name = ['Emma', 'Carter', 'Weston', 'Mason', 'Mom'];
console.log(name.sort());
console.log(name);

//Numbers
//return less than 0, a,b
//return more than 0, b,a
//return less average, bitches
//return more bad, attitudes

//return accending order
let nums = [1, 5, 4, 3, 7, 6, 2, 8, 9, 14, 10, 12, 11, 15, 13];
// nums.sort((a, b) => {
//   if (b > a) return 1;
//   if (a > b) return -1;
// });
// console.log(nums);

nums.sort((a, b) => a - b);
console.log(nums);

//Filling Arrays
//Fill Method
//Mutating Method
let x = new Array(11);
console.log(x);

x.fill(5);
console.log(x);
//first arg is the element to fill array with
//second arg is the index to start filling from
//third arg is the end index
x.fill(6, 5);
console.log(x);

x.fill(11, 5, 6);
console.log(x);

let y = new Array(5).fill(5);
console.log(y);

//Array.from Method
//Simlar to fill method but takes an obj as first arg to define len and callback function as second arg
//create arrray wtih specifed length and fills based on function
let y3 = Array.from({ length: 5 }, () => 5);
console.log(y3);

let diceRolls = Array.from({ length: 100 }, () =>
  Math.trunc(Math.random() * 7)
);
console.log(diceRolls);

console.log(Array.from({ length: diceRolls.length }, () => 1));
console.log(
  Array.from(
    document.querySelectorAll('.movements__value'),
    mov => mov.textContent
  )
);

labelBalance.addEventListener('click', function () {
  console.log(
    Array.from(document.querySelectorAll('.movements__value'), ele =>
      ele.textContent.replace('€', '')
    ).map(str => Number(str))
  );
});

//Coding Challange #4
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
//Task 1
dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);

//Task 2
let sarahsDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(
  (sarahsDog.curFood < sarahsDog.recFood * 0.9 &&
    "Sarah's Dog is eating to little!") ||
    (sarahsDog.curFood > sarahsDog.recFood * 1.1 &&
      "Sarah's Dog is eating to much!")
);

//Task 3
let ownerEatToMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);
let ownerEatToLitte = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);

//Task 4
console.log(`${ownerEatToMuch.join(' and ')}'s dogs eat to much!`);
console.log(`${ownerEatToLitte.join(' and ')}'s dogs eat to litte!`);

//Task 5
console.log(dogs.some(dog => dog.curFood === dog.recFood));

//Task 6
const checkDogsOk = dog =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;
console.log(dogs.some(checkDogsOk));

//Task 7
let dogsOk = dogs.filter(checkDogsOk);
console.log(dogsOk);

//Task 8
console.log(dogs.slice().sort((a, b) => a.recFood - b.recFood));
