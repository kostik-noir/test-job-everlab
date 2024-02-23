import SectionHeader from './section-header';
import type { Observation } from '../../../types';
import SectionContent from './section-content';

interface Props {
  className?: string;
  observations: Observation[]
}

export default function ObservationsSection(props: Props) {
  const {
    className: extraClassName = '',
    observations
  } = props;

  const className = [
    extraClassName
  ].join(' ');

  return (
    <div className={className}>
      <SectionHeader title="Observations"/>

      <SectionContent>
        {
          observations.map((data, index) => <ObservationItem data={data} key={index}/>)
        }
      </SectionContent>
    </div>
  );
}

function ObservationItem({ data }: { data: Observation }) {
  return (
    <div className="py-2 box-border border-b-2 border-slate-200">
      <div className="text-lg font-bold mb-4">{data.name}</div>

      <div><span className="font-bold">Value:</span> {data.value} {data.unit}</div>

      <div><span
        className="font-bold">Standard range:</span> {data.standardLower} {data.unit} - {data.standardHigher} {data.unit}
      </div>

      <div><span
        className="font-bold">Everlab range:</span> {data.everlabLower} {data.unit} - {data.everlabHigher} {data.unit}
      </div>

      <div>
        <div className="font-bold">Diagnostics:</div>
        <ul className="list-disc list-inside ml-4">
          {data.diagnostics.map((diagnostic, index) => <li key={index}>{diagnostic}</li>)}
        </ul>
      </div>

      {
        data.conditions.length > 0 && (
          <div>
            <div className="font-bold">Conditions:</div>
            <ul className="list-disc list-inside ml-4">
              {data.conditions.map((condition, index) => <li key={index}>{condition}</li>)}
            </ul>
          </div>
        )
      }
    </div>
  );
}
