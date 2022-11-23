export interface IProducer {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  produce: (topic, message: any) => Promise<void>;
}
