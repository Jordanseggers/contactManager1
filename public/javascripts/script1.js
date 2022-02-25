class Model {

}

class View {

}

class Controller {

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