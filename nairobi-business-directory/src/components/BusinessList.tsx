'use client'

import { useState, useEffect } from 'react'

interface Business {
  id: number
  name: string
  category: string
  address: string
  phone: string
  description: string
}

export default function BusinessList() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch businesses from API
    const mockBusinesses: Business[] = [
      {
        id: 1,
        name: 'Java House Westlands',
        category: 'restaurants',
        address: 'Westlands, Nairobi',
        phone: '+254 20 123 4567',
        description: 'Popular coffee shop chain in Nairobi'
      },
      {
        id: 2,
        name: 'Sarova Stanley Hotel',
        category: 'hotels',
        address: 'Koinange Street, Nairobi CBD',
        phone: '+254 20 765 4321',
        description: 'Luxury hotel in the heart of Nairobi'
      },
      {
        id: 3,
        name: 'Nairobi Hospital',
        category: 'healthcare',
        address: 'Argwings Kodhek Road, Nairobi',
        phone: '+254 20 987 6543',
        description: 'Leading healthcare facility in Kenya'
      }
    ]
    setBusinesses(mockBusinesses)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading businesses...</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {businesses.map((business) => (
        <div key={business.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">{business.name}</h3>
          <p className="text-sm text-blue-600 mb-2 capitalize">{business.category}</p>
          <p className="text-gray-600 mb-2">{business.address}</p>
          <p className="text-gray-600 mb-3">{business.phone}</p>
          <p className="text-gray-700 text-sm">{business.description}</p>
        </div>
      ))}
    </div>
  )
}
