import { Logger } from '@nestjs/common';
import { KafkaLogger } from '@nestjs/microservices/helpers/kafka-logger';
import { Kafka, Message, Producer, Partitioners } from 'kafkajs';

import { IProducer } from './producer.interface';
import {sleep, retry} from './sleep'

export class KafkaProducer implements IProducer {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly logger: Logger;

  constructor(broker: string, private readonly topic?: string) {
    this.logger = new Logger(topic || KafkaProducer.name);
    this.kafka = new Kafka({
      clientId: 'user-service-app',
      brokers: broker.split(','),
      logCreator: KafkaLogger.bind(null, this.logger),
    });
    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
      metadataMaxAge: 0,
      retry: {
        retries: 5
      }
    });
  }

  async produce(topic: string, message: Message) {
    await this.producer.send({ topic, messages: [message] });
  }

  async sendMultiple(topic: string, messages: Message[]) {
    await this.producer.send({topic, messages})
  }
  async connect() {
    try {
      await this.producer.connect();
    } catch (err) {
      this.logger.error('Failed to connect to Kafka.', err);
       // await sleep(5000);
       await retry(this.producer.connect)
    }
  }

  async disconnect() {
    await this.producer.disconnect();
  }
}
