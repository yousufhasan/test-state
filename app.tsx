import { useMachine } from '@xstate/react';
import '../styles/main.css';

import { createMachine } from 'xstate';

import { ApplicantDetails } from './pages/ApplicantDetails/ApplicantDetails';
import { applicantDetailsMachine } from './pages/ApplicantDetails/ApplicantDetails';

export const appMachine = createMachine({
  initial: 'applicantDetails',
  id: 'application',
  states: {
    applicantDetails: {
      invoke: {
        id: 'applicantDetails',
        src: applicantDetailsMachine,
        /*  onDone: {
          target: 'assetDetails',
          actions: () => {
            console.log('Received completed event!');
          },
        },*/
      },
      on: {
        'applicationDetails.completed': {
          target: 'assetDetails',
          actions: () => {
            console.log('Received completed event!');
          },
        },
      },
    },
    assetDetails: {},
    loanDetails: {},
    reviewApplication: {},
    completed: {},
    error: {},
  },
});

export function App() {
  const [state] = useMachine(appMachine);
  console.log('appState:', state.value);
  return (
    <div>
      <ApplicantDetails />
    </div>
  );
}
