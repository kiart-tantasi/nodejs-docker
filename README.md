# Run
1. Run MySQL container
```
docker-compose up
```

2. Wait until MySql is ready and Start Nodejs app
```
node app.js
```

3. Test manaully

- Add a note into DB
```
http://localhost:4000/add-note/some-text?writer=me
```

- Get all notes from DB
```
http://localhost:4000
```


# Docker
## Build
```
docker build -t app .
```
**You need to provide accessible process.env.MYSQL_HOST while building image**

## Run
```
docker run -p 4000:4000 app
```
