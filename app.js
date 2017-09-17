function main() {
  return {
    // This data goes to DOM effect
    DOM: xs.periodic(1000).fold(prev => prev + 1, 0).map(i => `Seconds elapsed ${i}`),
    // This data should go to Log effect
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

function logDriver(msg$) {
  msg$.subscribe({
    next: message => {
      console.log(message);
    }
  });
}

function run(mainFn, drivers) {
  const sinks = mainFn();
  Object.keys(drivers).forEach(key => {
      if (sinks[key]) {
        drivers[key](sinks[key]);
      }
    }
  );
}

run(main, { DOM: domDriver, Log: logDriver });
