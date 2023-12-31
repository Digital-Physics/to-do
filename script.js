const newItem = document.getElementById('newItem');
const addBtn = document.getElementById('addBtn');  
const openList = document.getElementById('open');

// Track items in app
let items = [];

// Save to localstorage
function saveItems() {
  localStorage.setItem('items', JSON.stringify(items)); 
}

// Load items 
function loadItems() {
  let loaded = localStorage.getItem('items');
  items = JSON.parse(loaded) || [];
  renderItems();  
}

function renderItems() {
    openList.innerHTML = '';

    items.forEach((item, index) => {
        let li = document.createElement('li');

        li.innerHTML = `
            <div class="item">${item.text}</div>
            <div class="status">${item.status}</div>
        `;

        li.appendChild(createUpButton(index)); // Add up button
        li.appendChild(createDownButton(index)); // Add down button
        li.appendChild(createDeleteButton(index)); // Add delete button
        openList.appendChild(li);
    });
}

loadItems();

function createDeleteButton(index) {
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => {
        items.splice(index, 1); // Remove the item at the specified index
        saveItems();
        renderItems();
    });
    return deleteButton;
}

function createUpButton(index) {
    const upButton = document.createElement('button');
    upButton.innerText = "🔼";
    upButton.addEventListener('click', () => {
        // swap with above, unless 0
        if (index != 0) {
            // unlike python we need to make an array to swap these two list elements this in one line
            [items[index - 1], items[index]] = [items[index], items[index - 1]];
            saveItems();
            renderItems();
        }
    });
    return upButton;
}

function createDownButton(index) {
    const downButton = document.createElement('button');
    downButton.innerText = "🔽";
    downButton.addEventListener('click', () => {
        // swap with above, unless 0
        if (index != items.length - 1) {
            // unlike python we need to make an array to swap these two list elements this in one line
            [items[index + 1], items[index]] = [items[index], items[index + 1]];
            saveItems();
            renderItems();
        }
    });
    return downButton;
}

addBtn.addEventListener('click', addItem);

newItem.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addItem();
    }
});
  
function addItem() {
    let text = newItem.value;
    items.push({
        text,
        status: 'On Track &#x1F44D;', 
    });

    newItem.value = '';
    saveItems();
    renderItems();
}

openList.addEventListener('click', e => {
    if (e.target.classList.contains('item') || e.target.classList.contains('status')) {
        let index = [...e.target.parentElement.parentElement.children].indexOf(e.target.parentElement);

        if (e.target.classList.contains('status')) {
            if (items[index].status === 'On Track &#x1F44D;') { // HTML entity for 👍
                items[index].status = 'At Risk &#x1F6A8;'; // HTML entity for 🚨
            } else if (items[index].status === 'At Risk &#x1F6A8;') {
                items[index].status = 'Complete &#x2705;'; // HTML entity for ✅
            } else {
                items[index].status ='On Track &#x1F44D;'; // 👍
            }
            saveItems();
            renderItems();
        }

        if (e.target.classList.contains('item')) {
            e.target.contentEditable = true;
            e.target.focus();

            // Add blur event listener to the editable item
            e.target.addEventListener('blur', () => {
                e.target.contentEditable = false;
                items[index].text = e.target.textContent;
                saveItems();
                renderItems();
            });
        }
    }
});