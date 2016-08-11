FROM ubuntu:latest
MAINTAINER Joe Hildebrand <joe-github@cursive.net>
RUN  echo 'Acquire::http { Proxy "http:////192.168.99.100:3142"; };' >> /etc/apt/apt.conf.d/01proxy
RUN apt-get install -y curl
# apt-get update is run by the node setup
# RUN apt-get update
RUN curl -sL https://deb.nodesource.com/setup_5.x | bash -
RUN apt-get install -y curl zlib1g-dev nodejs python python-pip python-dev ruby make libxml2 libxml2-dev libxslt-dev wkhtmltopdf
EXPOSE 8080
VOLUME /rfc
RUN pip install xml2rfc
RUN gem install kramdown-rfc2629

WORKDIR /rfc
RUN curl -o /tmp/prince.deb http://www.princexml.com/download/prince_10r7-1_ubuntu14.04_amd64.deb
RUN ls -l /tmp/prince.deb
RUN dpkg -i /tmp/prince.deb || true
RUN apt-get install -f -y
RUN rm /tmp/prince.deb

ADD package.json /rfc/package.json
RUN npm install
