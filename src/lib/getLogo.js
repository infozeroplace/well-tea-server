import { System } from '../model/system.model.js';

const getLogo = async () => {
  const { logo } = await System.findOne({
    systemId: 'system-1',
  }).populate({
    path: 'logo',
    select: 'filepath alternateText',
  });

  return logo;
};

export default getLogo;
