class Model {
  constructor() {
    this.contacts;
  }

  async getContacts () {
    let contacts = await fetch('api/contacts', {
      method: 'GET'
    }).then(contacts => contacts.json())
      .catch(() => alert('can\'t get contacts'));
 
    return contacts;
  }
}

class View {
  constructor() {
    this.app = this.getElement('#root');
    this.contactsList = this.createElement("ul", "contacts-list");
  }

  createElement(tag, className) {
    let element = document.createElement(tag);
    if (className) element.classList.add(className);
    return element;
  }

  getElement(selector) {
    let element = document.querySelector(selector);
    return element;
  }

  async displayContacts (contacts) {
    //Delete any existing nodes
    while (this.contactsList.firstChild) {
     this.contactsList.removeChild(this.contactsList.firstChild);
    }
    if (contacts.length === 0) {
      let p = this.createElement('p');
      p.textContent = "There are no contacts.";
      this.contactsList.append(p);
    } else {
      //add contact nodes
      contacts.forEach(contact => {
        let li = this.createElement('li');
        li.textContent = `${String(contact.full_name)}`;
        this.contactsList.append(li);
      });
    }
    this.app.append(this.contactsList);
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    //binding stuff needs to go here
    //Display initial todos
    this.addContactsToPage();
  }



  async addContactsToPage() {
    let contacts = await this.model.getContacts();
    this.view.displayContacts(contacts);
  }
}

class App {
  constructor() {
    this.model = new Model();
    this.view = new View();
    this.Controller = new Controller(this.model, this.view);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
});