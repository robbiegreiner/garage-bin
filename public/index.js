let allItems;

const showItems = (items) => {
  items.forEach(item => {
    $('.items-container').append(`
      <div id=${item.id} class='item${item.id} item ${item.cleanliness}'>
        <h2 class='item-name'>${item.name}</h2>
        <button class='details-button'>Details</button>
        <div class='item-details hidden'>
          <p>Reason: ${item.reason}</p>
          <h4>Cleanliness: </h4>
          <select class="detail-drop-down" name="">
            <option ${item.cleanliness === 'Sparkling' ? 'selected' : ''} value="Sparkling">Sparkling</option>
            <option ${item.cleanliness === 'Dusty' ? 'selected' : ''} value="Dusty">Dusty</option>
            <option ${item.cleanliness === 'Rancid' ? 'selected' : ''} value="Rancid">Rancid</option>
          </select>
        </div>
      </div>
    `);
  });
  showCount();
};

const getItems = () => {
  fetch('/api/v1/items')
    .then(response => response.json())
    .then(items => {
      allItems = items;
      showItems(items);
    });
};

const clearFields = () => {
  $('.name-input').val('');
  $('.reason-input').val('');
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
      showItems(items);
      allItems.push(items[0]);
      clearFields();
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
      return 1;
    }
    if (nameA > nameB) {
      return -1;
    }
    return 0;
  });
};

const sortItems = () => {
  const buttonText =  $('.sort-button').text();
  if (buttonText === 'Sort A-Z') {
    $('.sort-button').text('Sort Z-A');
    $('.item').remove();
    showItems(sortItemsAscending(allItems));
  } else {
    $('.sort-button').text('Sort A-Z');
    $('.item').remove();
    showItems(sortItemsDescending(allItems));
  }
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

const changeCleanliness = (event) => {
  const newCleanliness = JSON.stringify({
    cleanliness: event.target.value
  });
  const id = $(event.target).closest('.item').attr('id');

  fetch(`/api/v1/items/${id}`, {
    method: 'PATCH',
    body: newCleanliness,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

const toggleDetails = (event) => {
  $(event.target).siblings('.item-details').toggleClass('hidden');
};

const hideDoor = () => {
  $('.closed').addClass('roll-up');
  $('.open-button').remove();
};

$(document).ready(getItems);
$('.submit-button').on('click', saveItem);
$('.open-button').on('click', hideDoor);
$('.sort-button').on('click', sortItems);
$('.items-container').on('click', '.details-button', (event) => toggleDetails(event));
$('.items-container').on('change', '.detail-drop-down', (event) => changeCleanliness(event));
