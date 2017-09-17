function main() {
  return xs.periodic(1000).fold(prev => prev + 1, 0).map(i => `Seconds elapsed ${i}`);
}

function domDriver(text$) {
  text$.subscribe({
    next: message => {
      const app = document.querySelector('#app');
      app.textContent = message;
    }
  });
}

function logDriver(text$) {
  text$.subscribe({
    next: message => {
      console.log(message);
    }
  });
}

const sink = main();
domDriver(sink);
logDriver(sink);
