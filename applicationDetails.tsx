import { Input, withLabel } from '@demystdata/anz-gobiz-ui-components';
import { useMachine } from '@xstate/react';
import { assign, createMachine, sendParent } from 'xstate';

import { assetFinanceTheme } from '../../../theme';
import { Title } from './Title';

enum ApplicantDetailsState {
  Initial = 'initial',
  InProgress = 'inProgress',
  Completed = 'completed',
}

type ApplicantDetailsContext = {
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  businessEmail: string;
  mobilePhoneNumber: string;
};

// Define the state machine
export const applicantDetailsMachine = createMachine(
  {
    id: 'applicantDetails',
    initial: ApplicantDetailsState.Initial,
    context: {
      title: '',
      firstName: '',
      middleName: '',
      lastName: '',
      businessEmail: '',
      mobilePhoneNumber: '',
    } as ApplicantDetailsContext,
    states: {
      [ApplicantDetailsState.Initial]: {
        on: {
          FIELD_CHANGED: {
            target: ApplicantDetailsState.InProgress,
            actions: 'assignFieldValue',
          },
        },
      },
      [ApplicantDetailsState.InProgress]: {
        always: [
          {
            target: ApplicantDetailsState.Completed,
            guard: 'areAllFieldsPopulated',
          },
        ],
        on: {
          FIELD_CHANGED: {
            actions: 'assignFieldValue',
          },
        },
      },
      [ApplicantDetailsState.Completed]: {
        entry: 'childCompleted',
        /*on: {
          FIELD_CHANGED: {
            target: ApplicantDetailsState.Completed,
            actions: 'assignFieldValue',
          },
        }, */
      },
    },
  },
  {
    guards: {
      areAllFieldsPopulated: ({ context }) => {
        // console.log('here');
        return [
          context.title,
          context.firstName,
          context.middleName,
          context.lastName,
          context.businessEmail,
          context.mobilePhoneNumber,
        ].every(Boolean);
      },
    },
    actions: {
      assignFieldValue: assign(({ event }) => {
        return { [event.field]: event.value };
      }),
      childCompleted: sendParent({
        type: 'applicationDetails.completed',
      }),
    },
  },
);

const FirstNameInput = withLabel(Input, {
  id: 'firstName',
  label: 'First name',
  theme: assetFinanceTheme.primary.label!,
});

const MiddleNameInput = withLabel(Input, {
  id: 'middleName',
  label: 'Middle name(s)',
  theme: assetFinanceTheme.primary.label!,
});

const LastNameInput = withLabel(Input, {
  id: 'lastName',
  label: 'Last name',
  theme: assetFinanceTheme.primary.label!,
});

const BusinessEmailInput = withLabel(Input, {
  id: 'businessEmail',
  label: 'Business email',
  theme: assetFinanceTheme.primary.label!,
});

const MobilePhoneInput = withLabel(Input, {
  id: 'mobilePhoneNumber',
  label: 'Mobile phone number',
  theme: assetFinanceTheme.primary.label!,
});

export function ApplicantDetails() {
  const [state, send] = useMachine(applicantDetailsMachine, { devTools: true });
  const { title, firstName, middleName, lastName, mobilePhoneNumber, businessEmail } = state.context;
  const handleChange = (field: string) => (nextValue: string) => {
    send({ type: 'FIELD_CHANGED', field, value: nextValue });
  };

  return (
    <>
      <div className="container mx-auto w-[488px] mt-14 space-y-8">
        <Title selectedTitle={title} onChange={handleChange('title')} />
        <p>
          <FirstNameInput
            ariaLabel="First name"
            placeHolder=""
            theme={assetFinanceTheme.primary.input!}
            type="text"
            value={firstName}
            onChange={handleChange('firstName') as any}
          />
        </p>
        <p>
          <MiddleNameInput
            ariaLabel="Middle name(s)"
            placeHolder=""
            theme={assetFinanceTheme.primary.input!}
            type="text"
            value={middleName}
            onChange={handleChange('middleName') as any}
          />
        </p>
        <p>
          <LastNameInput
            ariaLabel="Last name"
            placeHolder=""
            theme={assetFinanceTheme.primary.input!}
            type="text"
            value={lastName}
            onChange={handleChange('lastName') as any}
          />
        </p>
        <p>
          <BusinessEmailInput
            ariaLabel="Business email"
            placeHolder=""
            theme={assetFinanceTheme.primary.input!}
            type="email"
            value={businessEmail}
            onChange={handleChange('businessEmail') as any}
          />
        </p>
        <p>
          <MobilePhoneInput
            ariaLabel="Mobile phone number"
            placeHolder=""
            theme={assetFinanceTheme.primary.input!}
            type="text"
            value={mobilePhoneNumber}
            onChange={handleChange('mobilePhoneNumber') as any}
          />
        </p>
      </div>
    </>
  );
}
