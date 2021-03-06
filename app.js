const { h4, div, label, input, makeDOMDriver } = CycleDOM;
const isolate = CycleIsolate.default;

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
  }).flatten().remember();
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
    DOM: virtualDom$,
    value: state$.map(state => state.value)
  };
}

function main(sources) {
  const weightProps$ = xs.of({
    label: 'Weight',
    units: 'kg',
    min: 40,
    max: 150,
    initial: 40
  });

  const weightSlider = isolate(labeledSlider, '.weight');
  const weightSinks = weightSlider(Object.assign({}, sources, { props: weightProps$ }));
  const heightProps$ = xs.of({
    label: 'Height',
    units: 'cm',
    min: 140,
    max: 220,
    initial: 140
  });
  const heightSlider = isolate(labeledSlider, '.height');
  const heightSinks = heightSlider(Object.assign({}, sources, { props: heightProps$ }));

  const bmi$ =
    xs.combine(weightSinks.value, heightSinks.value).map(
      ([weight, height]) => {
        const heightInMeters = height * 0.01;
        return Math.round(weight / (heightInMeters * heightInMeters));
      });

  const vdom$ =
    xs.combine(bmi$, weightSinks.DOM, heightSinks.DOM).map(
      ([bmi, weightVDOM, heightVDOM]) => {
        return div([
          weightVDOM,
          heightVDOM,
          h4('BMI ' + bmi)
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
