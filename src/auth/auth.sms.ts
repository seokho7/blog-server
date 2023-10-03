// import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import * as crypto from 'crypto';
import axios from 'axios';
import { DataBaseHealthCheckService } from 'src/health-check/health-check.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { smsResStep } from '../types/response';

@Injectable()
export class Sms {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly databaseHealthCheckService: DataBaseHealthCheckService,
  ) {}

  async createSignature(): Promise<string> {
    const serviceId = process.env.NAVER_SMS_SERVICE_ID; //서비스 ID
    const secretKey = process.env.NAVER_SMS_SECRET_KEY; // Secret Key
    const accessKey = process.env.NAVER_SMS_ACCESS_KEY; //Access Key
    const timeStamp = Date.now().toString();
    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(`POST /sms/v2/services/${serviceId}/messages\n`)
      .update(`${timeStamp}\n`)
      .update(`${accessKey}`);

    return hmac.digest('base64').toString();
  }

  async sendSms(userPhone: string): Promise<any> {
    let resResult: smsResStep = {
      resState : false
    };

    if (userPhone.length === 11) {
      const redisState = await this.databaseHealthCheckService.redisCheck();
      if(redisState.status === 'up'){
        const doubleCheck = await this.validateSms(userPhone);
        console.log(new Date())

        if(!doubleCheck){
          const codeMin = 100000; 
          const codeMax = 999999; 
          const authRandomNum = Math.floor(Math.random() * (codeMax - codeMin + 1)) + codeMin;
          const cacheTime = 180
          await this.redis.setex(String(userPhone), cacheTime, authRandomNum);
          const headers = {
            'Content-Type': 'application/json; charset=utf-8',
            'x-ncp-iam-access-key': process.env.NAVER_SMS_ACCESS_KEY,
            'x-ncp-apigw-timestamp': Date.now().toString(),
            'x-ncp-apigw-signature-v2': await this.createSignature(),
          };
          const reqBody = {
            type: 'SMS',
            contentType: 'COMM',
            countryCode: '82',
            from: process.env.SMS_PUSH_PHONE,
            content: `[SeokhoApp] 인증번호: ${authRandomNum}`,
            messages: [
              {
                to: userPhone,
              },
            ],
          };
          // const smsUrl = `https://sens.apigw.ntruss.com/sms/v2/services/${process.env.NAVER_SMS_SERVICE_ID}/messages`;
          // const result = await axios
          //   .post(smsUrl, reqBody, { headers })
          //   .then(async (res) => {
          //     resResult.resState = true;
          //     return resResult;
          //   })
          //   .catch((err) => {
          //     resResult.failStep = 'reTry'
          //     return resResult;
          //   });
            
          resResult.resState = true;
          return resResult
        }else{
          resResult.failStep = 'fastTry'
          return resResult;
        }
      }else{
        resResult.failStep = 'redisOff'
        return resResult;
      }
    } else {
      resResult.failStep = "reSubmit"
      return resResult;
    }
  }

  async validateSms(userPhone: string) {
    const getCacheCode = await this.redis.get(String(userPhone));
    console.log(getCacheCode)
    if(getCacheCode){
      return getCacheCode;
    }else{
      return false;
    }
  }
}
