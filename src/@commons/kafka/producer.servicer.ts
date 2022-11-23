import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaProducer } from './kafkajs.producer';
import { IProducer } from './producer.interface';

@Injectable()
export class ProducerService implements OnApplicationShutdown {
  private readonly producers = new Map<string, IProducer>();
  private readonly producer: KafkaProducer;
  constructor(private readonly configService: ConfigService) {
    this.producer = new KafkaProducer(this.configService.get('KAFKA_BROKER'));
  }

  async produce(topic: string, message: { value: string; key: string }) {
    // const producer = await this.getProducer(topic);

    await this.producer.produce(topic, message);
  }

  async produceMany(topic: string, message: {value: string, key: string}[]) {
    await this.producer.sendMultiple(topic, message)
  }
  private async getProducer(topic: string) {
    let producer = this.producers.get(topic);
    if (!producer) {
      producer = new KafkaProducer(
        this.configService.get('KAFKA_BROKER'),
        topic,
      );
      await producer.connect();
      this.producers.set(topic, producer);
    }
    return producer;
  }

  async connect() {
    await this.producer.connect();
  }
  async onApplicationShutdown() {
    for (const producer of this.producers.values()) {
      await producer.disconnect();
    }
  }
}
