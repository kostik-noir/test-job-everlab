import UploadNewFileBtn from './upload-new-file-btn';
import type { ViewWithUploadNewFileBtn } from '../types';

export default ({ onUploadNewFileButtonPressed }: ViewWithUploadNewFileBtn) => {
  return (
    <div className="box-border p-4 flex flex flex-col items-center">
      <div className="mb-4">Something went wrong</div>
      <UploadNewFileBtn onClick={onUploadNewFileButtonPressed}/>
    </div>
  );
}
