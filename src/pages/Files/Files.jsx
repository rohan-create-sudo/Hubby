import React, { useEffect, useState, useRef } from 'react';
import {
  collection, query, where, onSnapshot,
  addDoc, serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import {
  UploadCloud, FileText, Image as ImgIcon,
  File, Download, Files as FilesIcon
} from 'lucide-react';

const getFileIcon = (name = '') => {
  const ext = name.split('.').pop().toLowerCase();
  if (['jpg','jpeg','png','gif','webp','svg'].includes(ext)) return <ImgIcon size={18} />;
  if (ext === 'pdf') return <FileText size={18} />;
  return <File size={18} />;
};

const getFileIconClass = (name = '') => {
  const ext = name.split('.').pop().toLowerCase();
  if (['jpg','jpeg','png','gif','webp','svg'].includes(ext)) return 'file-icon-img';
  if (ext === 'pdf') return 'file-icon-pdf';
  return 'file-icon-misc';
};

const Files = () => {
  const { currentUser, userProfile } = useAuth();
  const [projects, setProjects] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedProject, setSelectedProject] = useState('');
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef();

  const field = userProfile?.role === 'client' ? 'clientId' : 'freelancerId';

  // Load projects
  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'projects'), where(field, '==', currentUser.uid));
    return onSnapshot(q, snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProjects(list);
      if (list.length > 0 && !selectedProject) setSelectedProject(list[0].id);
    });
  }, [currentUser, field]);

  // Load files for selected project
  useEffect(() => {
    if (!selectedProject) { setFiles([]); setLoading(false); return; }
    const q = query(collection(db, 'files'), where('projectId', '==', selectedProject));
    return onSnapshot(q, snap => {
      setFiles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, [selectedProject]);

  const handleUpload = (file) => {
    if (!file || !selectedProject) return;
    setUploading(true);
    const storageRef = ref(storage, `projects/${selectedProject}/${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(storageRef, file);
    task.on('state_changed',
      snap => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      err => { console.error(err); setUploading(false); },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        await addDoc(collection(db, 'files'), {
          projectId: selectedProject,
          fileName: file.name,
          fileUrl: url,
          fileSize: file.size,
          uploadedBy: currentUser.uid,
          uploaderName: userProfile?.name || 'User',
          createdAt: serverTimestamp(),
        });
        setUploading(false);
        setProgress(0);
      }
    );
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const formatSize = (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes/1024).toFixed(1)} KB`;
    return `${(bytes/1048576).toFixed(1)} MB`;
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Files</h1>
            <p className="page-subtitle">Manage project files and assets</p>
          </div>
          {projects.length > 0 && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <select className="input" style={{ width: 'auto' }} value={selectedProject}
                onChange={e => setSelectedProject(e.target.value)}>
                {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
              <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                <UploadCloud size={16} /> Upload
              </button>
              <input ref={fileInputRef} type="file" hidden onChange={e => handleUpload(e.target.files[0])} />
            </div>
          )}
        </div>
      </div>

      {/* Drop Zone */}
      <div
        className={`drop-zone${dragging ? ' dragging' : ''}`}
        style={{ marginBottom: 24 }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="drop-zone-icon">
          <UploadCloud size={26} />
        </div>
        {uploading ? (
          <>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>Uploading… {progress}%</p>
            <div style={{ width: '60%', maxWidth: 300, background: 'var(--border)', borderRadius: 99, height: 6, margin: '0 auto' }}>
              <div style={{ height: '100%', borderRadius: 99, background: 'var(--primary)', width: `${progress}%`, transition: 'width .3s' }} />
            </div>
          </>
        ) : (
          <>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>Click or drag & drop to upload</p>
            <p style={{ fontSize: '.8125rem', color: 'var(--text-muted)' }}>PDF, PNG, JPG, DOC and more · Max 50MB</p>
          </>
        )}
      </div>

      {/* Files Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Uploaded Files</span>
          <span style={{ fontSize: '.8125rem', color: 'var(--text-muted)' }}>{files.length} file{files.length !== 1 ? 's' : ''}</span>
        </div>
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : files.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FilesIcon size={28} /></div>
            <div className="empty-state-title">No files yet</div>
            <div className="empty-state-desc">Upload files to this project using the area above.</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Uploaded By</th>
                  <th>Size</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {files.map(f => (
                  <tr key={f.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className={`file-icon-wrap ${getFileIconClass(f.fileName)}`}>
                          {getFileIcon(f.fileName)}
                        </div>
                        <span style={{ fontWeight: 500 }}>{f.fileName}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '.8125rem' }}>{f.uploaderName}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '.8125rem' }}>{formatSize(f.fileSize)}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '.8125rem' }}>
                      {f.createdAt?.toDate ? f.createdAt.toDate().toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <a href={f.fileUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', gap: 5 }}>
                        <Download size={14} /> Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Files;
