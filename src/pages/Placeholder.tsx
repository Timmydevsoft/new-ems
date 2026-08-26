import React from 'react';

export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{title}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">This page is under construction.</p>
        </div>
      </div>
    </div>
  );
}
