// src/rabbitmq/rabbitmq.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly logger = new Logger(RabbitMQService.name);
  private readonly rabbitMqUrl: string;
  private readonly backupQueueName: string;

  constructor(private configService: ConfigService) {
    this.rabbitMqUrl = this.configService.get<string>('RABBITMQ_URL');
    this.backupQueueName = this.configService.get<string>('BACKUP_QUEUE_NAME');
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    try {
      this.connection = await amqp.connect(this.rabbitMqUrl);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.backupQueueName, { durable: true });
      this.logger.log(`Connected to RabbitMQ and asserted queue: ${this.backupQueueName}`);

      // Handle unexpected connection close
      this.connection.on('close', (err) => {
        this.logger.error('RabbitMQ connection closed!', err);
        // Implement reconnection logic here if needed for critical services
        setTimeout(() => this.connect(), 5000); // Try reconnecting
      });
      this.connection.on('error', (err) => {
        this.logger.error('RabbitMQ connection error!', err);
      });

    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
      // Try reconnecting after a delay
      setTimeout(() => this.connect(), 5000);
    }
  }

  private async disconnect() {
    if (this.channel) {
      await this.channel.close();
      this.logger.log('RabbitMQ channel closed.');
    }
    if (this.connection) {
      await this.connection.close();
      this.logger.log('RabbitMQ connection closed.');
    }
  }

  async sendBackupRequest(jobData: any): Promise<boolean> {
    if (!this.channel) {
      console.log('RabbitMQ channel is not available. Attempting to reconnect...');
      this.logger.error('RabbitMQ channel is not available. Retrying connection...');
      await this.connect(); // Try to reconnect
      if (!this.channel) {
        this.logger.error('Failed to send message: RabbitMQ channel still not available.');
        console.log('Failed to send message: RabbitMQ channel still not available.');
        return false;
      }
    }
    try {
      const success = this.channel.sendToQueue(
        this.backupQueueName,
        Buffer.from(JSON.stringify(jobData)),
        { persistent: true } // pesan akan tetap ada meski RabbitMQ restart
      );
      if (success) {
        this.logger.log(`Sent backup request for ${jobData.backupId} to queue: ${this.backupQueueName}`);
        console.log(`Sent backup request for ${jobData.backupId} to queue: ${this.backupQueueName}`, jobData);
      } else {
        this.logger.warn(`Failed to send backup request for ${jobData.backupId} to queue. Channel might be blocked.`);
        console.warn(`Failed to send backup request for ${jobData.backupId} to queue. Channel might be blocked.`);
      }
      return success;
    } catch (error) {
      this.logger.error(`Error sending message to RabbitMQ:`, error);
      console.error(`Error sending message to RabbitMQ:`, error);
      return false;
    }
  }


  async getQueueStatus(): Promise<any> {
    if (!this.channel) {
      return { status: 'down', message: 'Channel not initialized' };
    }
    try {
      const queueAssert = await this.channel.checkQueue(this.backupQueueName);
      return {
        status: 'up',
        queue: this.backupQueueName,
        messageCount: queueAssert.messageCount,
        consumerCount: queueAssert.consumerCount
      };
    } catch (error) {
       return { status: 'down', error: error.message };
    }
  }
}
