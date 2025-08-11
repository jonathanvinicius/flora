import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Resources from './resources/index';
import { SwaggerResource } from '@app/shared/resources/swagger.resources';

/**
 * Swagger doc builder
 */
export class SwaggerDoc {
  /**
   * Configure summary for API Tags
   */
  setupDocs(app: INestApplication) {
    const title = 'API FLORA';
    const description = `Flora API - Dictionary`;
    const version = '1.0.0';

    const serverUrl = process.env.APP_SERVER_URL;

    const config = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .setExternalDoc(`API FLORA`, 'Buscar palavras dicionario')
      //Bearer
      .addBearerAuth();

    if (serverUrl) {
      config.addServer(serverUrl);
    }

    const dr: SwaggerResource[] = Object.values(Resources);
    // swagger auto load
    dr.forEach((r: SwaggerResource) => {
      //inject data in docBuilder
      config.addTag(r.tag, r.description);
    });
    const swagger = config.build();
    const document = SwaggerModule.createDocument(app, swagger);
    SwaggerModule.setup('docs', app, document);
  }
}
