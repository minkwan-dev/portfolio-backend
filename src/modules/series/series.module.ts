import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Series } from "@/modules/series/series.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Series])],
})

export class SeriesModule {}