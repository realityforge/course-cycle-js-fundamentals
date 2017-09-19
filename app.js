const { h1, h4, a, button, div, makeDOMDriver } = CycleDOM;
const { makeHTTPDriver } = CycleHTTPDriver;

function main(sources) {
  //button click
  const getEvent$ = sources.DOM.select('.get-first').events('click');

  //send rest request
  const request$ = getEvent$.map(e => (
    // Prepare data representing a request
    {
      url: 'https://jsonplaceholder.typicode.com/users/1',
      method: 'GET',
      // This is an arbitrary label so can be referenced later
      category: 'user-data'
    }
  ));

  //receive rest response
  const response$ = sources.HTTP
                           // Reference category from above
                           .select('user-data')
                           .flatten()
                           //get json data out of body
                           .map(response => response.body);

  // display data
  const virtualDom$ = response$.startWith({}).map(response =>
    div([
      button('.get-first', 'Get First User'),
      div('.user-details', [
        h1('.user-name', response.name),
        h4('.user-email', response.email),
        a('.user-website', { attrs: { href: response.website } }, response.website)
      ])
    ])
  );
  return {
    DOM: virtualDom$,
    HTTP: request$
  };
}

Cycle.run(main, { DOM: makeDOMDriver('#app'), HTTP: makeHTTPDriver() });
