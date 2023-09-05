import React from 'react';

const hideContextMenu = (
  e: MouseEvent,
  contextMenu: {
    visible: boolean;
    x: number;
    y: number;
    day: number;
    month: number;
    year: number;
  },
  setContextMenu: React.Dispatch<
    React.SetStateAction<{
      visible: boolean;
      x: number;
      y: number;
      day: number;
      month: number;
      year: number;
    }>
  >
) => {
  if (e.target instanceof HTMLElement) {
    if (e.target.id === 'contextmenutile' || e.target.parentElement?.id === 'contextmenutile') {
      return;
    }
  }
  setContextMenu({ ...contextMenu, visible: false });
};
export default hideContextMenu;
