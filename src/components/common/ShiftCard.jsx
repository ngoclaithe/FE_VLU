import React, { useState, useEffect } from 'react';
import { descriptionToTime } from '../../services/shiftUtils';
import ShiftContextMenu from './ShiftContextMenu';

const ShiftCard = ({ day, shifts, fullDate, onRightClick }) => {
  const [contextMenuPosition, setContextMenuPosition] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [hoveredShift, setHoveredShift] = useState(null);
  const [activeContextMenu, setActiveContextMenu] = useState(null); 
  
  const handleRightClick = (e, shift) => {
    e.preventDefault();
    if (activeContextMenu === shift.id) {
      setActiveContextMenu(null);
    } else {
      setActiveContextMenu(shift.id);
      setSelectedShift(shift);
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest('.context-menu') === null) {
        setActiveContextMenu(null); 
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div
      className="bg-green-100 shadow-lg rounded-lg p-4 border border-gray-200 flex flex-col relative min-h-[200px] hover:bg-gray-50 transition-all duration-300"
      onClick={(e) => {
        setActiveContextMenu(null); 
      }}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4 truncate">Ngày {day}</h3>

      <div className="flex-grow space-y-3 overflow-hidden">
        {shifts.map((shift) => {
          const isRegistered = shift.registered;
          return (
            <div
              key={shift.id}
              className={`mb-3 cursor-pointer ${hoveredShift === shift.id ? 'bg-gray-100' : ''}`}
              onContextMenu={(e) => handleRightClick(e, shift)}
              onMouseEnter={() => setHoveredShift(shift.id)}
              onMouseLeave={() => setHoveredShift(null)}
            >
              <p className="text-sm text-gray-600 truncate">
                Ca trực: {descriptionToTime[shift.description] || "Không có thông tin"}
                {isRegistered && (
                  <span className="font-bold italic text-red-600"> (Đã gửi yêu cầu)</span>
                )}
              </p>
            </div>
          );
        })}
      </div>

      {activeContextMenu && selectedShift && (
        <div
          className="fixed context-menu z-50" 
          style={{
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
            zIndex: 9999, 
          }}
        >
          <ShiftContextMenu
            shift={{ ...selectedShift, day: day }}
            position={contextMenuPosition}
            onRegister={onRightClick}
            onDelete={onRightClick}
            onClose={() => setActiveContextMenu(null)} 
          />
        </div>
      )}
    </div>
  );
};

export default ShiftCard;
