import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app.module';
import { ConfigService } from './config/config.service';
import { CustomLogger } from './frameworks/logger/logger.service';
import { FormatInterceptor } from './aop/format.interceptor';
import { CustomExceptionFilter } from './aop/exception.filter';
import { HTTPLabelsMiddleware } from './aop/labels.middleware';
import { ValidationPipe } from './aop/validation.pipe';
import { XMLParseMiddleware } from '@justajwolf/body-parser-xml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: CustomLogger.loggerLaunch,
    cors: true,
  });
  /* Express 中间件，顺序依次从上往下 */
  // 挂载全局http标签中间件
  app.use(HTTPLabelsMiddleware);
  app.use(XMLParseMiddleware());

  /* NestApp 全局components */
  // 注册全局dto转换校验管道
  app.useGlobalPipes(app.get(ValidationPipe));
  // 注册全局格式化拦截器
  app.useGlobalInterceptors(app.get(FormatInterceptor));
  // 注册全局自定义异常过滤器
  app.useGlobalFilters(app.get(CustomExceptionFilter));
  // 启动http服务端口监听

  const { port, env } = app.get(ConfigService);
  const envPort = process.env.HTTP_PORT;
  await app.listen(envPort || port);
  CustomLogger.loggerLaunch.log(
    `App loading config file is config.${env}.yaml [PORT: ${envPort || port}]`,
    'NestApplication',
  );
}
bootstrap();
