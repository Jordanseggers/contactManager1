let addContactButton1 = getElement(".btn-add-contact");
let app = getElement("#root");
let form;

async function getContacts () {
  let contacts = await fetch('api/contacts', {
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

async function displayContacts () {
  let contactsList = createElement("ul", "contacts-list");
  let contacts = await getContacts();
  let contactHtml = getElement("#contactCard").innerHTML;
  let contactTemplate = Handlebars.compile(contactHtml);

  // while(contactsList.firstChild) {
  //   contactsList.removeChild(contactsList.firstChild);
  // }

  if(contactsList.length === 0) {
    let noContacts = createElement('p');
    noContacts.textContent = "There are no contacts.";
    contactsList.append(noContacts);
  } else {
    contacts.forEach(contact => {
      let li = createElement('li', 'media col-md-3 col-sm-4');
      li.innerHTML = contactTemplate(contact);
      contactsList.append(li);
    });
    app.innerHTML = '';
    app.append(contactsList);
  }

  contactsList.addEventListener('click', (event) => {
    event.preventDefault();
    if(event.target.classList.contains("delete-contact")) {
      deleteContact(event.target.parentNode);
    }
  });
}

function addContactForm () {
  let formHTML = getElement("#new-contact-form").innerHTML;
  let formTemplate = Handlebars.compile(formHTML);

  let div = createElement('div');
  div.innerHTML = formTemplate({});
  
  app.innerHTML = '';
  app.append(div);

  form = getElement('form');

  form.addEventListener('submit', addContact);
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

document.addEventListener('DOMContentLoaded', () => {
  displayContacts();
});

addContactButton1.addEventListener('click', addContactForm);

