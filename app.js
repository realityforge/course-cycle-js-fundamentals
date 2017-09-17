const { h1, makeDOMDriver } = CycleDOM;

function main(sources) {
  const click$ = sources.DOM;
  return {
    DOM: xs.periodic(1000).fold(prev => prev + 1, 0).map(i => h1(`Seconds elapsed ${i}`)),
    // This data should go to Log effect
    Log: xs.periodic(2000).fold(prev => prev + 1, 0)
  };
}

function logDriver(msg$) {
  msg$.subscribe({
    next: message => {
      console.log(message);
    }
  });
}

Cycle.run(main, { DOM: makeDOMDriver('#app'), Log: logDriver });
