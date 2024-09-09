'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Mic, FileText, FileCheck, Menu, X, Download } from 'lucide-react';

interface UploadResult {
  machine: string;
  audioFile: string;
  transcript: string;
  sop: string;
}

interface UserFile {
  id: number;
  fileName: string;
  fileType: 'sop';
  machineName: string;
  createdAt: string;
  content: string;
}

const translations = {
  it: {
    title: "Convertitore Audio in SOP per Macchine Specifiche",
    instruction: "Seleziona una macchina e clicca il pulsante per iniziare la registrazione. Parla chiaramente per descrivere la procedura che vuoi convertire in SOP.",
    machine1: "Macchina 1",
    machine2: "Macchina 2",
    machine3: "Macchina 3",
    startRecording: "Inizia Registrazione",
    stopRecording: "Ferma Registrazione",
    processing: "Elaborazione...",
    uploadAndProcess: "Carica ed Elabora",
    result: "Risultato Elaborazione",
    machine: "Macchina",
    transcription: "Trascrizione",
    sop: "SOP",
    microphoneError: "Errore nell'accesso al microfono",
    uploadError: "Errore nel caricamento audio",
    uploadFailed: "Caricamento fallito",
    fileHistory: "Cronologia SOP",
    viewSop: "Visualizza SOP",
    closeSop: "Chiudi SOP",
    downloadSop: "Scarica SOP",
  },
  en: {
    title: "Audio to SOP Converter for Specific Machines",
    instruction: "Select a machine and click the button to start recording. Speak clearly to describe the procedure you want to convert into an SOP.",
    machine1: "Machine 1",
    machine2: "Machine 2",
    machine3: "Machine 3",
    startRecording: "Start Recording",
    stopRecording: "Stop Recording",
    processing: "Processing...",
    uploadAndProcess: "Upload and Process",
    result: "Processing Result",
    machine: "Machine",
    transcription: "Transcription",
    sop: "SOP",
    microphoneError: "Error accessing microphone",
    uploadError: "Error uploading audio",
    uploadFailed: "Upload failed",
    fileHistory: "SOP History",
    viewSop: "View SOP",
    closeSop: "Close SOP",
    downloadSop: "Download SOP",
  }
};

