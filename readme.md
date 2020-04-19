This is a web frontend for botjagwar application.

The frontend Web application makes use of Bootstrap 4, Datatables, VueJS, and Nginx.
With PostgreSQL backend, PostgREST is used to lessen the load on `dictionary_service` for read operations. Nginx acts as a proxy which redirect requests to either `dictionary_service` or PostgREST APIs.

The backend code including `dictionary_service` and all scripts are stored at [botjagwar](https://github.com/radomd92/botjagwar).

## Contents

This repository contains the following things:
- Nginx configuration for frontend;
- PostgREST configuration for backend;
- PostgreSQL views for some complex data representation for use by PostgREST;
- Static pages for the application, one page per feature (as of current)


## Requirements

### Minimal: botjagwar/dictionary_service.py

Word storage engine. REST API required by the `wiktionary_irc.py` to store and get translations.

This API has been tested and used on MySQL (manual test), SQLite (automatic test) and PostgreSQL databases (manual test) thanks to SQLAlchemy. For the best performance and mostly if you want to use the frontend application, please use PostgreSQL.

### Recommended: minimal + PostgREST

dictionary_service specifies most routes and contains the code necessary to build and populate the botjagwar database. All CRUD features for the database are implemented thanks to SQLAlchemy ORM.

PostgREST provides an off-the-shelf, lightning-fast and almost complete REST API and was currently deemed suitable to support the frontend's READ calls through views. More are coming as the project has just started.

A PostgREST binary for is available in /bin folder, but feel free to download the most recent version at [PostgREST official repository](https://github.com/PostgREST/postgrest/releases)

## Running it
Set up backend services:
- Download and install [botjagwar](https://github.com/radomd92/botjagwar)
- Download botjagwar-frontend repo
 - run `install.sh` as sudo
- Run `dictionary_service.py`, using screen to keep it running: `screen python3 /opt/botjagwar/dictionary_service.py` 
- Run Nginx server `sudo nginx -p /opt/botjagwar-front  -c /opt/botjagwar-frontnginx.conf`
- Server should serve at port 8080

## Authors

- Rado Andrianjanahary

