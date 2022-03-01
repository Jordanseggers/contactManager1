let addContactButton1 = getElement(".btn-add-contact");
let app = getElement("#root");
let search = getElement(".contact-name-search");
let contacts;
let form;
let tagOptions = ['work', 'school'];

async function getContacts () {
  contacts = await fetch('api/contacts', {
    method: 'GET'
  }).then(res => {
    return res.json()
  }).catch(() => alert('can\'t get contacts'));

  return contacts;
}

function createElement(tag, classNames) {
  let element = document.createElement(tag);
  if (classNames) {
    classNames.split(" ").forEach(className => {
      element.classList.add(className);
    });
  }
  return element;
}

function getElement(selector) {
  let element = document.querySelector(selector);
  return element;
}

function convertTags (contacts) {
  let contactsArr = Array.prototype.slice.call(contacts);
  contactsArr.forEach(contact => {
    if(contact.tags) {
      contact["tags"] = contact["tags"].split(',');
    }
  });
  return contactsArr;
}

async function displayContacts () {
  let contactsList = createElement("ul", "contacts-list");
  contacts = await getContacts();
  let contactHtml = getElement("#contactCard").innerHTML;
  let contactTemplate = Handlebars.compile(contactHtml);

  if(contacts.length === 0) {
    console.log('apparently, the contacts length is 0')
    let noContacts = createElement('p');
    noContacts.textContent = "There are no contacts.";
    contactsList.append(noContacts);
  } else {
    contacts = convertTags(contacts);
    contactsList.innerHTML = contactTemplate({contacts:contacts});
  }

  app.innerHTML = '';
  app.append(contactsList);

  contactsList.addEventListener('click', (event) => {
    event.preventDefault();
    if(event.target.classList.contains("delete-contact")) {
      deleteContact(event.target.parentNode);
    } else if (event.target.classList.contains("edit-contact")) {
      let contactId = event.target.parentNode.dataset.contactId;
      contactForm(Number(contactId));
    }
  });
}

function contactForm (existingId) {
  let formHTML = getElement("#new-contact-form").innerHTML;
  let formTemplate = Handlebars.compile(formHTML);

  let div = createElement('div');
  div.innerHTML = formTemplate({});
  if (typeof existingId === "number") {
    let contact = contacts.filter(contact => contact.id === Number(existingId))[0];
    let nameField = div.querySelector('.contact-name-input');
    let emailField = div.querySelector('.contact-email-input');
    let phoneField = div.querySelector('.contact-phone-input');
    nameField.setAttribute("placeholder", `${contact["full_name"]}`);
    emailField.setAttribute("placeholder", `${contact["email"]}`);
    phoneField.setAttribute("placeholder", `${contact["phone_number"]}`);
  }
  
  app.innerHTML = '';
  app.append(div);

  form = getElement('form');

  if(typeof existingId === "number") {
    form.dataset.contactId = existingId;
    form.addEventListener('submit', editContact);
  } else {
    form.addEventListener('submit', addContact);
  }
}

function formDataToJSON(formData) {
  let json = {};
  for (const pair of formData.entries()) {
    json[pair[0]] = pair[1];
  }

  return json;
}

async function addContact (event) {
  event.preventDefault();
  console.log('submit clicked');
  let formData = new FormData(form);
  let jsonData = formDataToJSON(formData);

  await fetch('api/contacts', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(jsonData)
  }).then()
  .catch(() => alert('can\'t add contact'));

  displayContacts();
}

async function deleteContact (element) {
  let contactId = element.dataset.contactId;
  await fetch(`api/contacts/${contactId}`, {
    method: 'DELETE'
  }).then(console.log('successfully deleted'))
    .catch(console.log('could not delete contact'));

  displayContacts();
}

function sanitizeObject (object) {
  let keys = Object.keys(object);
  let newObj = {};
  keys.forEach(key => {
    if(object[key] !== '') {
      newObj[key] = object[key];
    }
  });
  return newObj;
}

async function editContact (event) {
  event.preventDefault();
  let contactId = event.target.dataset.contactId;
  
  let formData = new FormData(event.target);
  let jsonData = formDataToJSON(formData);
  let usefulFormData = sanitizeObject(jsonData);
  usefulFormData.id = Number(contactId);

  await fetch(`/api/contacts/${contactId}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(usefulFormData)
  }).then(res => console.log(res.body))
    .catch(console.log('failed'));

  displayContacts();
}

function filterContacts() {
  let value = search.value;
  let cards = document.querySelectorAll(".card");
  let cardsArr = Array.prototype.slice.call(cards);
  cardsArr.forEach(card => {
    if (value === "") {
      console.log(`unhide all`);
      card.classList.toggle('hide', false);
    } else {
      let name = card.querySelector('h3').textContent;
      let includes = value;
      console.log(includes);
      console.log(new RegExp(includes, 'i'));
      if (!name.match(new RegExp(includes))) {
        console.log(`hiding card ${name}`);
        card.classList.toggle('hide', true);
      }
    }
  })
}

// function tagForm () {
//   let formHTML = getElement("#new-tag").innerHTML;
//   let formTemplate = Handlebars.compile(formHTML);

//   let div = createElement('div');
//   div.innerHTML = formTemplate({});

//   let currentTags = div.querySelector('.current-tags');
//   tagOptions.forEach(tag => {
//     let dd = createElement('dd');
//     dd.textContent = tag;
//     currentTags.append(dd);
//   });

//   app.innerHTML = '';
//   app.append(div);

//   form = getElement('form');
//   form.addEventListener('submit', (event) => {
//     let newTag = event.target.tag.value;
//     console.log(newTag);
//   })
// }

document.addEventListener('DOMContentLoaded', () => {
  displayContacts();
});

addContactButton1.addEventListener('click', contactForm);
search.addEventListener('input', filterContacts);

