import { Provider } from '@nestjs/common';
import config from 'config';
import { IConfig } from 'config';

export const CONFIG_TOKEN = 'CONFIG_TOKEN';

export const ConfigProvider: Provider<IConfig> = {
  provide: CONFIG_TOKEN,
  useFactory: (): IConfig => config,
};