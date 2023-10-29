import type { User, Note, File} from "@prisma/client";
import { prisma } from "~/db.server";
import { Readable } from 'stream';
import { Storage } from '@google-cloud/storage';
import { UploadHandler } from '@remix-run/node';

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
    return prisma.file.create({
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
};

export function getFilesByUser(userId: User['id']){
    prisma.file.findMany({
        select: {id: true, body: true},
        where: {userId: userId},
    });
};

const uploadStreamToCloudStorage = async (fileStream: Readable, fileName: string) => {
    const bucketName = 'YOUR_BUCKET_NAME';
  
    // Create Cloud Storage client
    const cloudStorage = new Storage();
  
    // Create a reference to the file.
    const file = cloudStorage.bucket(bucketName).file(fileName);
  
    async function streamFileUpload() {
      fileStream.pipe(file.createWriteStream()).on('finish', () => {
        // The file upload is complete
      });
  
      console.log(`${fileName} uploaded to ${bucketName}`);
    }
  
    streamFileUpload().catch(console.error);
  
    return fileName;
  };
  
  export const cloudStorageUploaderHandler: UploadHandler = async ({
    filename,
    stream: fileStream,
  }) => {
    return await uploadStreamToCloudStorage(fileStream, filename);
  };


  
    