# iMap - Image manipulation tool
#### Extended from [Flask Starter Kit](https://github.com/brijeshb42/flask-web-starter-kit)

### Requirements:
* Python 2.7.x
* `node` with global installation of `gulp` and `bower`. Can be used without that global installations also.

### How to use ?
* Clone this repo.
* Create a new virtual environment `mkvirtualenv imap`.
* Switch to the new env `workon imap`.
* Install python modules `pip install -r requirements.txt`.
* Install node modules to compile assets `npm install`.
* Install bower packages `bower install`.
* Copy `config.py.default` to `config.py`.
* Make changes to `config.py` as required.
* Create a symlink to `bower_components` folder inside `frontend` : `cd frontend && ln -s ../bower_components/ bower_components`.
* Migrate DB (uses sqlite by default. Can be configured in `config.py`)
    * `python script.py db init`
    * `python script.py db migrate`
    * `python script.py db upgrade`
* Create a user to login to the web interface. User signup UI is not available. So it will have to be created using python shell:
    * `python script.py shell`
    * `u = AuthUser(username='user', password='pass')`
    * `db.session.add(u)`
    * `db.session.commit()`
* In separate terminal, `cd` into the `starter-kit` directory and run `gulp clean && gulp` to compile static assets and start a livereload server.
* Then run `python script.py runserver`
* Open `localhost:5000` in browser and login using the created user.
* Make sure to disable S3 uploads in `config.py` if you just want to save the images locally.
* If you have S3 enable, update these in `config.py` with relevant values:
    
    * UPLOAD_2_S3 = True
    * S3_ACCESS_KEY = "s3-access-key"
    * S3_SECRET = "s3-secret"
    * S3_BUCKET_MAIN = "main-bucket"
* For production environment, run `gulp prod` instead of only `gulp`.
* Theres a `Procfile` if you dont want to run `gunicorn` directly.
    * Just install `foreman`: `gem install foreman`
    * Activate virtualenv: `workon imap`.
    * Run `foreman start`.
