// Copyright 2023 JWF Process Solutions Ltd. - All Rights reserved
// Author: Cameron Mair
import React, { useState } from 'react';
import Calendar from 'rc-year-calendar';
import Modal from './assets/Modal';
import MyCalendar from './components/myCalendar/MyCalendar';
import { ContextMenuItem, DataSource } from './lib/types';

function App() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

  const contextMenuItem: ContextMenuItem = { text: 'Create' };

  const dataSource: DataSource = [
    {
      id: 1,
      startDate: {
        day: 1,
        month: 1,
        year: 2023,
      },
      endDate: {
        day: 15,
        month: 1,
        year: 2023,
      },
      name: 'Rome',
    },
    {
      id: 2,
      startDate: {
        day: 1,
        month: 1,
        year: 2023,
      },
      endDate: {
        day: 21,
        month: 2,
        year: 2023,
      },
      name: 'Berlin',
    },
    {
      id: 3,
      startDate: {
        day: 11,
        month: 1,
        year: 2023,
      },
      endDate: {
        day: 21,
        month: 1,
        year: 2023,
      },
      name: 'Paris',
    },
    {
      id: 4,
      startDate: {
        day: 11,
        month: 1,
        year: 2023,
      },
      endDate: {
        day: 25,
        month: 1,
        year: 2023,
      },
      name: 'Glasgow',
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

      <MyCalendar
        dataSource={dataSource}
        contextMenuItem={contextMenuItem}
        enableRangeSelection={true}
        onRangeSelected={e => console.log(e)}
        weekStart={0}
      />

      <Calendar
        contextMenuItems={[
          { text: 'Create', click: () => console.log(1) },
          { text: 'Read', click: () => console.log(2) },
          { text: 'Update', click: () => console.log(3) },
          { text: 'Delete', click: () => console.log(4) },
        ]}
        dataSource={[
          {
            id: 1,
            color: '#1DFAD8',
            startDate: new Date(2023, 9, 13),
            endDate: new Date(2023, 9, 15),
            name: 'Crete',
          },
          {
            id: 2,
            color: '#1D4EA1',
            startDate: new Date(2023, 9, 15),
            endDate: new Date(2023, 9, 16),
            name: 'Greece',
          },
          {
            id: 3,
            color: '#9F4ED8',
            startDate: new Date(2023, 9, 13),
            endDate: new Date(2023, 9, 15),
            name: 'Spain',
          },
          {
            id: 4,
            color: '#1F8AA8',
            startDate: new Date(2023, 9, 14),
            endDate: new Date(2023, 9, 15),
            name: 'Portugal',
          },
        ]}
        enableContextMenu={true}
        enableRangeSelection={true}
        onRangeSelected={(e: { startDate: Date; endDate: Date }) => handleRangeSelected(e.startDate, e.endDate)}
        onYearChanged={(e: { currentYear: number }) => console.log(e.currentYear)}
        year={2023}
      />
    </React.StrictMode>
  );
}

export default App;
