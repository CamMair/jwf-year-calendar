import { DataSource, SanitizedDataSource } from '../../lib/types';
import { isHexColor, isTailwindColor } from '../../lib/utils';

export const sanitizeDataSource = (dataSource: DataSource): SanitizedDataSource => {
  const defaultColors = ['#2C8FC9', '#9CB703', '#F5BB00', '#FF4A32', '#B56CE2', '#45A597'];

  return dataSource.map(event => {
    const color = event.color !== undefined ? event.color : defaultColors.shift();
    if (color === undefined) {
      throw new Error(`No default color available for Calendar component`);
    }

    if (!isTailwindColor(color) && !isHexColor(color)) {
      throw new Error(`Invalid color prop "${color}" provided to Calendar component`);
    }

    return { ...event, color };
  });
};
