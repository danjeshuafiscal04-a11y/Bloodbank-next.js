'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal } from 'lucide-react'

export default function InventoryFilterDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentBloodType = searchParams.get('blood_type') || 'all'
  const currentStatus = searchParams.get('status') || 'all'
  const currentSort = searchParams.get('sort') || 'date-desc'

  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']
  const inventoryStatuses = ['Available', 'Expiring Soon', 'Reserved', 'Quarantined']

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`?${params.toString()}`)
  }

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('blood_type')
    params.delete('status')
    params.delete('sort')
    router.push(`?${params.toString()}`)
    setIsOpen(false)
  }

  return (
    <div className="inventory-filter-wrap" ref={dropdownRef}>
      <button 
        className="btn-primary" 
        type="button" 
        data-inventory-filter-toggle
        aria-expanded={isOpen} 
        aria-controls="inventory-filter-menu"
        onClick={() => setIsOpen(!isOpen)}
      >
        <SlidersHorizontal size={16} className="inline-block mr-2" /> Filter
      </button>
      
      <div 
        id="inventory-filter-menu" 
        className="inventory-filter-menu" 
        data-inventory-filter-menu 
        hidden={!isOpen}
      >
        <label className="label" htmlFor="inventory-blood-filter">Blood Type</label>
        <select 
          id="inventory-blood-filter" 
          className="select" 
          data-inventory-blood-filter
          value={currentBloodType}
          onChange={(e) => updateParam('blood_type', e.target.value)}
        >
          <option value="all">All Blood Types</option>
          {bloodTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        
        <label className="label mt-4" htmlFor="inventory-status-filter">Availability</label>
        <select 
          id="inventory-status-filter" 
          className="select" 
          data-inventory-status-filter
          value={currentStatus}
          onChange={(e) => updateParam('status', e.target.value)}
        >
          <option value="all">All Statuses</option>
          {inventoryStatuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        
        <label className="label mt-4" htmlFor="inventory-sort-filter">Sort Records</label>
        <select 
          id="inventory-sort-filter" 
          className="select" 
          data-inventory-sort-filter
          value={currentSort}
          onChange={(e) => updateParam('sort', e.target.value)}
        >
          <option value="date-desc">Collection Date: Newest</option>
          <option value="date-asc">Collection Date: Oldest</option>
          <option value="alpha-asc">A-Z</option>
          <option value="alpha-desc">Z-A</option>
        </select>
        
        <button 
          className="btn-outline mt-4 w-full" 
          type="button" 
          data-inventory-filter-reset
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      </div>
    </div>
  )
}
