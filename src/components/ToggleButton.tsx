import { useState } from 'react';

const ToggleButton = ({
  initialState,
  onToggle,
}: {
  initialState: boolean;
  onToggle: () => void;
}) => {
  const [isOn, setIsOn] = useState(initialState);

  const handleToggle = () => {
    setIsOn(!isOn);
    onToggle();
  };

  return (
    <div
      onClick={handleToggle}
      className={`scale-75 w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
        isOn ? 'bg-hotPink' : 'bg-gray-300'
      }`}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
          isOn ? 'translate-x-6' : 'translate-x-0'
        }`}
      ></div>
    </div>
  );
};

export default ToggleButton;
