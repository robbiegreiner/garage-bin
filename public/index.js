const getItems = () => {
  fetch('/api/v1/items')
    .then(response => response.json())
    .then(items => {
      console.log(items);
    });
};

$(document).ready(getItems);
