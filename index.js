import { menuArray } from '/data.js';
const complete = document.getElementById('complete')
const container = document.getElementById('container');
const consentForm = document.getElementById('consent-form')
const modalCloseBtn = document.getElementById('modal-close-btn')
const modalText = document.getElementById('modal-text')
let sum = 0;
let basket = [];


complete.addEventListener('click',function(){
    modal.style.display = 'block'
})

modalCloseBtn.addEventListener('click', function(){
    modal.style.display = 'none'
}) 

window.addEventListener('click', function (e) {
    if (e.target.dataset.btn) {
        handleProducts(e.target.dataset.btn);
    } else if (e.target.dataset.orderbtn) {
        handleOrders(e.target.dataset.orderbtn);
    } else if (e.target.dataset.removebtn) {
        removeProduct(e.target.dataset.removebtn);
    }
});

function handleProducts(productId) {
    let basketData = ``;
    document.getElementById('thanks-message').style.display ='none'

    
    const data = menuArray.find(function (item) {
        return item.id == productId;
    });

    const orderObj = {
        id: data.id,
        name: data.name,
        price: data.price,
        emoji: data.emoji,
    };

    // Check if the item with the same name already exists in the basket
    const existingItem = basket.find(function (item) {
        return item.id === data.id;
    });

    if (existingItem) {
        // If the item already exists, increase its quantity
        existingItem.price += data.price;
    } else {
        // If it doesn't exist, add a new item to the basket
        basket.push(orderObj);
    }
    sum = basket.reduce(function (total, item) {
        return total + item.price;
    }, 0);

    basket.forEach(function (item) {
        basketData += `
        <div class="product" id='id-${item.id}'>
            <div class="middle">
                <h2>${item.name}</h2>
            </div>
            <div class="right">
                <h2>${item.price} AZN</h2>
            </div>
            <div class="right">
                <button class="remove" data-removebtn="remove-${item.id}"> Remove </button>
            </div>
        </div>
        `;
    });
     if (basketData.length>0){
        document.getElementById('basketData').style.display = 'block'
        document.getElementById('sum').style.display = 'block'        
    }

    document.getElementById('basket').innerHTML = basketData;
    document.getElementById('sum').innerHTML = 'TOTAL PRICE: ' + sum;
}

function removeProduct(productId) {
    // Find the index of the product to remove in the basket array
    const indexToRemove = basket.findIndex(function (item) {
        return 'remove-' + item.id === productId;
    });

    if (indexToRemove !== -1) {
        // Remove the product from the basket array
        basket.splice(indexToRemove, 1);

        // Recalculate the sum based on the updated basket
        sum = basket.reduce(function (total, item) {
            return total + item.price;
        }, 0);
        
        if (basket.length>0){
            // Update the basket and sum display
        document.getElementById('basket').innerHTML = basket
            .map(function (item) {
                return `
                    <div class="product" id='id-${item.id}'>
                        <div class="middle">
                            <h2>${item.name}</h2>
                        </div>
                        <div class="right">
                            <h2>${item.price} AZN</h2>
                        </div>
                        <div class="right">
                            <button class="remove" data-removebtn="remove-${item.id}"> Remove </button>
                        </div>
                    </div>
                `;
            })
            .join('');
              document.getElementById('sum').innerHTML = 'TOTAL PRICE: ' + sum;

        }else{
            document.getElementById('basketData').style.display = 'none'
            document.getElementById('sum').innerHTML = 'TOTAL PRICE: ' + sum;
            document.getElementById('sum').style.display = 'none'
        }
        

    }
}

consentForm.addEventListener('submit', function(e){
    e.preventDefault()
    
    const consentFormData = new FormData(consentForm)
    const fullName = consentFormData.get('fullName')
    console.log(fullName)
    
    modalText.innerHTML = `
    <div class="modal-inner-loading">
        <p id="upload-text">Making the sale...</p>
    </div>` 
    
    setTimeout(function(){
        document.getElementById('upload-text').innerText = `
        ${fullName} you finished ordering. Congratulations...`
        modal.style.display = 'none'
    }, 1500)
    setTimeout(function(){
        modal.style.display = 'none'
        renderBasket()
        document.getElementById('thanks-message').style.display='block'
    }, 2000)

  
}) 
function renderBasket(){
    sum=0
    basket=[]
    document.getElementById('basketData').style.display = 'none'
    document.getElementById('sum').style.display = 'none'
}

function getAllProduct() {
    const all = menuArray.map(function (item) {
        const { name, ingredients, id, price, emoji, count } = item;

        return `
            <div class="product" id="${id}">
                <div class="left">
                    <img src="${emoji}">
                </div>
                <div class="middle">
                    <h2>${name}</h2>
                    <p>${ingredients}</p>
                    <h2>${price} AZN</h2>
                </div>
                <div class="right">
                    <button class="increase" data-btn="${id}"> + </button>
                </div>
            </div>
        `;
    });

    return all;
}

container.innerHTML = getAllProduct().join('');
