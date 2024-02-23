import { SubViewBaseProps } from '../constants';
import UploadNewFileBtn from '../../upload-new-file-btn';

export default function WithAllNormalObservationsView({ onUploadNewFileButtonPressed }: SubViewBaseProps) {
  return (
    <div className="flex flex-col items-center box-border p-4">
      <div className="text-4xl font-bold mb-4">All observations are normal</div>
      <UploadNewFileBtn onClick={onUploadNewFileButtonPressed}/>
    </div>
  );
}
