import { Module } from '@nestjs/common';
//import { ConsumerService } from './consumer.service';
import { ProducerService } from './producer.servicer';

@Module({
  providers: [ProducerService],
  exports: [ProducerService],
})
export class KafkaModule {}
