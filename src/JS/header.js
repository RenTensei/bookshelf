const burgerMenu = document.querySelector('.modal-mobile-menu');
const btnOpen = document.querySelector('.header-burger');
const closeModalMenu = document.querySelector('.mobile-close-btn');
export const checkbox = document.querySelector('#switch');
export const checkboxMob = document.querySelector('#mob-switch');
export const colorTheme = localStorage.getItem('ui-theme');

const userBtn = document.querySelector('.btn-user');
const logOutBtn = document.querySelector('.btn-logout');

(function checkColorTheme() {
  if (!colorTheme) {
    localStorage.setItem('ui-theme', 'light');
  }
  if (colorTheme === 'light') {
    checkbox.attributes.type.ownerElement.checked = false;
    checkboxMob.attributes.type.ownerElement.checked = false;
  } else {
    checkbox.attributes.type.ownerElement.checked = true;
    checkboxMob.attributes.type.ownerElement.checked = true;
  }
})();

logOutBtn.addEventListener('click', () => {
  logOutBtn.classList.toggle('is-active');
});

userBtn.addEventListener('click', () => {
  logOutBtn.classList.toggle('is-active');
});

btnOpen.addEventListener('click', () => {
  burgerMenu.style.display = 'block';
});

closeModalMenu.addEventListener('click', () => {
  burgerMenu.style.display = 'none';
});

checkbox.addEventListener('click', toggleCheckbox);
checkboxMob.addEventListener('click', toggleCheckboxMob);

function toggleCheckbox() {
  if (!checkbox.attributes.type.ownerElement.checked) {
    localStorage.setItem('ui-theme', 'light');
    checkboxMob.attributes.type.ownerElement.checked = false;
  } else {
    localStorage.setItem('ui-theme', 'dark');
    checkboxMob.attributes.type.ownerElement.checked = true;
  }
}
function toggleCheckboxMob() {
  if (!checkboxMob.attributes.type.ownerElement.checked) {
    localStorage.setItem('ui-theme', 'light');
    checkbox.attributes.type.ownerElement.checked = false;
  } else {
    localStorage.setItem('ui-theme', 'dark');
    checkbox.attributes.type.ownerElement.checked = true;
  }
}
