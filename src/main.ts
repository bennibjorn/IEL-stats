import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const port = process.env.PORT || 3000

	const config = new DocumentBuilder()
		.setTitle('RÍSÍ mót API')
		.setDescription('API sem skilar gögnum tengdum mótum RÍSÍ')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('swagger', app, document);

	await app.listen(port, () => {
		console.log(`App is listening on port ${port}`);
	});
}
bootstrap();
