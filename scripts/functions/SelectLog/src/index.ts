import { Callback, Context } from "aws-lambda";
import * as AWS from "aws-sdk";
import { S3Event } from "./event";
import * as util from "util";

require('datejs');
const uuidv1 = require('uuid/v1');

const s3 = new AWS.S3();

const bucket = 'cookmate';
process.env.TZ = 'Asia/Tokyo';
const logdir = "log";
export function handler(event: any, context: Context, callback: Callback) 
{
    console.log(event);
    let uuid = uuidv1();
    let data = new Date();
    let formatted:string = data.toString('yyyy/MM/dd HH:mm:ss');

    let dumpdata:any = {
        "mkts"  : formatted,
    }
    var key = logdir+"/"+data.toString('yyyy/MM/')+uuid+'.json';

    var param =  {
        "Bucket": bucket,
        "Key"   : key,
        "Body"  : JSON.stringify(event),
        // "ACL": 'public-read',
        "ContentType": 'aplication/json',
    };
    s3.putObject(param , function(err, data){
        if(err){
            callback(err);
        }else{
            callback( err, {
                "s3key": key,
                "dumpdata": dumpdata
            }); 
        }
    });
}

