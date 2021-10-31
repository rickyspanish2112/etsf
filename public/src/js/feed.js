var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var etsfArea = document.querySelector('#etsf-table-body');


function updateUI(data) {
  clearCards();
  for (var i = 0; i < data.length; i++) {
    createCard(data[i]);
  }
}

function openCreatePostModal() {
  // createPostArea.style.display = 'block';
  // setTimeout(function() {
    createPostArea.style.transform = 'translateY(0)';
  // }, 1);
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
  //createPostArea.style.display = 'none';
  createPostArea.style.transform = 'translateY(100vh)';
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



function createCard(data) {
  var tableRow = document.createElement('tr');
  var awbTableDataRow = document.createElement('td')
  awbTableDataRow.className = 'mdl-data-table__cell--non-numeric'
  awbTableDataRow.textContent = `${data.prefix}-${data.master}`;
  var hawb = document.createElement('td');
  hawb.className = 'mdl-data-table__cell--non-numeric'
  hawb.textContent = `${data.house}`;
  var split = document.createElement('td');
  split.textContent = `${data.split}`;
  var npx = document.createElement('td');
  npx.textContent = `${data.npx}`;
  var npr = document.createElement('td');
  npr.textContent = `${data.npr}`;
  var description = document.createElement('td');
  description.className = 'mdl-data-table__cell--non-numeric'
  description.textContent = `${data.description}`;

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
  while (etsfArea.hasChildNodes()) {
    etsfArea.removeChild(etsfArea.lastChild);
  }
}

//Strategy: Cache then network and dynamic caching (see SW.js for counter part.)
var url = 'https://pwagram-ce869-default-rtdb.europe-west1.firebasedatabase.app/posts.json';
var networkDataReceived = false;

fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    networkDataReceived = true;
    console.log('From web', data);
    var dataArray = [];
    for (var key in data) {
      dataArray.push(data[key]);
    }
    updateUI(dataArray);
  });

if ('indexedDB' in window) {
  readAllData('posts')
    .then(function(data) {
      if (!networkDataReceived) {
        console.log('From cache', data);
        updateUI(data);
      }
    });
}


  //Using browser cache
// if ('caches' in window) { 
//   caches.match(url)
//     .then(function (res) {
//       if (res) {
//         return res.json();
//       }
//     })
//     .then(function (data) {
//       console.log('From cache', data);
//       if (!networkDateReceived) {
//         var dataArray = [];
//         for (var key in data) {
//           writeData('posts', data[key]);
//           //dataArray.push(data[key]);
//         }
//         clearCards();
//         updateUI(dataArray);
//       }

//     });
// }