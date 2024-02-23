import { useRef, useState } from 'react';
import type { Results } from '../types';

interface Props {
  onSuccess: (data: Results) => void;
  onFail: () => void;
}

export default ({ onSuccess, onFail }: Props) => {
  const fileInput = useRef<HTMLInputElement>(null!);
  const [isFileSelected, setIsFileSelected] = useState(false);

  const onFileInputChanged = () => {
    setIsFileSelected(!!fileInput.current.files && fileInput.current.files?.length > 0);
  };

  const onUploadButtonPressed = async () => {
    const data = new FormData();
    data.append('file', fileInput.current.files![0]);

    try {
      const response: Response = await fetch(`http://localhost:${process.env.BACKEND_PUBLIC_PORT}`, {
        method: 'POST',
        body: data
      });
      const resultData = await response.json();
      onSuccess(resultData);
    } catch (e) {
      onFail();
    }
  };

  return (
    <div className="box-border p-4">
      <div>Select .oru or .oru.txt file to upload</div>
      <div className="mt-4">
        <input type="file" accept=".oru,.oru.txt" ref={fileInput} onChange={onFileInputChanged}/>
      </div>
      <div>
        <button type="button" className="btn btn-blue mt-4" onClick={onUploadButtonPressed}
                disabled={!isFileSelected}>Upload
        </button>
      </div>
    </div>
  );
}
