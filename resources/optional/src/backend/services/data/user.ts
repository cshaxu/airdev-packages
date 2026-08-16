/* "@airdev/next": "seeded" */

import AirdevUserService from '@/airdev/backend/services/data/user-base';
import { omit } from 'lodash-es';

const UserService = {
  ...omit(AirdevUserService, 'buildDeleteOne'),
  deleteOne: AirdevUserService.buildDeleteOne([]),
};

export default UserService;
