import { useMachine } from '@xstate/react';
import '../styles/main.css';

import { createMachine } from 'xstate';

import { ApplicantDetails } from './pages/ApplicantDetails/ApplicantDetails';
import { applicantDetailsMachine } from './pages/ApplicantDetails/ApplicantDetails';

import { createMachine, assign } from 'xstate';

import { applicantDetailsMachine } from './pages/ApplicantDetails/ApplicantDetails';

export const appMachine = createMachine({
  initial: 'applicantDetails',
  id: 'application',
  invoke: {
    id: 'applicantDetails',
    src: applicantDetailsMachine,
    onSnapshot: {
      actions: assign(({ event }) => {
        console.log(event, 'in snapshot');
        return { applicantDetails: '' };
      }),
    },

    onDone: {
      actions: () => {
        console.log('Received completed event!');
      },
    },
  },
  states: {
    applicantDetails: {
      on: {
        'applicationDetails.completed': {
          target: 'assetDetails',
          actions: args => {
            console.log('Received completed event!', args);
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
