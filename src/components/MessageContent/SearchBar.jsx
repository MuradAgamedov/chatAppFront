const SearchBar = ({ value, onChange }) => (
  <div className="p-2 bg-white">
    <input
      type="text"
      placeholder="Mesajlarda axtar..."
      value={value}
      onChange={onChange}
      className="w-full border px-3 py-1 rounded text-sm"
    />
  </div>
);
export default SearchBar;