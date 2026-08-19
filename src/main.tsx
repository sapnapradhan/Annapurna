import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught runtime error in Annapurna:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#12100F] text-amber-100 flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
          <div className="w-16 h-16 rounded-full bg-[#C86D44] text-white flex items-center justify-center font-bold text-2xl shadow-xl">
            A
          </div>
          <h1 className="text-3xl font-bold font-serif text-white">ANNAPURNA</h1>
          <p className="text-sm text-slate-300 max-w-md">
            The platform encountered a temporary loading issue. Click below to reload the campus operations hub.
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="px-6 py-3 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-widest shadow-xl transition-all cursor-pointer"
          >
            Reload Annapurna Platform
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
