
const showItems = (items) => {
  items.forEach(item => {
    $('.items-container').append(`
      <div class='item${item.id} item'>
        <h2 class='item-name'>${item.name}</h2>
      </div>
    `);
  });
};

const getItems = () => {
  fetch('/api/v1/items')
    .then(response => response.json())
    .then(items => {
      showItems(items);
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
    .catch(error => console.log(error));
};

$(document).ready(getItems);
