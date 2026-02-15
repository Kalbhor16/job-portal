import { Link2, Github, Linkedin, FolderOpen } from 'lucide-react';

const LinkOption = ({ icon, label, linkType, required, optional, onChange }) => {
  return (
    <div className="flex items-center justify-between p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="text-green-600">{icon}</div>
        <label className="font-medium text-gray-900 cursor-pointer">
          {label}
        </label>
      </div>

      <div className="flex items-center gap-4">
        {/* Required Toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => onChange(linkType, 'required', e.target.checked)}
            className="w-4 h-4 rounded text-green-600 accent-green-600"
          />
          <span className="text-sm text-gray-600">Required</span>
        </label>

        {/* Optional Toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={optional}
            onChange={(e) => onChange(linkType, 'optional', e.target.checked)}
            className="w-4 h-4 rounded text-green-600 accent-green-600"
          />
          <span className="text-sm text-gray-600">Optional</span>
        </label>
      </div>
    </div>
  );
};

const RequiredLinksToggle = ({ requiredLinks, onChange }) => {
  const linkOptions = [
    {
      key: 'portfolio',
      label: 'Portfolio',
      icon: <FolderOpen size={20} />,
    },
    {
      key: 'linkedin',
      label: 'LinkedIn Profile',
      icon: <Linkedin size={20} />,
    },
    {
      key: 'github',
      label: 'GitHub Profile',
      icon: <Github size={20} />,
    },
    {
      key: 'majorProject',
      label: 'Major Project',
      icon: <Link2 size={20} />,
    },
  ];

  return (
    <div className="space-y-3">
      {linkOptions.map((option) => (
        <LinkOption
          key={option.key}
          icon={option.icon}
          label={option.label}
          linkType={option.key}
          required={requiredLinks[option.key]?.required || false}
          optional={requiredLinks[option.key]?.optional || false}
          onChange={onChange}
        />
      ))}

      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm text-green-800">
          <strong>Tip:</strong> Mark links as "Required" or "Optional" so candidates know what to provide. You can choose both for flexibility.
        </p>
      </div>
    </div>
  );
};

export default RequiredLinksToggle;
