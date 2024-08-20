const cards = document.querySelectorAll(".card");
let basket = [];

const toggleModal = () => {
  const basketModal = document.querySelector(".basket");
  basketModal.classList.toggle("active");
};

const extractCardDetails = () => {
  const cardDetails = [];
  cards.forEach((cardElement, index) => {
    const imgElement = cardElement.querySelector("img");
    const titleElement = cardElement.querySelector(".card-title");
    const priceElement = cardElement.querySelector(".card-text");

    if (imgElement && titleElement && priceElement) {
      cardDetails.push({
        id: index,
        imgSrc: imgElement.src,
        title: titleElement.textContent,
        price: priceElement.textContent,
      });
    }
  });
  return cardDetails;
};

const clothesItemsHtml = () => {
  const clothesItems = document.querySelector(".clothesList");
  const cardDetails = extractCardDetails();
  let clothesItemsHtml = "";
  cardDetails.forEach((cardDetail) => {
    clothesItemsHtml += `<div class="col-sm-3 mb-4">
          <div class="card">
            <img
              src="${cardDetail.imgSrc}"
              class="card-img-top"
              alt="..."
            />
            <div class="card-body">
              <h6 class="card-title">${cardDetail.title}</h6>
              <p class="card-text">$${cardDetail.price}</p>
              <button type="button" class="card-button btn btn-dark" onclick = "addToBasket(${cardDetail.id})">
                BUY
              </button>
            </div>
          </div>
        </div>`;
  });

  clothesItems.innerHTML = clothesItemsHtml;
};

const addToBasket = (id) => {
  const cardDetails = extractCardDetails();
  const findedClothes = cardDetails.find((card) => card.id === id);
  if (findedClothes) {
    const basketAlreadyIndex = basket.findIndex(
      (basketItem) => basketItem.product.id === id
    );
    if (basketAlreadyIndex === -1) {
      let addedItem = { quantity: 1, product: findedClothes };
      basket.push(addedItem);
    } else basket[basketAlreadyIndex].quantity += 1;
    console.log(cardDetails);
    updateBasketList();
  }
};

const updateBasketList = () => {
  localStorage.setItem("basket", JSON.stringify(basket));
  const basketList = document.querySelector(".basketList");
  const totalPriceEl = document.querySelector(".totalPrice");
  const basketCounter = document.querySelector(".basketCount");
  basketCounter.innerHTML = basket.length > 0 ? basket.length : null;

  let total = 0;
  let basketListHtml = "";
  basket.forEach((item) => {
    total += item.product.price * item.quantity;
    basketListHtml += ` 
          <li class="basketItem">
            <img
              src="${item.product.imgSrc}"
              alt=""
              style="width: 100px; height: 100px"
            />
            <div style="color: white; width: 200px">
              <h3 class="clothesName">${item.product.title}</h3>
              <span class="clothesPrice"> ${item.product.price}</span> <br />
              <span class="clothesRemove" onclick = "removeItem(${item.product.id})">Remove</span>
            </div>
            <div class="bookCount">
              <span class="decrease" onclick = "decreaseItem(${item.product.id})">-</span>
              <span>${item.quantity}</span>
              <span class="increase" onclick = "increaseItem(${item.product.id})">+</span>
            </div>
          </li>
        `;
  });
  basketList.innerHTML = basketListHtml
    ? basketListHtml
    : `
    <li class="basketItem"> <h5> No Items</h5></li>
  `;

  totalPriceEl.innerHTML = total > 0 ? "Total: $" + total.toFixed(2) : null;
};
const removeItem = (id) => {
  const findedIndex = basket.findIndex(
    (basketClothe) => (basketClothe.product.id = id)
  );
  if (findedIndex !== -1) {
    basket.splice(findedIndex, 1);
  }
  updateBasketList();
};

const decreaseItem = (id) => {
  const findedIndex = basket.findIndex(
    (basketClothe) => basketClothe.product.id === id
  );
  if (findedIndex !== -1) {
    if (basket[findedIndex].quantity > 1) {
      basket[findedIndex].quantity -= 1;
    } else {
      removeItem(id);
    }
  }
  updateBasketList();
};
const increaseItem = (id) => {
  const findedIndex = basket.findIndex(
    (basketClothe) => basketClothe.product.id === id
  );
  if (findedIndex !== -1) {
    basket[findedIndex].quantity += 1;
  }
  updateBasketList();
};
if (localStorage.getItem("basket")) {
  basket = JSON.parse(localStorage.getItem("basket"));
  updateBasketList();
}
clothesItemsHtml();
