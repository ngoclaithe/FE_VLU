import React, { useState, useEffect } from 'react';
import { descriptionToTime } from '../../services/shiftUtils';
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
    if (activeContextMenu === shift.id) {
      setActiveContextMenu(null);
    } else {
      setActiveContextMenu(shift.id);
      setSelectedShift({...shift, day, fullDate});
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleContextMenuAction = (shift, actionType) => {
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

  return (
    <div
      className="bg-green-100 shadow-lg rounded-lg p-4 border border-gray-200 flex flex-col relative min-h-[200px] hover:bg-gray-50 transition-all duration-300"
      onClick={() => setActiveContextMenu(null)}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4 truncate">Ngày {day}</h3>

      <div className="flex-grow space-y-3 overflow-hidden">
        {shifts.map((shift) => {
          const isRegistered = shift.registered;
          const statusText = isRegistered && shift.note ? noteToStatusText[shift.note] : null;
          
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
                {isRegistered && statusText && (
                  <span 
                    className={`font-bold italic 
                      ${statusText === 'Đã đăng ký' ? 'text-green-600' : 
                        statusText === 'Ca muốn nghỉ' ? 'text-blue-600' : 
                        statusText === 'Ca muốn đổi' ? 'text-yellow-600' : 
                        statusText === 'Được duyệt nghỉ phép' ? 'text-red-600' : 'text-gray-600'
                      }`}
                  > ({statusText})</span>
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
            shift={{...selectedShift, date: fullDate}}
            position={contextMenuPosition}
            onRegister={(shift) => handleContextMenuAction(shift, 'register')}
            onDelete={(shift) => handleContextMenuAction(shift, 'delete')}
            onClose={() => setActiveContextMenu(null)} 
          />
        </div>
      )}
    </div>
  );
};

export default ShiftCard;