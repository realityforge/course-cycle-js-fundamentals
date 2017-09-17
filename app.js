function main() {
  return {
    DOM: xs.periodic(1000).fold(prev => prev + 1, 0).map(i => `Seconds elapsed ${i}`),
    Log: xs.periodic(2000).fold(prev => prev + 1, 0)
  };
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

const sinks = main();
domDriver(sinks.DOM);
logDriver(sinks.Log);
