   <div className="grid grid-cols-1 gap-6 mb-6">
  {Object.keys(dropdownOptions).map((key) => (
    <div
      key={key}
      className="flex items-center justify-between w-full border-b border-gray-300 py-3"
    >
      {/* Label Section */}
      <label className="text-lg font-semibold capitalize text-gray-800">
        {key}
      </label>
      {/* Button Section */}
      <button
        className="px-4 py-2 bg-white border-b border-gray-300text-white text-sm font-medium rounded shadow hover:bg-blue-600 transition-all"
        onClick={() => openModal(key)}
      >
        {selectedOptions[key]?.label || `Select ${key}`}
      </button>
    </div>
  ))}
</div>