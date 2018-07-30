### Ubuntu Install Procedure

#1. Clone Git to local repo on ubuntu 14 +.

There are some issues with the ubuntu packages, so it's easier to go the NVM route for more consistant results.

#2. Install and update NVM (Node Version Manager)

```sudo curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash```
```sudo export NVM_DIR="/home/ubuntu/.nvm" ```

```sudo [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"```

```sudo nvm install node```

#4. Link Node to Node.js

```sudo sudo ln -s /home/ubuntu/.nvm/versions/node/v10.5.0/bin/node /usr/bin/nodejs```

#5. Install Yarn

```curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -```
```echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list```
```sudo apt-get update && sudo apt-get install yarn```

#6. Navigate to private folder and run yarn 

```cd /home/ubuntu/mailerNode/Private/```
```yarn```