import React, { useState, useEffect } from 'react';
import ShiftContextMenu from './ShiftContextMenu';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const noteToStatusText = {
  'success': 'Đã đăng ký',
  'leave_of_absence': 'Ca muốn nghỉ',
  'waiting': 'Ca muốn đổi',
  'leave_approval': 'Được duyệt nghỉ phép'
};

const ShiftCard = ({ day, shifts, fullDate, onRightClick }) => {
  const [contextMenuPosition, setContextMenuPosition] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [hoveredShift, setHoveredShift] = useState(null);
  const [activeContextMenu, setActiveContextMenu] = useState(null);

  const handleRightClick = (e, shift) => {
    e.preventDefault();
    if (shift.note === 'success') {
      if (activeContextMenu === shift.id) {
        setActiveContextMenu(null);
      } else {
        setActiveContextMenu(shift.id);
        setSelectedShift({ ...shift, day, fullDate });
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
      }
    }
  };

  const handleContextMenuAction = (shift) => {
    onRightClick(shift);
    setActiveContextMenu(null);
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

  const shiftsToDisplay = [
    shifts.find(shift => shift.description === '1'),
    shifts.find(shift => shift.description === '2')
  ];

  return (
    <div
      className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 flex flex-col relative min-h-[200px] hover:bg-gray-50 transition-all duration-300"
      onClick={() => setActiveContextMenu(null)}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4 truncate">Ngày {day}</h3>

      <div className="flex-grow space-y-3 overflow-hidden">
        {shiftsToDisplay.map((shift, index) => {
          const isRegistered = shift?.registered;
          const statusText = isRegistered && shift.note ? noteToStatusText[shift.note] : null;

          const shiftColor = shift?.description === '1' ? 'bg-blue-100' : shift?.description === '2' ? 'bg-red-100' : 'bg-gray-100';

          return (
            <div
              key={shift ? shift.id : `empty-${index}`}
              className={`mb-3 p-3 rounded-lg cursor-pointer ${shiftColor} h-12 flex items-center justify-center ${hoveredShift === shift?.id ? 'bg-opacity-75' : ''}`}
              onContextMenu={(e) => shift && handleRightClick(e, shift)}
              onMouseEnter={() => shift && setHoveredShift(shift.id)}
              onMouseLeave={() => setHoveredShift(null)}
            >
              <p className="text-sm text-gray-600 truncate">
                {isRegistered && statusText && (
                  <span
                    className={`font-bold italic 
                      ${statusText === 'Đã đăng ký' ? 'text-green-600' :
                        statusText === 'Ca muốn nghỉ' ? 'text-blue-600' :
                          statusText === 'Ca muốn đổi' ? 'text-yellow-600' :
                            statusText === 'Được duyệt nghỉ phép' ? 'text-red-600' : 'text-gray-600'
                      }`}
                  >{statusText}</span>
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
            shift={{ ...selectedShift, date: fullDate }}
            position={contextMenuPosition}
            onDelete={(shift) => handleContextMenuAction(shift)}
            onClose={() => setActiveContextMenu(null)}
          />
        </div>
      )}
    </div>
  );
};

export default ShiftCard;