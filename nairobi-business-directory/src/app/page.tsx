import BusinessSearch from '@/components/BusinessSearch'
import BusinessList from '@/components/BusinessList'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Nairobi Business Directory
        </h1>
        <BusinessSearch />
        <BusinessList />
      </div>
    </main>
  )
}
