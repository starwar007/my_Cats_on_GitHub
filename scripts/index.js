let pikche = false;
const main = document.querySelector("main");
const updCards = function (data) {
  main.innerHTML = "";
  data.forEach(function (cat) {
    if (cat.id) {
      let card = `<div class="${cat.favourite ? "card like" : "card"}" style="background-image:
 url(${cat.img_link || "images/cat.jpg"})">
  <span class = "style__span">${cat.name.toUpperCase()}</span>
  </div>`;
      main.innerHTML += card;
    }
  });
  const cards = document.getElementsByClassName("card");
  for (let i = 0, cnt = cards.length; i < cnt; i++) {
    const width = cards[i].offsetWidth;
    cards[i].style.height = width * 0.6 + "px";

    cards[i].addEventListener('click', (e) => {
      let cat_info = catsData[i]
      info (cat_info);
        })
  }
}
 // создание экземпляра Api 
 const api = new Api("alexey_vasiliev"); // мое уникальное имя!!
 let catsData = localStorage.getItem("cats");
catsData = catsData ? JSON.parse(catsData) : [];
const getCats = function (api, store) {
  if (!store.length) {
    api.getCats()
      .then(res => res.json())
      .then(data => {
          if (data.message === "ok") {
          localStorage.setItem("cats", JSON.stringify(data.data));
          catsData = [...data.data];
          updCards(data.data);
          }
      })
  } else {
    updCards(store);
  }
}
 //=======Добавлям для фрмы авторизации =========================
const avtorez = document.querySelector('.form');
const curLogin = avtorez.querySelector('input[type="text"]');
const entrance = document.querySelector('#entrance');
const header = document.querySelector('header');
const fistchild = header.firstElementChild
const hello = document.createElement('div')
entrance.addEventListener("click", (e) => {
  e.preventDefault();
  avtorez.classList.toggle('close__form')
})

const curSubmit = avtorez.querySelector('input[type="submit"]');
curSubmit.addEventListener('click', e => {
  e.preventDefault();
  let login_context = curLogin.value;
    if ((login_context !== '' && login_context !== null) && (!!login_context.trim()) ) {
    document.cookie = `Login=${curLogin.value}`;
    const login = document.cookie.split('=');
    hello.innerHTML = `<h2>Привет : <strong class = "bluetext">${login[1]}</strong> </h2>`;
    fistchild.after(hello);
    entrance.remove();
    addform();
    pikche = true;   
    CloseAvtorez (); 
  } else {
    hello.innerHTML = '<h3 class = "redtext" >АВТОРИЗИРУЙТЕСЬ</h3>';
    fistchild.after(hello);
    curLogin.value = '';
     pikche = false;}
    if(pikche){getCats(api, catsData);}

})
function CloseAvtorez (){
    avtorez.classList.toggle('close__form')
}

function addform() {
//=====================================================
const addBtn = document.querySelector("#add");
const popupForm = document.querySelector("#popup-form");
const closePopupForm = popupForm.querySelector(".popup-close");
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!popupForm.classList.contains("active")) {
       popupForm.classList.add("active");
       popupForm.parentElement.classList.add("active");
     }
});
closePopupForm.addEventListener("click", () => {
  popupForm.classList.remove("active");
  popupForm.parentElement.classList.remove("active");
  })
 
let form = document.forms[0];
form.img_link.addEventListener("change", (e) => {
  form.firstElementChild.style.backgroundImage = `url(${e.target.value})`
})
form.addEventListener("submit", e => {
  e.preventDefault();
  let body = {};
  for (let i = 0; i < form.elements.length; i++) {
    let inp = form.elements[i];
    if (inp.type === "checkbox") {
      body[inp.name] = inp.checked;
    } else if (inp.name && inp.value) {
      if (inp.type === "number") {
        body[inp.name] = +inp.value;
      } else {
        body[inp.name] = inp.value;
      }
    }
  }
  console.log(body);
  api.addCat(body)
    .then(res => res.json())
    .then(data => {
      if (data.message === "ok") {
        form.reset();
        closePopupForm.click();
        api.getCat(body.id)
          .then(res => res.json())
          .then(cat => {
            if (cat.message === "ok") {
              catsData.push(cat.data);
              localStorage.setItem("cats", JSON.stringify(catsData));
              getCats(api, catsData);
            } else {
              console.log(cat);
            }
          })
      } else {
         api.getIds().then(r => r.json()).then(d => console.log(d));
      }
    })
})
}

//=============функция открытия информации о коте ==================================
function info (info_cat){
  const info_content = document.querySelector(".info-content");
  const img_cat = document.createElement('img');
  img_cat.src = info_cat.img_link;
  img_cat.style.width = 300 +'px';
  info_content.append(img_cat);
  const cat_about = document.createElement('div');
  cat_about.innerHTML = `<h2>ИНФОРМАЦИЯ</h2><p>Имя : <strong>${info_cat.name}</strong></p><p>Возраст : <strong>${info_cat.age} года(лет)</strong></p><p>Нравится : <strong>${info_cat.favourite ?"Обожаю":"Неочень"}</strong></p><p>ретинг : <strong>${info_cat.rate} звезд из 10</strong></p><p>Описние : <strong>${info_cat.description}</strong></p>`;
  info_content.append(cat_about);
  openinfo();
  
}
function openinfo() {
  const infoForm = document.querySelector("#popup-form-info");
  const closeinfoForm = infoForm.querySelector(".popup-close-info");
  const image_remove = infoForm.querySelector(".info-content");
  if (!infoForm.classList.contains("active")) {
    infoForm.classList.add("active");
    infoForm.parentElement.classList.add("active");
  }
  closeinfoForm.addEventListener("click", () => {
    infoForm.classList.remove("active");
    infoForm.parentElement.classList.remove("active");
    image_remove.innerHTML ='';
     })
  }