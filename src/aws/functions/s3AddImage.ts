import { PutObjectCommand, PutObjectCommandInput, PutObjectCommandOutput } from "@aws-sdk/client-s3";
import { s3Client } from "../lib/s3Client";

const s3AddImage = async(file: File): Promise<string | undefined> => {
    try{
        const params: PutObjectCommandInput = {
            Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
            Key: file.name,
            Body: new Blob([await file.arrayBuffer()])
        }
        const data: PutObjectCommandOutput = await s3Client.send(new PutObjectCommand(params))
        return data ? file.name : undefined
    }catch(e){
        console.log(e)
    }
}

export default s3AddImage