FROM postgres:15

RUN apt-get update \
  && apt-get install -y -V ca-certificates lsb-release wget \
  && wget https://apache.jfrog.io/artifactory/arrow/$(lsb_release --id --short | tr 'A-Z' 'a-z')/apache-arrow-apt-source-latest-$(lsb_release --codename --short).deb \
  && apt-get install -y -V ./apache-arrow-apt-source-latest-$(lsb_release --codename --short).deb \
  && wget https://packages.groonga.org/debian/groonga-apt-source-latest-$(lsb_release --codename --short).deb \
  && apt-get install -y -V ./groonga-apt-source-latest-$(lsb_release --codename --short).deb \
  && echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release --codename --short)-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list \
  && wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
  && apt-get update \
  && apt-get install -y -V postgresql-15-pgdg-pgroonga groonga-tokenizer-mecab
