const { h1, h4, a, button, div, label, input, makeDOMDriver } = CycleDOM;
const { makeHTTPDriver } = CycleHTTPDriver;

function main(sources) {
  const changeWeight$ = sources.DOM.select('.weight').events('input').map(e => e.target.value);
  const changeHeight$ = sources.DOM.select('.height').events('input').map(e => e.target.value);

  const bmi$ = xs.combine(changeWeight$.startWith(70), changeHeight$.startWith(160)).map(([weight, height]) => {
    const heightInMeters = height * 0.01;
    // BMI calculation
    const bmi = Math.round(weight / (heightInMeters * heightInMeters));
    return { weight: weight, height: height, bmi: bmi };
  });

  // display data
  const virtualDom$ = bmi$.map(state =>
    div([
      div([
        label('Weight: ' + state.weight + 'kg'),
        input('.weight', { attrs: { type: 'range', min: 40, max: 160, value: state.weight } })
      ]),
      div([
        label('Height: ' + state.height + 'cm'),
        input('.height', { attrs: { type: 'range', min: 150, max: 220, value: state.height } })
      ]),
      h4('BMI is ' + state.bmi)
    ])
  );
  return {
    DOM: virtualDom$
  };
}

Cycle.run(main, { DOM: makeDOMDriver('#app'), HTTP: makeHTTPDriver() });
