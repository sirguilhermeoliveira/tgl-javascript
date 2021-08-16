window.onload = firstGame;

let counterNumbers;
let totalNumbers = [];
let allrandomNumbers = [];
let firstClickCart = 0;
let totalPrice = 0;
let regexPrice = 0;
let whichLoteriaIsVar = 0;

function callGames() {
  fetch('games.json')
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      var bets = document.getElementById('bets-container-lotos');
      bets.innerHTML = '';
      const games = data.types.length;
      for (i = 0; i < games; i++) {
        bets.innerHTML +=
          '<button id="bets-color-' +
          i +
          '" value="games' +
          i +
          '"  class="bets-loteria-container-style" onclick=whichGameIs(' +
          i +
          ')>' +
          data.types[i].type +
          '</button>';
        var changeColor = document.getElementById('bets-color-' + i);
        changeColor.style.color = data.types[i].color;
        changeColor.style.borderColor = data.types[i].color;
      }
    })
    .catch(function (err) {
      console.log('Something is wrong. Error: ' + err);
    });
}

function callDescription() {
  fetch('games.json')
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      var bets = document.getElementById('bets-description');
      bets.innerHTML = '';
      bets.innerHTML += data.types[whichLoteriaIsVar].description;
      var betsNew = document.getElementById('bets-newbet-for');
      betsNew.innerText = '';
      betsNew.innerText += 'for ' + data.types[whichLoteriaIsVar].type;
    })
    .catch(function (err) {
      console.log('Something is wrong. Error: ' + err);
    });
}

function changeColorBackground(number) {
  fetch('games.json')
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      let ext = document.getElementById('bets-color-' + number);
      ext.style.color = '#FFFFFF';
      ext.style.backgroundColor = data.types[number].color;
    })
    .catch(function (err) {
      console.log('Something is wrong. Error: ' + err);
    });
}

function getCartTotal() {
  var cartBets = document.getElementById('cart-total-bets');
  cartBets.innerText = '';
  let newTotalPrice = totalPrice.toFixed(2).replace('.', ',');
  cartBets.innerHTML +=
    '<div class="side-by-side"><div class="cart-side-black">cart</div><div class="cart-side-black-right"> total: R$ ' +
    newTotalPrice +
    '</div></div>';
}

function addToCart() {
  fetch('games.json')
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      var cartBets = document.getElementById('cart-bets');
      if (totalNumbers.length !== data.types[whichLoteriaIsVar]['max-number']) {
        alert(
          'Error, you cant add to cart without all ' +
            data.types[whichLoteriaIsVar]['max-number'] +
            ' numbers selected.'
        );
        return;
      }
      if (firstClickCart === 0) {
        cartBets.innerHTML = '';
        firstClickCart = 1;
      }
      let html = '';
      regexPrice = data.types[whichLoteriaIsVar].price;
      totalPrice += regexPrice;
      let newTotalPrice = data.types[whichLoteriaIsVar].price
        .toFixed(2)
        .replace('.', ',');
      html += '<div class="bar-side-cart">';
      html += '<div class="side-by-side">';
      html +=
        '<div class="menu-thrash-save"><i onclick="deleteItemCart(this)" value="' +
        data.types[whichLoteriaIsVar].price +
        '" class="far fa-trash-alt" src="img/thrash-can.jfif" width=15 alt="Thrash"></i></div>';
      html +=
        '<div data-style="cart-thrash-side-bar-' +
        data.types[whichLoteriaIsVar].type +
        '" class="bets-backgroundcolor-lotos-container"></div>';
      html += '<div class="top-by-top">';
      html += '<p class="cart-right-text">' + totalNumbers + '</p>';
      html += '<div class="side-by-side">';
      html +=
        '<div data-style="cart-text-thrash-' +
        data.types[whichLoteriaIsVar].type +
        '" class="bets-color-lotos-container">' +
        data.types[whichLoteriaIsVar].type +
        '</div>';
      html += '<div class="cart-money">R$ ' + newTotalPrice + '</div>';
      html += '</div>';
      cartBets.innerHTML += html;
      var changeBackgroundColor = document.querySelectorAll(
        '[data-style="cart-thrash-side-bar-' +
          data.types[whichLoteriaIsVar].type +
          '"]'
      );
      changeBackgroundColor.forEach(
        (element) =>
          (element.style.backgroundColor = data.types[whichLoteriaIsVar].color)
      );
      var changeColorText = document.querySelectorAll(
        '[data-style="cart-text-thrash-' +
          data.types[whichLoteriaIsVar].type +
          '"]'
      );
      changeColorText.forEach(
        (element) => (element.style.color = data.types[whichLoteriaIsVar].color)
      );
      getCartTotal();
      clearGame();
    })
    .catch(function (err) {
      console.log('Something is wrong. Error: ' + err);
    });
}

