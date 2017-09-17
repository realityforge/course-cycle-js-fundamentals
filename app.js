function main(sources) {
  const click$ = sources.DOM;
  return {
    // This data goes to DOM effect
    DOM: click$.startWith(null)
               .map(() => xs.periodic(1000).fold(prev => prev + 1, 0))
               .flatten().map(i => `Seconds elapsed ${i}`),
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
  const domSource = fromEvent(document, 'click');
  return domSource;
}

function logDriver(msg$) {
  msg$.subscribe({
    next: message => {
      console.log(message);
    }
  });
}

function run(mainFn, drivers) {
  const fakeSinks = {};
  Object.keys(drivers).forEach(key => {
    // This is a fake that we can later make to imitate the real sink
    // This is used as the driver has a cyclic dependency (and this is
    // how Cycle.js gets it's name).
    fakeSinks[key] = xs.create();
  });

  const sources = {};
  Object.keys(drivers).forEach(key => {
      // sources[key] ends up being the real source for every driver
      sources[key] = drivers[key](fakeSinks[key]);
    }
  );

  const sinks = mainFn(sources);

  Object.keys(drivers).forEach(key => {
      fakeSinks[key].imitate(sinks[key]);
    }
  );
}

run(main, { DOM: domDriver, Log: logDriver });
