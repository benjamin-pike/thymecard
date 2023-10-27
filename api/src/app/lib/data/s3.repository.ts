import AWS from 'aws-sdk';

export class S3Repository {
    private s3: AWS.S3;
    private bucketName: string;

    constructor(accessKeyId: string, secretAccessKey: string, region: string, bucketName: string) {
        this.s3 = new AWS.S3({
            accessKeyId,
            secretAccessKey,
            region
        });
        this.bucketName = bucketName;
    }

    public async uploadFile(file: Buffer, filename: string, extention: string, dir: string): Promise<void> {
        try {
            await this.s3
                .upload({
                    Bucket: this.bucketName,
                    Key: `${dir}/${filename}.${extention}`,
                    Body: file
                })
                .promise();
        } catch (err: any) {
            throw new Error(err);
        }
    }

    public async deleteFile(filename: string, dir: string): Promise<void> {
        try {
            await this.s3
                .deleteObject({
                    Bucket: this.bucketName,
                    Key: `${dir}/${filename}`
                })
                .promise();
        } catch (err: any) {
            throw new Error(err);
        }
    }
}