function deleteItemCart(targetDelete) {
  var ext = targetDelete.getAttribute('value');
  totalPrice = totalPrice - ext;
  getCartTotal();
  let item = targetDelete.closest('.bar-side-cart');
  item.remove(targetDelete);
  if (totalPrice === 0) {
    var cartBets = document.getElementById('cart-bets');
    cartBets.innerHTML = 'Empty Cart';
    firstClickCart = 0;
  }
}

function completeGame() {
  fetch('games.json')
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      let randomNumber = 1;
      let maxNumberJSON = data.types[whichLoteriaIsVar]['max-number'];
      if (maxNumberJSON === totalNumbers.length) {
        clearGame();
        completeGame();
      } else {
        for (i = 1; totalNumbers.length <= maxNumberJSON - 1; i++) {
          do {
            randomNumber = Math.floor(
              Math.random() * data.types[whichLoteriaIsVar].range + 1
            );
          } while (totalNumbers.indexOf(randomNumber) !== -1);
          totalNumbers.push(randomNumber);
          var ext = document.getElementById('ext' + randomNumber);
          ext.style.backgroundColor = data.types[whichLoteriaIsVar].color;
          ext.setAttribute('value', 'onNumber');
        }
      }
    })
    .catch(function (err) {
      console.log('Something is wrong. Error: ' + err);
    });
}

function clearGame() {
  fetch('games.json')
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      let spliceRangeJSON = data.types[whichLoteriaIsVar].range;
      totalNumbers.splice(0, spliceRangeJSON);
      for (i = 1; i <= spliceRangeJSON; i++) {
        var ext = document.getElementById('ext' + i);
        ext.style.backgroundColor = '#ADC0C4';
        ext.setAttribute('value', 'offNumber');
      }
    })
    .catch(function (err) {
      console.log('Something is wrong. Error: ' + err);
    });
}

const getBetNumbers = (num) => {
  let str = '',
    i = 0;
  while (++i <= num) {
    if (i >= 100) {
      str += `<div onclick="changeButtonColor(${i})" value="offNumber" id="ext${i}">${(
        '0' + i
      ).slice(-3)}</div>`;
      document.getElementById('ext').innerHTML = str;
      return;
    }
    str += `<div onclick="changeButtonColor(${i})" value="offNumber" id="ext${i}">${(
      '0' + i
    ).slice(-2)}</div>`;
  }

  document.getElementById('ext').innerHTML = str;
};

function changeButtonColor(number) {
  fetch('games.json')
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      var ext = document.getElementById('ext' + number);
      if (
        totalNumbers.length === data.types[whichLoteriaIsVar]['max-number'] &&
        ext.getAttribute('value') === 'offNumber'
      ) {
        return alert('This is the limit of numbers you can choose.');
      } else {
        if (ext.getAttribute('value') !== 'offNumber') {
          ext.style.backgroundColor = '#ADC0C4';
          var searchTotalNumbers = totalNumbers.indexOf(number);
          totalNumbers.splice(searchTotalNumbers, 1);
          ext.setAttribute('value', 'offNumber');
        } else {
          ext.style.backgroundColor = data.types[whichLoteriaIsVar].color;
          ext.setAttribute('value', 'onNumber');
          totalNumbers.push(number);
        }
      }
    })
    .catch(function (err) {
      console.log('Something is wrong. Error: ' + err);
    });
}

function whichGameIs(number) {
  fetch('games.json')
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      clearGame();
      callGames();
      getCartTotal();
      changeColorBackground(number);
      callDescription();
      whichLoteriaIsVar = number;
      document.getElementById('ext').innerHTML = '';
      getBetNumbers(data.types[number].range);
    })
    .catch(function (err) {
      console.log('Something is wrong. Error: ' + err);
    });
}

function firstGame() {
  fetch('games.json')
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      clearGame();
      callGames();
      getCartTotal();
      callDescription();
      changeColorBackground(0);
      document.getElementById('ext').innerHTML = '';
      getBetNumbers(data.types[whichLoteriaIsVar].range);
    })
    .catch(function (err) {
      console.log('Something is wrong. Error: ' + err);
    });
}
