import { useState } from 'react';
import FileSelectionView from './views/file-selection-view';
import ResultsView from './views/results-view';
import ErrorView from './views/error-view';

enum State {
  FILE_SELECTION,
  RESULTS_VIEWER,
  ERROR
}

import type { Results } from './types';

export default () => {
  const [state, setState] = useState<State>(State.FILE_SELECTION);
  const [results, setResults] = useState<Results | null>(null);

  const onDataReceived = (data: Results) => {
    setResults(data);
    setState(State.RESULTS_VIEWER);
  };

  const onDataFetchFailed = () => {
    setState(State.ERROR);
  };

  const onUploadNewFileButtonPressed = () => {
    setState(State.FILE_SELECTION);
  };

  return (
    <>
      {state === State.FILE_SELECTION
        && <FileSelectionView onSuccess={onDataReceived} onFail={onDataFetchFailed}/>}
      {state === State.RESULTS_VIEWER
        && <ResultsView results={results!} onUploadNewFileButtonPressed={onUploadNewFileButtonPressed}/>}
      {state === State.ERROR
        && <ErrorView onUploadNewFileButtonPressed={onUploadNewFileButtonPressed}/>}
    </>
  )
}
