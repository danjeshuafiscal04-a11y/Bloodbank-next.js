'use client'

import { Smartphone, Info } from 'lucide-react'

export default function InstallAppCard() {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-5 mt-6 transition-transform hover:-translate-y-1 hover:shadow-sm text-stone-900 stagger-4">
      <div className="flex items-center gap-3 mb-2">
        <Smartphone className="text-stone-500" size={24} />
        <h3 className="font-bold text-lg text-stone-900">Get the App on Your Phone</h3>
      </div>
      
      <p className="text-sm text-stone-600 mb-6 font-medium">
        Run RedCross Blood Bank in fullscreen standalone mode and access features offline.
      </p>

      <div className="bg-white rounded-lg p-4 border border-stone-200 mb-4">
        <div className="flex items-start gap-3">
          <Info className="text-stone-400 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-bold text-stone-900 text-sm">Manual Install Required</p>
            <p className="text-sm text-stone-600 mt-1">
              Your browser doesn't support automatic installation. Follow the steps below:
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-5 border border-stone-200 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone className="text-stone-500" size={18} />
          <p className="font-bold text-stone-900 text-sm">Chrome / Firefox Instructions:</p>
        </div>
        <ol className="list-decimal list-inside text-sm text-stone-600 space-y-3 font-medium">
          <li>Tap the <strong className="text-stone-900 font-bold">3-dots menu</strong> at the top right of your browser.</li>
          <li>Select <strong className="text-stone-900 font-bold">Add to Home screen</strong> or <strong className="text-stone-900 font-bold">Install app</strong>.</li>
        </ol>
      </div>
    </div>
  )
}
