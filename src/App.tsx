// Copyright 2023 JWF Process Solutions Ltd. - All Rights reserved
// Author: Cameron Mair
import React, { useState } from 'react';
import Calendar from 'rc-year-calendar';
import Modal from './assets/Modal';
import MyCalendar from './components/MyCalendar';

function App() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

  const dataSource = [
    {
      id: 1,
      color: '#ABCDEF',
      startDate: new Date(2023, 7, 8),
      endDate: new Date(2023, 9, 9),
      name: 'I am on holiday',
    },
  ];

  const handleRangeSelected = (startDate: Date, endDate: Date) => {
    setStart(startDate);
    setEnd(endDate);
    setShowModal(true);
  };

  return (
    <React.StrictMode>
      {showModal && (
        <Modal
          onClose={(startDate, endDate) => {
            setShowModal(false);
            console.log(endDate, startDate);
          }}
        >
          <div>{start?.toISOString()}</div>
          <div>{end?.toISOString()}</div>
        </Modal>
      )}
      
      <MyCalendar enableRangeSelection={true} onRangeSelected={e => console.log(e)} weekStart={0} />
      
      <Calendar
        contextMenuItems={[
          { text: 'Delete', click: () => console.log(1) },
          { text: 'Delete', click: () => console.log(2) },
          { text: 'Delete', click: () => console.log(3) },
          { text: 'Delete', click: () => console.log(4) },
        ]}
        dataSource={dataSource}
        enableContextMenu={true}
        enableRangeSelection={false}
        onRangeSelected={(e: { startDate: Date; endDate: Date }) => handleRangeSelected(e.startDate, e.endDate)}
        onYearChanged={(e: { currentYear: number }) => console.log(e.currentYear)}
        year={2038}
      />
    </React.StrictMode>
  );
}

export default App;
