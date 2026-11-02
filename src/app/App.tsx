// trussel: T-Y70497A5J4@1
import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './AppRouter';
import { createServices } from './container';
import type { Services } from './container';
import { ServicesProvider } from './ServicesContext';

// trussel: T-4HZXAJ7HW9@1
export function App(props: { services?: Services }): JSX.Element {
  const [services] = useState(() => props.services ?? createServices());
  return (
    <ServicesProvider services={services}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ServicesProvider>
  );
}
