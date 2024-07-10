import React from 'react';

const Topbar = () => {
  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-white shadow p-4 z-20">
      <button className="mx-2">Origin Port</button>
      <button className="mx-2">Middle Point(Optional)</button>
      <button className="mx-2">Destination Port</button>
      <button className="mx-2">Vessel</button>
    </div>
  );
};

export default Topbar;