const AudioToSopConverter = () => {
  const [language, setLanguage] = useState<'it' | 'en'>('it');
  const [selectedMachine, setSelectedMachine] = useState('Machine_1');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [latestResult, setLatestResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userFiles, setUserFiles] = useState<UserFile[]>([]);
  const [selectedSop, setSelectedSop] = useState<UserFile | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const t = translations[language];

  useEffect(() => {
    fetchUserHistory();
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'it' ? 'en' : 'it');
  };

  const fetchUserHistory = async () => {
    try {
      const response = await fetch('/api/history');
      if (response.ok) {
        const files = await response.json();
        const sopFiles = files.filter((file: UserFile) => file.fileType === 'sop');
        setUserFiles(sopFiles);
      } else {
        console.error('Failed to fetch user history');
      }
    } catch (error) {
      console.error('Error fetching user history:', error);
    }
  };

  const handleStartRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        audioChunksRef.current = [];
        mediaRecorder.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setAudioBlob(audioBlob);
        };

        mediaRecorder.start();
        setIsRecording(true);
        setError(null);
      } catch (error) {
        console.error(t.microphoneError, error);
        setError(t.microphoneError);
      }
    }
  };

  const handleUpload = async () => {
    if (!audioBlob) return;

    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('machine', selectedMachine);
    formData.append('language', language);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();

      if (response.ok) {
        try {
          const result: UploadResult = JSON.parse(responseText);
          setLatestResult(result);
          fetchUserHistory();
        } catch (error) {
          console.error('Error parsing JSON response:', error);
          setError('Error parsing server response');
        }
      } else {
        console.error(t.uploadFailed, response.status, response.statusText);
        setError(`${t.uploadFailed}: ${response.status} ${response.statusText}. ${responseText}`);
      }
    } catch (error) {
      console.error('Error in upload:', error);
      setError(`${t.uploadError}: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
      setAudioBlob(null);
    }
  };

  const handleViewSop = (file: UserFile) => {
    setSelectedSop(file);
    setIsHistoryOpen(false);
  };

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  const handleDownload = (content: string, fileName: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
      {/* Top bar for mobile */}
      <div className="lg:hidden flex justify-between items-center mb-4">
        <button 
          onClick={toggleLanguage} 
          className="px-3 py-1 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 transition duration-300"
        >
          {language === 'it' ? 'EN' : 'IT'}
        </button>
        <button
          onClick={toggleHistory}
          className="px-3 py-1 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 transition duration-300"
        >
          {isHistoryOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* SOP History sidebar */}
      <div className={`lg:w-64 bg-white p-4 border border-gray-200 rounded-lg shadow-md overflow-y-auto ${isHistoryOpen ? 'block' : 'hidden lg:block'}`}>
        <h2 className="text-lg font-semibold mb-4">{t.fileHistory}</h2>
        {userFiles.map((file) => (
          <div key={file.id} className="mb-2 p-2 bg-gray-50 rounded shadow">
            <div className="flex items-center">
              <FileCheck size={16} className="text-blue-500" />
              <span className="ml-2 text-sm truncate">{file.fileName}</span>
            </div>
            <div className="text-xs text-gray-500">{file.machineName}</div>
            <div className="text-xs text-gray-500">{new Date(file.createdAt).toLocaleString()}</div>
            <button
              onClick={() => handleViewSop(file)}
              className="mt-2 text-xs text-blue-500 hover:text-blue-700"
            >
              {t.viewSop}
            </button>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <div className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-800">{t.title}</h1>
            <button 
              onClick={toggleLanguage} 
              className="hidden lg:block px-3 py-1 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 transition duration-300"
            >
              {language === 'it' ? 'EN' : 'IT'}
            </button>
          </div>
          <p className="mb-6 text-gray-600">{t.instruction}</p>
          <div className="space-y-4">
            <div className="relative">
              <select
                className="w-full p-2 border border-gray-300 rounded appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedMachine}
                onChange={(e) => setSelectedMachine(e.target.value)}
              >
                <option value="Machine_1">{t.machine1}</option>
                <option value="Machine_2">{t.machine2}</option>
                <option value="Machine_3">{t.machine3}</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <button
              className="w-full py-2 px-4 rounded font-semibold bg-blue-500 text-white flex items-center justify-center space-x-2 transition duration-300 hover:bg-blue-600"
              onClick={handleStartRecording}
            >
              <Mic size={20} className={`${isRecording ? 'text-red-500 animate-pulse' : 'text-white'}`} />
              <span>{isRecording ? t.stopRecording : t.startRecording}</span>
            </button>
            {audioBlob && (
              <button
                className="w-full py-2 px-4 rounded font-semibold text-white bg-blue-500 hover:bg-blue-600 transition duration-300 flex items-center justify-center space-x-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                onClick={handleUpload}
                disabled={isLoading}
              >
                <FileText size={20} className="text-green-500" />
                <span>{isLoading ? t.processing : t.uploadAndProcess}</span>
              </button>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {latestResult && (
            <div className="mt-8 p-4 border border-gray-200 rounded bg-gray-50">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{t.result}</h2>
              <h3 className="font-semibold text-gray-700">{t.machine}: {latestResult.machine}</h3>
              {latestResult.transcript && (
                <div className="mt-2">
                  <h4 className="font-semibold text-gray-700">{t.transcription}:</h4>
                  <p className="whitespace-pre-wrap text-gray-600">{latestResult.transcript}</p>
                </div>
              )}
              {latestResult.sop && (
                <div className="mt-2">
                  <h4 className="font-semibold text-gray-700">{t.sop}:</h4>
                  <p className="whitespace-pre-wrap text-gray-600">{latestResult.sop}</p>
                  <button
                    onClick={() => handleDownload(latestResult.sop, `SOP_${latestResult.machine}_${new Date().toISOString()}.txt`)}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 transition duration-300 flex items-center"
                  >
                    <Download size={16} className="mr-2" />
                    {t.downloadSop}
                  </button>
                </div>
              )}
            </div>
          )}

          {selectedSop && (
            <div className="mt-8 p-4 border border-gray-200 rounded bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-gray-800">{t.sop}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownload(selectedSop.content, `${selectedSop.fileName}.txt`)}
                    className="px-3 py-1 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 transition duration-300 flex items-center"
                  >
                    <Download size={16} className="mr-2" />
                    {t.downloadSop}
                  </button>
                  <button
                    onClick={() => setSelectedSop(null)}
                    className="px-3 py-1 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 transition duration-300"
                  >
                    {t.closeSop}
                  </button>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-gray-600">{selectedSop.content}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioToSopConverter;