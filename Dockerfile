FROM node:22-bookworm

# install python
RUN apt-get update && apt-get install -y python3 python3-pip

# install python packages
RUN pip3 install matplotlib pillow --break-system-packages
# Install ffmpeg
RUN apt-get install -y ffmpeg

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
WORKDIR /app
RUN npm install

COPY . /app

RUN npx nx reset
RUN npx nx build frontend
RUN npx nx build dali-server
RUN npx nx build python

# python3 to python
RUN ln -s /usr/bin/python3 /usr/bin/python
RUN pip3 install moviepy --break-system-packages
# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 5001
EXPOSE 4300
ENTRYPOINT ["/entrypoint.sh"]
