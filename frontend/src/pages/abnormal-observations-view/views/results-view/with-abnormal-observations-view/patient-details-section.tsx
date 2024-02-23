import SectionHeader from './section-header';
import { GENDERS } from '../constants';
import { ChangeEvent } from 'react';
import SectionContent from './section-content';

interface Props {
  className?: string;
  gender: string,
  onGenderSelected: (v: string) => void,
  age: number | string,
  onAgeSelected: (v: string | number) => void
}

export default function PatientDetailsSection(props: Props) {
  const {
    className: extraClassName = '',
    gender,
    onGenderSelected,
    age,
    onAgeSelected

  } = props;

  const className = [
    extraClassName
  ].join(' ');

  const handleGenderSelection = (event: ChangeEvent<HTMLSelectElement>) => {
    onGenderSelected(event.target.value);
  };

  const handleAgeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const v = event.target.value;

    if (v === '') {
      onAgeSelected('');
      return;
    }

    let newAge = parseInt(v, 10);
    if (isNaN(newAge)) {
      onAgeSelected('');
      return;
    }

    newAge = Math.max(0, Math.min(150, newAge));
    onAgeSelected(newAge);
  };

  return (
    <div className={className}>
      <SectionHeader title="Patient details"/>

      <SectionContent>
        <div className="text-lg font-bold my-2">Clarify patient details:</div>

        <div className="flex justify-between gap-4 box-border pl-4 w-48 mb-1">
          <div>Gender:</div>
          <select value={gender} onChange={handleGenderSelection} className="w-24">
            <option value={GENDERS.ANY}>Any</option>
            <option value={GENDERS.MAN}>Man</option>
            <option value={GENDERS.FEMALE}>Female</option>
          </select>
        </div>

        <div className="flex justify-between gap-4 box-border pl-4 w-48">
          <div>Age:</div>
          <input type="number" min="0" max="200" value={age} onChange={handleAgeChange} className="w-24"/>
        </div>
      </SectionContent>
    </div>
  );
}
