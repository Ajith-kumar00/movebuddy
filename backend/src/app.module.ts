import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FoldersModule } from './folders/folders.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb+srv://gajithkumar0011_db_user:VPusmC0nlz2MzOUM@cluster0.s5stlqg.mongodb.net/'),
    FoldersModule,
  ],
})
export class AppModule {}
