'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-12 text-center bg-white rounded-[32px] border-2 border-dashed border-red-200 shadow-xl shadow-red-500/5 flex flex-col items-center gap-6 group">
          <div className="p-4 bg-red-50 rounded-2xl text-red-500 group-hover:scale-110 transition-transform">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2 uppercase">Interface Interruption</h3>
            <p className="text-sm font-bold text-slate-400 max-w-xs mx-auto">
              We encountered a glitch while rendering this component. Our team has been notified.
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-2 border-2 border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" /> Reset Module
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
