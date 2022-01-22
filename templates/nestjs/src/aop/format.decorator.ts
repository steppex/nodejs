import { SetMetadata } from '@nestjs/common';

import { SKIP_FORMAT_RES } from './constant';

export const SkipFormatRes = () => SetMetadata(SKIP_FORMAT_RES, true);
