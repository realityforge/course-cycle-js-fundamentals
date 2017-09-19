const { h1, button, div, makeDOMDriver } = CycleDOM;

function main(sources) {
  const decEvent$ = sources.DOM.select('.dec').events('click');
  const incEvent$ = sources.DOM.select('.inc').events('click');
  // Decrement stream decrements one for each click
  const dec$ = decEvent$.map(e => -1);
  // Inccrement stream decrements one for each click
  const inc$ = incEvent$.map(e => 1);

  // Merge the inc$ and dec$ stream which just give the changes to number stream
  const delta$ = xs.merge(dec$, inc$);

  // Fold starts with an initial state 0, then for each incoming event on stream
  // will run the accumulation actions, replace state as we go
  const number$ = delta$.fold((prev, x) => prev + x, 0);

  return {
    DOM: number$.map(number =>
      div([
        button('.dec', 'Decrement'),
        button('.inc', 'Increment'),
        h1('Count: ' + number)
      ])
    )
  };
}

Cycle.run(main, { DOM: makeDOMDriver('#app') });
