
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

$(document).ready(getItems);
