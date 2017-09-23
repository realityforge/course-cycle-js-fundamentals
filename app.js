const { div, label, input, makeDOMDriver } = CycleDOM;

// This is all the input effects or intents (it represents user intentions)
function intent(domSource) {
  const changeValue$ = domSource.select('.slider').events('input').map(e => e.target.value);
  return { changeValue$ };
}

// This is the application model
function model(actions, props$) {
  const { changeValue$ } = actions;
  return props$.map(props => {
    return changeValue$.startWith(props.initial).map(value => {
      return {
        value,
        min: props.min,
        max: props.max,
        label: props.label,
        units: props.units
      };
    });
  }).flatten();
}

//This is the output effects aka the view
function view(state$) {
  return state$.map(state =>
    div('.labeled-slider', [
        label('.label', state.label + ': ' + state.value + state.units),
        input('.slider', { attrs: { type: 'range', min: state.min, max: state.max, value: state.weight } })
      ]
    )
  );
}

function labeledSlider(sources) {
  const props$ = sources.props;

  const actions = intent(sources.DOM);
  const state$ = model(actions, props$);
  const virtualDom$ = view(state$);
  return {
    DOM: virtualDom$
  };
}

function main(sources) {
  const { isolateSource, isolateSink } = sources.DOM;

  const weightProps$ = xs.of({
    label: 'Weight',
    units: 'kg',
    min: 40,
    max: 150,
    initial: 40
  });
  const weightDomSource = isolateSource(sources.DOM, '.weight');
  const weightSinks = labeledSlider(Object.assign({}, sources, { DOM: weightDomSource, props: weightProps$ }));
  const weightVDOM$ = isolateSink(weightSinks.DOM, '.weight');
  const heightProps$ = xs.of({
    label: 'Height',
    units: 'cm',
    min: 140,
    max: 220,
    initial: 140
  });
  const heightDomSource = isolateSource(sources.DOM, '.height');
  const heightSinks = labeledSlider(Object.assign({}, sources, { DOM: heightDomSource, props: heightProps$ }));
  const heightVDOM$ = isolateSink(heightSinks.DOM, '.height');

  const vdom$ =
    xs.combine(weightVDOM$, heightVDOM$).map(([weightVDOM, heightVDOM]) => {
      return div([
        weightVDOM,
        heightVDOM
      ]);
    });
  return {
    DOM: vdom$
  };
}

Cycle.run(main,
  {
    DOM: makeDOMDriver('#app')
  });
