from debian

# Ignore APT warnings about not having a TTY
ENV DEBIAN_FRONTEND noninteractive

# Install OS deps
RUN apt-get update \
    && apt-get dist-upgrade -y \
    && apt-get autoremove -y \
    && apt-get autoclean \
    && apt-get -y install dirmngr curl software-properties-common locales git cmake \
    && apt-get -y install autoconf automake g++ libtool \
    && apt-get -y install ffmpeg libmp3lame-dev x264 \
    && apt-get -y install sqlite3 libsqlite3-dev
