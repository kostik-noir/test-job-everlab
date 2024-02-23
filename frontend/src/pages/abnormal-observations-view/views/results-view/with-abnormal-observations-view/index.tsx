import { useState } from 'react';
import { GENDERS } from '../constants';
import UploadNewFileBtn from '../../upload-new-file-btn';
import PatientDetailsSection from './patient-details-section';
import ObservationsSection from './oservations-section';
import { Observation, Results } from '../../../types';
import { SubViewBaseProps } from '../constants';

interface Props extends SubViewBaseProps {
  results: Results;
}

export default function WithAbnormalObservationsView({ results, onUploadNewFileButtonPressed }: Props) {
  const { observations } = results;

  const [gender, setGender] = useState<string>(GENDERS.ANY);
  const [age, setAge] = useState<number | string>(0);

  const observationsToRender: Observation[] = filterObservations(observations, age, gender);

  return (
    <div className="p-4 box-border">
      <div className="flex justify-between">
        <div className="text-4xl font-bold">Abnormal observations</div>
        <UploadNewFileBtn onClick={onUploadNewFileButtonPressed}/>
      </div>
      <PatientDetailsSection
        className="my-4 border-b-2 border-slate-400"
        gender={gender}
        onGenderSelected={setGender}
        age={age}
        onAgeSelected={setAge}
      />
      <ObservationsSection
        className="my-4"
        observations={observationsToRender}
      />
    </div>
  );
}

function filterObservations(observations: Observation[], age: number | string, gender: string) {
  return observations
    .filter((observation: Observation) => observation.gender === GENDERS.ANY || observation.gender === gender)
    .filter((observation: Observation) => {
      const numericAge = parseInt(`${age}`, 10);

      if (age === '' || isNaN(numericAge)) {
        return true;
      }

      return numericAge >= observation.minAge && numericAge <= observation.maxAge;
    });
}
