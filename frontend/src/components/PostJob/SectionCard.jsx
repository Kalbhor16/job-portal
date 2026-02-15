const SectionCard = ({ title, icon, description, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-100">
        <div className="flex items-center gap-3">
          <div className="text-green-600">{icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {description && <p className="text-sm text-gray-600">{description}</p>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">{children}</div>
    </div>
  );
};

export default SectionCard;
