const { h1, makeDOMDriver } = CycleDOM;

function main(sources) {
  const mouseover$ = sources.DOM.select('h1').events('mouseover');
  return {
    DOM: mouseover$.startWith(null)
                   .map(() => xs.periodic(1000).fold(prev => prev + 1, 0))
                   .flatten().map(i => h1(`Seconds elapsed ${i}`)),
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
