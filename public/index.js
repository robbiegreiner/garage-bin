
const showItems = (items) => {
  items.forEach(item => {
    $('.items-container').append(`
      <div class='item${item.id} item ${item.cleanliness}'>
        <h2 class='item-name'>${item.name}</h2>
      </div>
    `);
  });
  showCount();
};

const getItems = () => {
  fetch('/api/v1/items')
    .then(response => response.json())
    .then(items => {
      showItems(sortItemsAscending(items));
    });
};

const saveItem = () => {
  const item = {
    name: $('.name-input').val(),
    reason: $('.reason-input').val(),
    cleanliness: $('.drop-down').val()
  };

  fetch('/api/v1/items', {
    method: 'POST',
    body: JSON.stringify(item),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(items => {
      showItems(sortItemsAscending(items));
      // showCount();
    })
    .catch(error => console.log(error));
};

const sortItemsAscending = (items) => {
  return items.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
};

const sortItemsDescending = (items) => {
  return items.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
};

const showCount = () => {
  const itemCount = $('.item').length;
  const sparklingCount = $('.Sparkling').length;
  const dustyCount = $('.Dusty').length;
  const rancidCount = $('.Rancid').length;

  $('.count').text(itemCount);
  $('.sparkling-count').text(sparklingCount);
  $('.dusty-count').text(dustyCount);
  $('.rancid-count').text(rancidCount);
};

$(document).ready(getItems);
$('.submit-button').on('click', saveItem);
