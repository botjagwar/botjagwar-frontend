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

### Minimal for dictionary_service.py and PostgREST

dictionary_service.py is a word storage engine. REST API required by the `wiktionary_irc.py` to store and get translations.

This API has been tested and used on MySQL (manual test), SQLite (automatic test) and PostgreSQL databases (manual test) thanks to SQLAlchemy. For the best performance and mostly if you want to use the frontend application, please use PostgreSQL.

dictionary_service specifies most routes and contains the code necessary to build and populate the botjagwar database. All CRUD features for the database are implemented thanks to SQLAlchemy ORM.

PostgREST provides an off-the-shelf, lightning-fast and almost complete REST API and was currently deemed suitable to support the frontend's READ calls through views. More are coming as the project has just started.

A PostgREST binary for is available in /bin folder, but feel free to download the most recent version at [PostgREST official repository](https://github.com/PostgREST/postgrest/releases)

#### Nice to haves
- pg-safeupdate: delete and update data safely so that dangerous queries (with no filters, e.g. delete statements) are blocked.

## Running it
Set up backend services:
- Download, install and configure [botjagwar](https://github.com/radomd92/botjagwar)
 - Database, for best performance, should be PostgreSQL
- Download botjagwar-frontend repo
 - run `install.sh` as sudo
- Run `dictionary_service.py`, using screen to keep it running: `screen python3 /opt/botjagwar/dictionary_service.py`
- Service should run on 8001
- Run Nginx server `sudo nginx -p /opt/botjagwar-front  -c /opt/botjagwar-front/config/nginx/nginx.conf`
- Server should serve at port 8080
- Run PostgREST backend using either the binary included in the repository herein, or downloaded from the official repository:
  `./bin/postgrest ./config/postgres/postgrest.conf`
- PostGREST should serve on port 8100

## Navigating the web app
You'll find below a short summary for each feature currently implemented in the web app.

### Search
Enter your term on the search bar, upon clicking on ENTER, you'll land on the search page containing the word matching the search string. You can use SQL wildcards to refine your search.
You'll also find definitions that contains occurrences of the entered string.

### Main page
Contains a list of languages currently entered in the database.

### Recent changes
Contains the most recently added words and definitions.

### Dictionary
Basically all words of a given language. Please note that the number of returned results may be capped by the backend (you can lift this limit in the PostgREST configuration). Please note that languages containing a large number of words may slow down your browser and/or the database server. 

### Words
Visualise any word. To visualise all languages having the same term, click on the word.
You can also delete and add definition as you see fit. Click on save to commit the changes to the database. 

### Definitions
Visualise a definition and see its uses in the database. Useful to perform fixes and visualise the impact of your change.

## Technical notes
- The main Dictionary currently makes use of a materialized view that must currently be updated manually. You can add a cron task to do the job. 
- The materialized view was to speed up the rendering on slow computers at the expense of not being totally synchronous and space (DB size increase 10x initial space usage). 
- On fast computers using e.g. SSD, replace the materialized view  with the normal view.

Consequences:
- the words page use vw_json_dictionary (normal view) whereas the dictionary page use json_dictionary (materialized view)

## Authors

- Rado Andrianjanahary

