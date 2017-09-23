const { h1, h4, a, button, div, label, input, makeDOMDriver } = CycleDOM;
const { makeHTTPDriver } = CycleHTTPDriver;

// This is all the input effects or intents (it represents user intentions)
function intent(domSource) {
  const changeWeight$ = domSource.select('.weight').events('input').map(e => e.target.value);
  const changeHeight$ = domSource.select('.height').events('input').map(e => e.target.value);
  return { changeWeight$, changeHeight$ };
}

// This is the application model
function model(actions) {
  const { changeWeight$, changeHeight$ } = actions;

  const bmi$ = xs.combine(changeWeight$.startWith(70), changeHeight$.startWith(160)).map(([weight, height]) => {
    const heightInMeters = height * 0.01;
    // BMI calculation
    const bmi = Math.round(weight / (heightInMeters * heightInMeters));
    return { weight: weight, height: height, bmi: bmi };
  });
  return bmi$;
}

//This is the output effects aka the view
function view(state$) {
  const virtualDom$ = state$.map(state =>
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
  return virtualDom$;
}

function main(sources) {
  /*
   * This architecture is known as model view intent
   */

  const actions = intent(sources.DOM);
  const state$ = model(actions);
  const virtualDom$ = view(state$);
  return {
    DOM: virtualDom$
  };
}

Cycle.run(main, { DOM: makeDOMDriver('#app'), HTTP: makeHTTPDriver() });
