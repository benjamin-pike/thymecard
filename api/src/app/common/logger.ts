import winston from 'winston';

const keyOrder = [
    'level',
    'message',
    'timestamp',
    'internalCode',
    'origin',
    'httpCode',
    'url',
    'requestId',
    'headers',
    'params',
    'query',
    'body',
    'data'
];

const orderKeys = winston.format.printf((info) => {
    const orderedOutput: Record<string, any> = {};
    keyOrder.forEach((key) => {
        if (info[key]) {
            orderedOutput[key] = info[key];
        }
    });
    return JSON.stringify(orderedOutput);
});

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), orderKeys),
    transports: [new winston.transports.File({ filename: './logs/logfile.log' })]
});
