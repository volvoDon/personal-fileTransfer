import type { User, Note, File} from "@prisma/client";
import { prisma } from "~/db.server";
import { UploadHandler} from '@remix-run/node';
import {S3} from "aws-sdk";
import { Readable } from "stream";
require('dotenv').config();

const bucketname = process.env.BUCKET_NAME;
if (!bucketname) {
  console.error("Bucket name is required");
  process.exit(1); // Exit with error
}

export function getFileByNote(id: Note['id']) {
    return prisma.file.findFirst({
        select: {id:true,body:true,path:true},
        where: {noteId: id},
    });
};

export function getFile(id: File['id']) {
    return prisma.file.findFirst({
        where: {id: id}
    });
};

export function getFilesByNote(id: Note['id']) {
    return prisma.file.findMany({
        select: {id:true,body:true,path:true},
        where: {noteId: id},
    });
};


export function createFile(noteId: Note['id'], userId: User['id'], body: string,filePath: string) {
    const file =  prisma.file.create({
      data: {
        path: filePath,
        body: body,// Specify the file path or other attributes here
        note: {
          connect: { id: noteId }  // Connects this file to the Note with the given noteId
        },
        User: {
          connect: { id: userId }  // Connects this file to the User with the given userId
        }
      }
    });
    
    return file
};

export function getFilesByUser(userId: User['id']){
    prisma.file.findMany({
        select: {id: true, body: true},
        where: {userId: userId},
    });
};

// Configure AWS S3 with your credentials and region
const s3 = new S3({
  region: 'us-east-2',
});

export async function remove_file (file: {id: string, body: string, path:string}) {
  if(!bucketname) {return undefined}
  try{
    const deleted_s3 = await s3.deleteObject({
      Key: file.body,
      Bucket: bucketname,
    });
    const deleted_db = await prisma.file.delete({
      where: {id: file.id}
    });
  } catch (error) {
    throw new Error('nothing')
  };
};

async function* withSizeCheck(
  data: AsyncIterable<Uint8Array>, 
  maxPartSize: number
): AsyncIterable<Uint8Array> {
  let size = 0;
  for await (const chunk of data) {
      size += chunk.byteLength;
      if (size > maxPartSize) {
          throw new Error("File too large");
      }
      yield chunk;
  }
}


export function createS3uploadHandler(userId:string, noteId: string, maxPartSize:number): UploadHandler {
  return async ({ filename, data}) => {
    // If no filename, don't handle the upload.
    if (!filename) return undefined;
    if (!bucketname) return undefined;
  
    // Construct the Key for the S3 object. This could include a directory path.
    const Key = `uploads/${userId}_${filename}`;

    // Upload the file to S3
    try {
      const checkedData = withSizeCheck(data, maxPartSize);
      const stream = Readable.from(checkedData);
      const s3Response = await s3.upload({
        Bucket: bucketname,
        Key,
        Body: stream,
      }).promise();
  
      const db_file = await createFile(noteId,userId,s3Response.Key,s3Response.Location);
      if (!db_file) {
        throw new Error("failed to create db record")
      };

      return s3Response.Location;
    } catch (error) {
      throw new Error(`Error uploading file: ${error}`);
    }
  };
};



export const s3UploadHandler: UploadHandler = async ({ filename, data}) => {
  // If no filename, don't handle the upload.
  if (!filename) return undefined;

  // Construct the Key for the S3 object. This could include a directory path.
  const Key = `uploads/${filename}`;
  const stream = Readable.from(data);

  // Upload the file to S3
  try {
    const s3Response = await s3.upload({
      Bucket: bucketname,
      Key,
      Body: stream,
    }).promise();

    
    return s3Response.Location;
  } catch (error) {
    throw new Error(`Error uploading file: ${error}`);
  }
};
  
  


  
    