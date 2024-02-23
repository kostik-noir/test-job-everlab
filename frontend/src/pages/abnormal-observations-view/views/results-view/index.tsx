import type { Results, ViewWithUploadNewFileBtn } from '../../types';
import WithAbnormalObservationsView from './with-abnormal-observations-view';
import WithAllNormalObservationsView from './with-normal-observations-view';

interface Props extends ViewWithUploadNewFileBtn {
  results: Results;
}

export default ({ results, onUploadNewFileButtonPressed }: Props) => {
  const { observations } = results;
  const hasAbnormalObservations = observations.length > 0;

  return (
    <>
      {
        hasAbnormalObservations
        &&
        <WithAbnormalObservationsView
          results={results}
          onUploadNewFileButtonPressed={onUploadNewFileButtonPressed}
        />
      }
      {
        !hasAbnormalObservations
        &&
        <WithAllNormalObservationsView
          onUploadNewFileButtonPressed={onUploadNewFileButtonPressed}
        />
      }
    </>
  );
}
