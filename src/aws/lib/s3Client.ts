import { S3Client } from "@aws-sdk/client-s3";

const REGION = process.env.REACT_APP_AWS_REGION
const ACCESSKEYID = process.env.REACT_APP_AWS_ACCESS_KEY_ID
const SECRETACCESSKEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY

const s3Client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: ACCESSKEYID ? ACCESSKEYID : "",
        secretAccessKey: SECRETACCESSKEY ? SECRETACCESSKEY : ""
    }
})

export {s3Client}