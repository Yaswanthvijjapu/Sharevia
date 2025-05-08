// App.tsx
// Removed unused React import

const App = () => {
  const tailwindVersion = "4.1.0"; // Set manually after checking from package.json

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
      <h1 className="text-3xl font-bold mb-4">Tailwind Version Checker</h1>
      <p className="text-xl">Current Tailwind CSS version: <strong>{tailwindVersion}</strong></p>
    </div>
  );
};

export default App;
