import { useState } from 'react';
import { relevantEvents } from '../../lib/dates';
import { SanitizedDataSource } from '../../lib/types';

// const ContextMenu = () => {
//   const [contextMenuItems, setContextMenuItems] = useState<{ hoverIndex: number; visible: boolean }>({
//     hoverIndex: 0,
//     visible: false,
//   });
//   const [contextMenu, setContextMenu] = useState<{
//     visible: boolean;
//     x: number;
//     y: number;
//     day: number;
//     month: number;
//     year: number;
//   }>({
//     visible: false,
//     x: 0,
//     y: 0,
//     day: 0,
//     month: 0,
//     year: 0,
//   });

//   const sanitizedDataSource: SanitizedDataSource = [];

//   <div
//     className="absolute"
//     onContextMenu={e => e.preventDefault()}
//     onMouseLeave={() => setContextMenuItems({ hoverIndex: 0, visible: false })}
//     style={{ top: contextMenu.y, left: contextMenu.x }}
//   >
//     {relevantEvents({ ...contextMenu }, sanitizedDataSource).map((event, i) => {
//       return (
//         <div className="flex relative">
//           <div
//             id="contextmenutile"
//             className={`border border-gray-200 border-solid bg-white cursor-pointer flex items-center shadow-xl select-none h-9 hover:bg-gray-200 w-full`}
//             key={i}
//             onClick={() => console.log('hello')}
//             onMouseEnter={() => handleShowContextMenuItems(i)}
//           >
//             {getColorDiv(event)}
//             <div className={'flex-auto inline pl-2 '}>{event.name}</div>
//             <div className={'flex-none inline px-2'}>{'›'}</div>
//           </div>
//           {i === contextMenuItems.hoverIndex && contextMenuItems.visible && (
//             <div className="flex">
//               <div className={'absolute flex flex-col w-max'}>
//                 <div className="border border-gray-200 border-solid bg-white cursor-pointer flex items-center  shadow-xl select-none h-9 w-full hover:bg-gray-200 px-2 flex-auto inline">
//                   AAAAAAAAAAAAAAAAAAAAAAAAAA
//                 </div>
//                 <div className="border border-gray-200 border-solid bg-white cursor-pointer flex items-center  align-middle shadow-xl select-none h-9 w-full hover:bg-gray-200 px-2 flex-auto inline">
//                   AAAAAAAAAAAAAAAAAAAAAAAAAAA
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       );
//     })}
//   </div>;
// };

// export default ContextMenu;
