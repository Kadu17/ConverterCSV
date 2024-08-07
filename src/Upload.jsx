import React, { useState } from 'react';
import Papa from 'papaparse';

const CsvFileUploader = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleFileUpload = () => {
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          onFileUpload(results.data);
        },
        error: (error) => {
          console.error('Error while parsing:', error);
        },
      });
    } else {
      console.log('Nenhum arquivo selecionado');
    }
  };

  return (
    <div className="csv-uploader">
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
    </div>
  );
};

export default CsvFileUploader;