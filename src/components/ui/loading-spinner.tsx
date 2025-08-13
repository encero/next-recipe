export function LoadingSpinner() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex flex-col justify-center items-center py-20">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <div className="text-center">
          <p className="text-gray-600 text-lg font-medium">Loading...</p>
          <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
        </div>
      </div>
    </div>
  )
}
