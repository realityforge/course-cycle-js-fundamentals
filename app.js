const { h1, label, input, hr, div, makeDOMDriver } = CycleDOM;

function main(sources) {
  // Define a stream that contains "input" events frin input field
  const inputEvent$ = sources.DOM.select('input.field').events('input');
  // Map the stream to text
  // Make sure we start with a single event so that there is something to map in following section
  const name$ = inputEvent$.map(e => e.target.value).startWith('');
  return {
    DOM: name$.map(name =>
      div([
        label(['Name:']),
        input('.field', { attrs: { type: 'text' } }),
        hr(),
        h1('Hello ' + name)
      ])
    )
  };
}

Cycle.run(main, { DOM: makeDOMDriver('#app') });
