import { Module } from '@nestjs/common';
import { DataBaseHealthCheckService } from './health-check.service';

@Module({
    exports:[DataBaseHealthCheckService],
    providers:[DataBaseHealthCheckService]
})
export class HealthCheckModule {}
