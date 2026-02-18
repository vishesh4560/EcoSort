
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera as CameraIcon, Loader2, CheckCircle2, AlertCircle, X, Key, Database } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { ClassificationResult, User } from '../types';
import { db } from '../services/db';
import { reportWebcamError } from '../services/errorReporting';

interface ScannerProps {
  user: User | null;
}

const Scanner: React.FC<ScannerProps> = ({ user }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [needsApiKey, setNeedsApiKey] = useState(false);
  const [showDbFix, setShowDbFix] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const checkKeyStatus = async () => {
      // @ts-ignore
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          setNeedsApiKey(true);
        }
      }
    };
    checkKeyStatus();
    
    return () => {
      stopCamera();
    };
  }, []);

  const handleOpenKeyDialog = async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setNeedsApiKey(false);
      setError(null);
      if (image) classifyWaste(image);
    }
  };

  const startCamera = async () => {
    setError(null);
    setShowDbFix(false);
    setIsCameraOpen(true);
    setIsCameraReady(false);
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser does not support camera access.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
        };
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      
      // Automatically report the error to the backend
      await reportWebcamError(err);

      let errorMsg = "Camera access denied. Please check your browser settings.";
      if (err.name === 'NotFoundError') errorMsg = "No camera found on this device.";
      if (err.name === 'NotAllowedError') errorMsg = "Camera permission was denied.";
      if (err.name === 'NotReadableError') errorMsg = "Camera is currently in use by another application.";
      
      setError(errorMsg);
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
    setIsCameraReady(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && isCameraReady) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setImage(dataUrl);
        stopCamera();
        classifyWaste(dataUrl);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File too large (Max 5MB).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImage(dataUrl);
        classifyWaste(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const classifyWaste = async (dataUrl: string) => {
    setLoading(true);
    setResult(null);
    setError(null);
    setShowDbFix(false);

    try {
      const mimeTypeMatch = dataUrl.match(/^data:(image\/[a-zA-Z]+);base64,/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';
      const base64Data = dataUrl.split(',')[1];

      if (!base64Data) throw new Error("Invalid image data captured.");

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: mimeType, data: base64Data } },
            { text: "Identify the waste item in this image. Categorize it as exactly one of: Organic, Recyclable, Hazardous, or General. Return your response as a valid JSON object." }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              item: { type: Type.STRING },
              category: { type: Type.STRING, description: "Must be: Organic, Recyclable, Hazardous, or General" },
              confidence: { type: Type.NUMBER },
              instructions: { type: Type.STRING }
            },
            required: ["item", "category", "confidence", "instructions"]
          }
        }
      });

      const rawText = response.text;
      if (!rawText) throw new Error("Empty response from AI.");

      const jsonStart = rawText.indexOf('{');
      const jsonEnd = rawText.lastIndexOf('}') + 1;
      if (jsonStart === -1 || jsonEnd === 0) throw new Error("Invalid JSON format in AI response.");
      
      const cleanJsonStr = rawText.substring(jsonStart, jsonEnd);
      const data = JSON.parse(cleanJsonStr) as ClassificationResult;
      
      setResult(data);

      if (user) {
        try {
          await db.saveScan({
            item: data.item,
            category: data.category,
            confidence: data.confidence,
            instructions: data.instructions,
            userId: user.id
          });
        } catch (dbErr: any) {
          console.error("Database Save Error:", dbErr);
          if (dbErr.message.includes("DB_SCHEMA_ERROR") || dbErr.message.includes("cache")) {
            setShowDbFix(true);
          }
        }
      }
    } catch (err: any) {
      console.error("Classification Error Details:", err);
      
      const errMsg = err.message || "";
      if (errMsg.includes("Requested entity was not found") || errMsg.includes("401") || errMsg.includes("403") || errMsg.includes("API key")) {
        setNeedsApiKey(true);
        setError("Invalid API key. Please re-configure with a paid project key.");
      } else {
        setError("Failed to classify image. Ensure the item is clearly visible and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setShowDbFix(false);
    stopCamera();
  };

  return (
    <section className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Scan Your Waste</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Get instant AI identification and disposal guidance for any waste item.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="bg-gray-900/50 border-2 border-dashed border-gray-800 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[450px] transition-all hover:border-green-500/50 relative overflow-hidden">
            
            {needsApiKey ? (
              <div className="text-center p-6 flex flex-col items-center">
                <div className="bg-orange-500/10 p-6 rounded-full mb-6 inline-block">
                  <Key className="w-12 h-12 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">API Key Required</h3>
                <p className="text-gray-400 mb-8 max-w-xs">AI scanning requires a Gemini API key from a paid GCP project.</p>
                <button 
                  onClick={handleOpenKeyDialog}
                  className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-orange-900/20 mb-4"
                >
                  Configure API Key
                </button>
              </div>
            ) : isCameraOpen ? (
              <div className="w-full h-full flex flex-col items-center">
                <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl mb-6">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  {!isCameraReady && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                      <Loader2 className="w-10 h-10 text-green-500 animate-spin mb-2" />
                    </div>
                  )}
                  <button onClick={stopCamera} className="absolute top-4 right-4 bg-black/50 hover:bg-black p-2 rounded-full text-white z-10">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <button 
                  onClick={capturePhoto} 
                  disabled={!isCameraReady}
                  className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all"
                >
                  Capture Photo
                </button>
              </div>
            ) : image ? (
              <div className="w-full h-full relative group">
                <img src={image} alt="Target" className="w-full h-[350px] object-cover rounded-2xl shadow-2xl" />
                {!loading && (
                  <button onClick={reset} className="absolute top-4 right-4 bg-red-600/90 hover:bg-red-500 p-2 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-gray-800 p-6 rounded-full mb-6 inline-block">
                  <Upload className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Identify Waste</h3>
                <p className="text-gray-400 mb-8">Drop an image or use your camera</p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                  <button onClick={() => fileInputRef.current?.click()} className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold border border-gray-700">
                    Browse Files
                  </button>
                  <button onClick={startCamera} className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg">
                    Use Camera
                  </button>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 min-h-[450px] flex flex-col shadow-xl">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              AI Analysis
              {result && <CheckCircle2 className="w-6 h-6 ml-2 text-green-500" />}
            </h3>

            {loading ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center">
                <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
                <p className="text-xl font-medium">Analyzing material composition...</p>
              </div>
            ) : result ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Item</p>
                    <p className="text-xl font-bold">{result.item}</p>
                  </div>
                  <div className={`p-4 rounded-2xl border ${
                    result.category === 'Organic' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                    result.category === 'Recyclable' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                    result.category === 'Hazardous' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                    'bg-blue-500/10 border-blue-500/20 text-blue-400'
                  }`}>
                    <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Category</p>
                    <p className="text-xl font-bold">{result.category}</p>
                  </div>
                </div>

                <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Instructions</p>
                  <p className="text-gray-300 leading-relaxed text-sm">{result.instructions}</p>
                </div>

                {showDbFix && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-400">
                    <div className="flex items-center font-bold mb-2">
                      <Database className="w-3 h-3 mr-2" /> Database Help
                    </div>
                    Scan identified but history saving failed. Column 'user_id' not found in your Supabase 'scans' table. Run the SQL repair script.
                  </div>
                )}

                <button onClick={reset} className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-bold">
                  Analyze Another
                </button>
              </div>
            ) : error ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-red-500/5 border border-red-500/20 rounded-2xl">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-gray-400 text-sm leading-relaxed">{error}</p>
                <button onClick={reset} className="mt-6 text-green-500 font-bold hover:underline">Try Again</button>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center opacity-40">
                <p className="text-gray-400">Waiting for input...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Scanner;
