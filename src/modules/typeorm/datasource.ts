/**
 * This file is used for typeorm cli, can be used as a datasource
 * For normal application usage, you can use ./index.ts's getSource()
 */

import { createSource } from './';
export const source = createSource();
