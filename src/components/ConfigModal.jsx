import React, { useState } from 'react';

const ConfigModal = ({ isOpen, onClose, config, onSave }) => {
  const [localConfig, setLocalConfig] = useState(config);

  const handleTeamMemberChange = (index, value) => {
    const newTeamMembers = [...localConfig.teamMembers];
    newTeamMembers[index] = value;
    setLocalConfig({ ...localConfig, teamMembers: newTeamMembers });
  };

  const addTeamMember = () => {
    setLocalConfig({
      ...localConfig,
      teamMembers: [...localConfig.teamMembers, '']
    });
  };

  const removeTeamMember = (index) => {
    const newTeamMembers = localConfig.teamMembers.filter((_, i) => i !== index);
    setLocalConfig({ ...localConfig, teamMembers: newTeamMembers });
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(localConfig);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Plan Configuration</h2>
        <form onSubmit={handleSave}>
          {/* Project Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Project Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Title</label>
                <input
                  type="text"
                  value={localConfig.title}
                  onChange={(e) => setLocalConfig({ ...localConfig, title: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target Date</label>
                <input
                  type="datetime-local"
                  value={localConfig.targetDate}
                  onChange={(e) => setLocalConfig({ ...localConfig, targetDate: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Team Members</h3>
            <div className="space-y-2">
              {localConfig.teamMembers.map((member, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={member}
                    onChange={(e) => handleTeamMemberChange(index, e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Team member name"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeTeamMember(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTeamMember}
                className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Team Member
              </button>
            </div>
          </div>

          {/* Display Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Display Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Color Theme</label>
                <select
                  value={localConfig.theme}
                  onChange={(e) => setLocalConfig({ ...localConfig, theme: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="default">Default</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localConfig.showWeekends}
                  onChange={(e) => setLocalConfig({ ...localConfig, showWeekends: e.target.checked })}
                  id="showWeekends"
                />
                <label htmlFor="showWeekends" className="text-sm font-medium">Show Weekends</label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigModal;
