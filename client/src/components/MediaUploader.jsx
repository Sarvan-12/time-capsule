import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const MediaUploader = ({ capsuleId, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!capsuleId) {
      toast.error('Save capsule draft first');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append('media', file);
    });

    try {
      const { data } = await api.post(`/capsules/${capsuleId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Files uploaded successfully');
      onUploadComplete(data.data.media);
      setPreviews([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [capsuleId, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'video/mp4': ['.mp4'],
      'audio/mpeg': ['.mp3'],
      'application/pdf': ['.pdf'],
    }
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-[32px] p-10 text-center cursor-pointer transition-all duration-300 glass bg-white/[0.01] ${
          isDragActive 
            ? 'border-accent-purple bg-accent-purple/5 shadow-2xl shadow-accent-purple/10 scale-[0.99]' 
            : 'border-white/10 hover:border-accent-purple/50 hover:bg-white/[0.03]'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          {uploading ? (
            <Loader2 className="w-12 h-12 text-accent-purple animate-spin mb-4" />
          ) : (
            <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 mb-4 transition-transform ${isDragActive ? 'scale-110' : ''}`}>
              <Upload className={`w-8 h-8 ${isDragActive ? 'text-accent-purple' : 'text-white/20'}`} />
            </div>
          )}
          <p className="text-white/60 font-bold tracking-tight text-lg">
            {isDragActive ? 'Release to Materialize' : 'Atmospheric Upload'}
          </p>
          <p className="text-white/20 text-xs mt-2 font-medium tracking-wide">
            Drag & drop your essence here, or click to browse
          </p>
          <div className="mt-6 flex gap-3 text-[10px] font-black uppercase tracking-widest text-white/10">
             <span>Images</span>
             <span>•</span>
             <span>MP4</span>
             <span>•</span>
             <span>MP3</span>
             <span>•</span>
             <span>PDF</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaUploader;
