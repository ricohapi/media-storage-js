# Ricoh Media Storage for JavaScript

Media Storage Javascript Library for Ricoh API.

## Requirements

You need

    Ricoh API Client Credentials (client_id & client_secret)
    Ricoh ID (user_id & password)

If you don't have them, please register yourself and your client from [THETA Developers Website](http://contest.theta360.com/).

## Install

```sh
$ npm install ricohapi-mstorage
```

## Uploading a JPEG file

```JavaScript
const MStorage = require('ricohapi-mstorage').MStorage;
const AuthClient = require('ricohapi-mstorage').AuthClient;

const client = new AuthClient('<your_client_id>', '<your_client_secret>');
client.setResourceOwnerCreds('<your_user_id>', '<your_password>');

const mstorage = new MStorage(client);
mstorage.connect()
.then(() => mstorage.upload('./upload_file_path.jpg'))
.then(() => console.log('uploaded'))
.catch(e => console.log(e));
```

## SDK API

### AuthClient

```JavaScript
const client = new AuthClient('<your_client_id>', '<your_client_secret>');
client.setResourceOwnerCreds('<your_user_id>', '<your_password>');
```

### Constructor

```JavaScript
const mstorage = new MStorage(<AuthClient object>);
```

### Connect to the server

```JavaScript
mstorage.connect()
```
A Promise is returned.

### Upload a file

```JavaScript
mstorage.upload('./upload_file_path.jpg')
```
A Promise is returned.

### Download a file

```JavaScript
mstorage.downloadTo('<media_id>', './download_file_path.jpg')
```
A Promise is returned.

### Download a file as blob

```JavaScript
mstorage.download('<media_id>', 'blob')
```
A Promise is returned.

### List media ids

```JavaScript
mstorage.list()
.then(list => console.log(list));

mstorage.list({limit: 25, after: '<cursor-id>'})
.then(list => console.log(list));
```

### Delete a file

```JavaScript
mstorage.delete('<media_id>')
```
A Promise is returned.

### Get information of a file

```JavaScript
mstorage.info('<media_id>')
.then(info => console.log(info))
```

### Get metadata of a file

```JavaScript
mstorage.meta('<media_id>')
.then(meta => console.log(meta))
```

