import { Module } from "@nestjs/common";
import { CONFIG_TOKEN, ConfigProvider } from "./config.provider";

@Module({
  providers: [ConfigProvider],
  exports: [CONFIG_TOKEN],
})
export class ConfigModule {}
