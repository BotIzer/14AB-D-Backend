# 14AB-D-Backend

## Tests
To run tests you need docker, smtp4dev and some kind of command prompt.

With our script the smtp server runs on the localhost:8090, and the pop3 is on the localhost:2525

```cmd
docker run --rm -it -p 8090:80 -p 2525:25 rnwood/smtp4dev
```