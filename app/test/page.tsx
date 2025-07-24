export default function TestPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="p-8">
        <h1 className="text-4xl font-bold text-white mb-4">Tailwind CSS v4 Test</h1>
        <p className="text-lg text-gray-300 mb-4">Testing if Tailwind utilities work</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-red-500 p-4 rounded">Red Box</div>
          <div className="bg-green-500 p-4 rounded">Green Box</div>
          <div className="bg-blue-500 p-4 rounded">Blue Box</div>
        </div>
        <button className="mt-8 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
          Test Button
        </button>
      </div>
    </div>
  );
}