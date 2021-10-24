var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var etsfArea = document.querySelector('#etsf-table-body');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function (choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    deferredPrompt = null;
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

//-- Use buton like this to cache on demand
// function onSaveButtonClicked(event) {
//   console.log('clicked');
//   if('caches' in window){
//     caches.open('user-requested')
//     .then(function(cache){
//         cache.add('https://httpbin.org/get');
//     })
//   }
//}



function createCard() {
  var tableRow = document.createElement('tr');
  var awbTableDataRow = document.createElement('td')
  awbTableDataRow.className = 'mdl-data-table__cell--non-numeric'
  awbTableDataRow.textContent = '125-12345678';
  var hawb = document.createElement('td');
  hawb.className = 'mdl-data-table__cell--non-numeric'
  hawb.textContent = 'HAWB0001';
  var split = document.createElement('td');
  split.textContent = '01';
  var npx = document.createElement('td');
  npx.textContent = '10';
  var npr = document.createElement('td');
  npr.textContent = '10';

  var description = document.createElement('td');
  description.className = 'mdl-data-table__cell--non-numeric'
  description.textContent = 'STUFF';

  // var cardSaveButton = document.createElement('button');
  //   cardSaveButton.textContent = 'Save';
  //   cardSaveButton.addEventListener('click', onSaveButtonClicked);

  tableRow.appendChild(awbTableDataRow);
  tableRow.appendChild(hawb);
  tableRow.appendChild(split);
  tableRow.appendChild(npx);
  tableRow.appendChild(npr);
  tableRow.appendChild(description);
  // tableRow.appendChild(cardSaveButton);

  componentHandler.upgradeElement(tableRow);
  etsfArea.appendChild(tableRow);

}


function clearCards() {
  while(etsfArea.hasChildNodes()) {
    etsfArea.removeChild(etsfArea.lastChild);
  }
}

//Strategy: Cache then network and dynamic caching (see SW.js for counter part.)
var url = 'https://httpbin.org/get';
var networkDateReceived = false;
fetch(url)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    networkDateReceived = true;
    console.log('From web', data)
    console.log('about to clear card')
    clearCards();
    createCard();
  });


if ('caches' in window) {
  caches.match(url)
    .then(function (res) {
      if (res) {
        return res.json();
      }
    })
    .then(function (data) {
      console.log('From cache', data);
      if (!networkDateReceived) {
        console.log('about to clear card')
        clearCards();
        createCard();
      }

    });

 

}