# QwkBndl

## Introduction
QwkBndl is a file transfer service with a twist – it's also my portfolio showcase. Built with Remix.js, it allows users to attach multiple files to a "note", creating a "bundle". These bundles can be shared via a public URL, making it a functional MVP of the file bundling concept, with integrated user authentication. 

## Features
- **User Authentication**: Secure signup and login functionality.
- **Note Management**: Create notes that can act as descriptions or summaries for file bundles.
- **File Attachments**: Attach multiple files to a note, treating it as a "bundle".
- **Public URL Sharing**: Generate a link for each bundle to share publicly.
- **AWS S3 Integration**: Use AWS S3 for robust and scalable file storage.
- **SQL Database**: Manage user, note, and file data with an SQL database through the Prisma ORM.

## Tech Stack
- **Frontend**: Remix.js
- **Backend**: Node.js
- **Cloud Storage**: AWS S3
- **Database**: SQL Database with Prisma ORM
- **Authentication**: Simple Hashed Passwords are stored in Database (may add email verification)

## Local Development

You will need to configure your S3 bucket and create a .env containing your S3 credentials (create an AWS user with S3 permisions in IAM) Once you do that and initialize prisma it should work for you!

# !There is no paywall because it's my personal portfolio so I may have to delete it eventually if it gets abused!
