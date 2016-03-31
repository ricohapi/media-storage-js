# Ricoh Media Storage for JavaScript

Media Storage Javascript Library using Ricoh API.

## Requirements

You need

    Ricoh API Client Credentials (client_id & client_secret)
    Ricoh ID (user_id & password)

If you don't have them, please register them at [THETA Developers Website](http://contest.theta360.com/).

## Install

```sh
$ npm install ricohapi-mstorage
```

## Upload a .jpg file

```sh
const MStorage = require('ricohapi-mstorage').MStorage;
const AuthClient = require('ricohapi-mstorage').AuthClient;

const client = new AuthClient('<your_client_id>', '<your_client_secret>');
client.setResourceOwnerCreds('<your_user_id>', '<your_password>');

const mstorage = new MStorage(client);
mstorage.connect()
.then(() => mstorage.upload('./upload_file_path.jpg'))
.then(() => console.log('uploaded')
.catch(e => console.log(e));
```

## SDK API

### AuthClient

```sh
const client = new AuthClient('<your_client_id>', '<your_client_secret>');
client.setResourceOwnerCreds('<your_user_id>', '<your_password>');
```

### Constructor

```sh
const mstorage = new MStorage(<AuthClient object>);
```

### Connect to the server

```sh
mstorage.connect()
```
A Promise is returned.

### Upload a file

```sh
mstorage.upload('./upload_file_path.jpg')
```
A Promise is returned.

### Download a file

```sh
mstorage.downloadTo('<media_id>', './download_file_path.jpg')
```
A Promise is returned.

### List media ids

```sh
mstorage.list()
.then(list => console.log(list));

mstorage.list({limit: 25, after: '<cursor-id>'})
.then(list => console.log(list));
```

### Delete a file

```sh
mstorage.delete('<media_id>')
```
A Promise is returned.

### Get information of a file

```sh
mstorage.info('<media_id>')
.then(info => console.log(info))
```

### Get metadata of a file

```sh
mstorage.inspect('<media_id>')
.then(meta => console.log(meta))
```

