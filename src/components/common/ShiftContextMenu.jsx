import React from 'react';

const ShiftContextMenu = ({ shift, onDelete, onClose, position }) => {
  return (
    <div
      className="fixed z-50 bg-white border rounded-lg shadow-lg p-2 w-40"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`
      }}
    >
      {shift.registered && (
        <button
          onClick={() => { onDelete(shift); onClose(); }}
          className="w-full text-left mb-2"
        >
          Xin nghỉ ca trực
        </button>
      )}
    </div>
  );
};

export default ShiftContextMenu;