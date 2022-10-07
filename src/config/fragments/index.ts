import { developmentFragment } from './development';
import { dockerDevelopmentFragment } from './docker';

export const fragments = {
  // standard development fragment
  //   - will setup a full development environment easily
  //   - do not use in production, unsafe
  development: developmentFragment,

  // small docker dev fragment
  //   - run it along with the fragment `development`
  //   - overwrites some values of the development fragment for docker specifically
  dockerdev: dockerDevelopmentFragment,
};
