export declare interface S3Event {
    Records: Array<Record>
}
 
declare interface Record {
    eventVersion: string;
    eventSource: string;
    awsRegion: string;
    eventTime: string;
    eventName: string;
    userIdentity: UserIdentity;
    requestParameters: RequestParameters;
    responseElements: ResponseElements;
    s3: S3;
}
 
declare interface UserIdentity {
    principalId: string;
}
 
declare interface RequestParameters {
    sourceIPAddress: string;
}
 
declare interface ResponseElements {
    "x-amz-request-id": string;
    "x-amz-id-2": string;
}
 
declare interface S3 {
    s3SchemaVersion: string;
    configurationId: string;
    bucket: Bucket;
    object: Object;
}
 
declare interface Object {
    key: string;
    size: number;
    eTag: string;
    versionId: string,
    sequencer: string,
}
 
declare interface Bucket {
    name: string;
    ownerIdentity: UserIdentity;
    arn: string;
}

declare interface shopcode {
    name: string;
    arn: string;
}

declare interface Category {
    categorycode: string;
    categoryname: string;
    item_list: Array<Goods>;
}
declare interface Goods {
    itemname: string;
    itemid: string;
    itemurl: string;
}